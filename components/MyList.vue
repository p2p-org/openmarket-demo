<template>
    <b-container>
      <b-row class="">
        <b-col md="3">
          <b-card>
            <b-form-group label="Rankings">
              <b-form-checkbox-group
                v-model="selected"
                :options="options"
                name="flavour-2a"
                stacked
              ></b-form-checkbox-group>
            </b-form-group>
          </b-card>
        </b-col>
        <b-col>
          <b-navbar>
            <b-navbar-nav>
              <b-nav-form>
                <b-form-group class="mr-2">
                  <b-form-radio-group
                    v-model="filter.market.current"
                    :options="filter.market.options"
                    buttons
                    button-variant="outline-secondary"
                    name="radio-btn-outline"
                    size="sm"
                  />
                </b-form-group>

              </b-nav-form>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-form>
                <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                <b-button size="sm" class="my-2 my-sm-0" type="submit" variant="primary">Search</b-button>
              </b-nav-form>
            </b-navbar-nav>
          </b-navbar>
          <b-card v-if="!owner" body-class="text-center">waiting for user</b-card>
          <b-card v-else-if="!nftsFiltered.length" body-class="text-center">you do not own any tokens</b-card>
          <template v-else>
          <b-card-group deck>
            <!--              :title="nft.meta.name"-->
            <!--              :image="nft.meta.image"-->
            <!--              :price="nft.price"-->
            <!--              :id="nft.id"-->
            <my-card
              v-for="nft in nftsPaged"
              :key="nft.id"
              :nft="nft"
              :rate="rateETH"
            ></my-card>
<!--            {{ nfts }}-->
          </b-card-group>
          <b-pagination-nav v-model="currentPage" :link-gen="linkGen" :number-of-pages="numberOfPages" use-router  align="center"/>

          </template>

        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import MyCard from './MyCard'
import SortDropdown from './form/SortDropdown'

export default {
  name: 'MyList',
  components: { SortDropdown, MyCard },
  props: {
    owner: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      rateETH: 123123,
      perPage: 6,
      currentPage: null,
      selected: null,
      options: ['Param 0', 'Param 1', 'Param 2'],
      // asc - true, desc - false
      sort: {
        _current: {
          parameter: 'price',
          value: 'asc',
        },
        price: {
          current: null,
          cmpFunc: this.cmpPrice,
          options: [
            {
              value: null,
              text: '- sort by price -',
            },
            {
              value: 'asc',
              text: 'Price low to high',
            },
            {
              value: 'desc',
              text: 'Price high to low',
            },
          ],
        },
        time: {
          current: null,
          cmpFunc: this.cmpTime,
          options: [
            {
              value: null,
              text: '- sort by novelty -',
            },
            {
              value: 'asc',
              text: 'Newest first',
            },
            {
              value: 'desc',
              text: 'Oldest first',
            },
          ],
        },
      },
      filter: {
        _current: {
          parameter: 'market',
          value: null,
        },
        market: {
          current: null,
          options: [
            {
              value: null,
              text: 'All',
            },
            {
              value: 0,
              text: 'Free',
            },
            {
              value: 1,
              text: 'Fixed price',
            },
            {
              value: 2,
              text: 'Auction',
            },
          ],
        },
      },
    }
  },
  computed: {
    ...mapState({
      nfts: state => state.market.nfts,
    }),
    nftsFiltered() {
      return this.nfts
        .filter(n => {
          return n.owner_address === this.owner
        })
        .filter(n => {
          return this.filter.market.current === null || n.status === this.filter.market.current
        })
        .sort((a, b) => {
          return this.sort[this.sort._current.parameter].cmpFunc(a, b, this.sort._current.value === 'asc')
          // return this.sortFunc(a[this.sort._current.parameter], b[this.sort._current.parameter], this.sort._current.value === 'asc')
        })
    },
    nftsPaged() {
      const curPage = this.currentPage || 1
      console.log((curPage - 1) * this.perPage, curPage * this.perPage)
      return this.nftsFiltered.slice((curPage - 1) * this.perPage, curPage * this.perPage)
    },
    numberOfPages() {
      return this.nftsFiltered.length ? Math.ceil(this.nftsFiltered.length / this.perPage) : 1
    }
  },
  watch: {
    owner(owner) {
      this.queryNft({ force: true, params: { owner } })
    },
  },
  mounted() {
    this.queryNft({ force: true, params: { owner: this.owner } })
  },
  methods: {
    ...mapActions('market', ['queryNft']),
    linkGen(pageNum) {
      return pageNum === 1 ? '?' : `?page=${pageNum}`
    },
    // changeSortTime(value) {
    //   this.sort.time.current = value
    // },
    // changeSortPrice(value) {
    //   this.sort.price.current = value
    // },

    changeSortTime(value) {
      this.updSort('time', value)
    },
    changeSortPrice(value) {
      this.updSort('price', value)
    },
    updSort(parameter, value) {
      // if (this.sort._current.parameter && this.sort[this.sort._current.parameter]) {
      this.sort[this.sort._current.parameter].current = null
      // }
      this.sort._current = { parameter, value }
      this.sort[parameter].current = value
    },

    cmpPrice(a, b, asc = true) {
      const valA = parseInt(a.price.value || a.opening_price.value || 0)
      const valB = parseInt(b.price.value || b.opening_price.value || 0)
      // if (a.currency === b.currency) {
      return asc ? valA - valB : valB - valA
      // }
      // return 0
    },
    cmpTime(a, b, asc = true) {
      a = a.created_at
      b = b.created_at
      if (this.$moment.isMoment(a) && this.$moment.isMoment(b)) {
        // If both compared fields are moment instance
        return a.isBefore(b) ? (asc ? -1 : 1) : a.isAfter(b) ? (asc ? 1 : -1) : 0
      }
      return 0
    },

  }
}
</script>

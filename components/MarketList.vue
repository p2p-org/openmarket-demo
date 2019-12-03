<template>
  <b-container>
    <b-row class="">
      <b-col md="3">
        <b-card>
          <template v-if="nfts.length">
            <b-form-group
              v-for="p in nfts[0].meta.properties.filter(x => x.display === null)"
              :key="p.trait"
              :label="p.trait.toUpperCase()"
            >
              <b-form-checkbox-group v-model="selected[p.trait]" :options="nfts[0].meta.definitions[p.trait]" stacked />
            </b-form-group>
          </template>
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

              <sort-dropdown :value="sort.time.current" :options="sort.time.options" @change="changeSortTime" />
              <sort-dropdown :value="sort.price.current" :options="sort.price.options" @change="changeSortPrice" />

              <!--              <b-dropdown size="sm" variant="outline-secondary">-->
              <!--                <b-dropdown-item-button v-for="opt in sortOptsTime" :key="opt.value" @click.prevent="setSortOptTime(opt.value)">{{ opt.text }}</b-dropdown-item-button>-->
              <!--                <template v-slot:button-content>-->
              <!--                  {{ currentSortOptTime.text }}-->
              <!--                </template>-->
              <!--              </b-dropdown>-->
            </b-nav-form>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form @submit.prevent="doSearch">
              <b-input-group>
                <b-form-input id="input-nft-list" v-model="innerSearch" list="input-list" size="sm" placeholder="Search" />
                <b-form-datalist id="input-list" :options="suggestions" />
                <b-input-group-append>
                  <b-button variant="outline-primary" size="sm" type="submit">
                    <fa :icon="['fas', 'search']" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
              <!--              <b-button size="sm" class="my-2 my-sm-0" type="submit" variant="primary">-->
              <!--                Search-->
              <!--              </b-button>-->
            </b-nav-form>
          </b-navbar-nav>
        </b-navbar>
        <b-card v-if="!nftsFiltered.length" body-class="text-center">
          no items yet
        </b-card>
        <market v-else>
          <!--          <b-card-group v-if="nftsPaged.length" deck>-->
          <!--              :title="nft.meta.name"-->
          <!--              :image="nft.meta.image"-->
          <!--              :price="nft.price"-->
          <!--              :id="nft.id"-->
          <transition-group v-if="nftsPaged.length" name="flip-list" tag="div" class="card-deck">
            <market-card v-for="nft in nftsPaged" :key="nft.id" :nft="nft" :rate="rateETH" />
          </transition-group>
          <!--            {{ nfts }}-->
          <!--          </b-card-group>-->

          <b-pagination-nav v-model="currentPage" :link-gen="linkGen" :number-of-pages="numberOfPages" use-router align="center" />
        </market>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import SortDropdown from './form/SortDropdown'
import MarketCard from './MarketCard'
import Market from './Market'

export default {
  name: 'MarketList',
  components: { Market, MarketCard, SortDropdown },
  props: {
    // buyer: {
    //   type: String,
    //   default: null,
    // },
    owner: {
      type: String,
      default: null,
    },
    search: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      perPage: 6,
      currentPage: null,

      innerSearch: null,

      selected: {},
      options: ['All', 'Fixed price', 'Auction'],

      // asc - true, desc - false
      sort: {
        _current: {
          parameter: 'price',
          value: 'asc',
        },
        price: {
          current: null,
          sortFunc: this.sortPrice,
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
          sortFunc: this.sortTime,
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
      rateETH: state => state.config.rateETH,
    }),
    ...mapGetters('market', ['findNft']),
    ...mapGetters('user', ['currentUser']),
    // sortFunc() {
    //   return this.sort[this.sort._current.parameter].cmpFunc
    // },
    nftsFiltered() {
      const tmpNfts = this.nfts
        .filter(n => {
          const traits = Object.keys(this.selected)
          if (!traits.length) return true
          return n.meta.properties.reduce((s, p) => s & (this.selected[p.trait] && this.selected[p.trait].length ? this.selected[p.trait].includes(p.value) : true), true)
        })
        .filter(
          n =>
            (this.owner ? n.owner.address === this.owner : true) &&
            (this.innerSearch
              ? n.token_id.includes(this.innerSearch) ||
                this.nftMetaProp(n.meta, 'name')
                  .value.toLowerCase()
                  .includes(this.innerSearch) ||
                this.nftMetaProp(n.meta, 'description')
                  .value.toLowerCase()
                  .includes(this.innerSearch)
              : true)
        )
        .filter(n => !this.filter.market.current || n.status === this.filter.market.current)
      return this.sort[this.sort._current.parameter].sortFunc(tmpNfts, this.sort._current.value === 'asc')
    },
    nftsPaged() {
      const curPage = this.currentPage || 1
      // console.log((curPage - 1) * this.perPage, curPage * this.perPage)
      return this.nftsFiltered.slice((curPage - 1) * this.perPage, curPage * this.perPage)
    },
    numberOfPages() {
      return this.nftsFiltered.length ? Math.ceil(this.nftsFiltered.length / this.perPage) : 1
    },
    suggestions() {
      return this.nfts.map(n => ({ text: this.nftMetaProp(n.meta, 'name').value, value: n.token_id }))
    },
    buyer() {
      return this.currentUser ? this.currentUser.address : null
    },
  },
  watch: {
    // currentPage(p) {
    //   this.reloadNftPage(p)
    // }
    numberOfPages(n) {
      this.currentPage = null
    },
    search(s) {
      this.innerSearch = s
    },
  },
  created() {
    if (this.search) {
      this.innerSearch = this.search
    }
  },
  methods: {
    linkGen(pageNum) {
      return {
        name: 'market',
        query: { ...this.$route.query, page: pageNum === 1 ? null : pageNum },
      }
      // return pageNum === 1 ? '?' : `?page=${pageNum}`
    },
    // reloadNftPage(page = null) {
    //   this.queryNft({
    //     params: {
    //       // limit: this.perPage,
    //       // offset: (page || this.currentPage || 1 - 1) * this.perPage,
    //     },
    //   })
    // },
    doSearch() {
      this.$router.push({ name: 'market', query: { q: this.innerSearch } })
    },
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
  },
}
</script>

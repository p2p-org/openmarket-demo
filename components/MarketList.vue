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
<!--              <b-form-group>-->
<!--                <b-form-radio-group-->
<!--                  v-model="selected"-->
<!--                  :options="options"-->
<!--                  buttons-->
<!--                  button-variant="outline-secondary"-->
<!--                  name="radio-btn-outline"-->
<!--                  size="sm"-->
<!--                ></b-form-radio-group>-->
<!--              </b-form-group>-->

                <sort-dropdown :value="sort.time.current" :options="sort.time.options" @change="changeSortTime"></sort-dropdown>
                <sort-dropdown :value="sort.price.current" :options="sort.price.options" @change="changeSortPrice"></sort-dropdown>

<!--                <b-dropdown size="sm" variant="outline-secondary">-->
<!--                  <b-dropdown-item-button v-for="opt in sortOptsTime" :key="opt.value" @click.prevent="setSortOptTime(opt.value)">{{ opt.text }}</b-dropdown-item-button>-->
<!--                  <template v-slot:button-content>-->
<!--                    {{ currentSortOptTime.text }}-->
<!--                  </template>-->
<!--                </b-dropdown>-->
              </b-nav-form>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-form>
                <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                <b-button size="sm" class="my-2 my-sm-0" type="submit" variant="primary">Search</b-button>
              </b-nav-form>
            </b-navbar-nav>
          </b-navbar>
          <b-card-group v-if="nfts.length" deck>
            <!--              :title="nft.meta.name"-->
            <!--              :image="nft.meta.image"-->
            <!--              :price="nft.price"-->
            <!--              :id="nft.id"-->
            <market-card
              v-for="nft in nfts"
              :key="nft.id"
              :nft="nft"
              :rate="rateETH"
            ></market-card>
<!--            {{ nfts }}-->
          </b-card-group>
          <div v-if="nfts.length" class="overflow-auto">
            <b-pagination-nav v-model="curPage" :link-gen="linkGen" :number-of-pages="numberOfPages" use-router></b-pagination-nav>
          </div>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import SortDropdown from './form/SortDropdown'
import MarketCard from './element/MarketCard'

export default {
  name: 'MarketList',
  components: { MarketCard, SortDropdown },
  data() {
    return {
      rateETH: 123123,
      perPage: 3,
      curPage: null,
      cards: [],
      selected: null,
      options: ['All', 'Fixed price', 'Auction'],
      // asc - true, desc - false
      sort: {
        __current: {
          parameter: 'price',
          value: 'asc',
        },
        price: {
          current: 'asc',
          options: [
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
          current: 'asc',
          options: [
            {
              value: 'asc',
              text: 'Newest first',
            },
            {
              value: 'desc',
              text: 'Oldest first',
            },
          ]
        }
      },
    }
  },
  computed: {
    ...mapState({
      nfts: state => state.market.nfts,
    }),
    nfts1() {
      return this.nfts
      //   .sort((a,b) => {
      //
      // })
    },
    numberOfPages() {
      return this.nfts.length ? this.nfts.length / this.perPage : 1
    }
  },
  mounted() {
    this.queryNft()
  },
  methods: {
    ...mapActions('market', ['getAllNft', 'queryNft']),
    linkGen(pageNum) {
      // return {
      //   name: 'market',
      //   query: { page: pageNum === 1 ? null : pageNum },
      // }
      return pageNum === 1 ? '?' : `?page=${pageNum}`
    },
    changeSortTime(value) {
      this.sort.time.current = value
    },
    changeSortPrice(value) {
      this.sort.price.current = value
    },
  }
}
</script>

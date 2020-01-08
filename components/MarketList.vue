<template>
  <b-container>
    <b-row class="">
      <b-col md="3">
        <b-card>
        <b-navbar id="filters" toggleable="md" class="flex-md-column align-items-md-start">
          <div class="d-flex align-items-center">Filters <b-btn v-if="isSelected" size="xs" variant="outline-secondary" class="ml-2" @click.stop.prevent="clearFilters">clear all ×</b-btn></div>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav v-if="nfts.length" fill align="start"  class="flex-md-column">
            <b-nav-text v-for="p in nfts[0].meta.properties.filter(x => x.display === null)" :key="p.trait">
              <label>{{ p.trait.toUpperCase() }}</label>
                <b-form-checkbox-group v-model="selected[p.trait]" :options="nfts[0].meta.definitions[p.trait]" stacked />
            </b-nav-text>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
<!--        <b-card>-->
<!--          <template v-if="nfts.length">-->
<!--            <b-form-group-->
<!--              v-for="p in nfts[0].meta.properties.filter(x => x.display === null)"-->
<!--              :key="p.trait"-->
<!--              :label="p.trait.toUpperCase()"-->
<!--            >-->
<!--              <b-form-checkbox-group v-model="selected[p.trait]" :options="nfts[0].meta.definitions[p.trait]" stacked />-->
<!--            </b-form-group>-->
<!--          </template>-->
        </b-card>
      </b-col>
      <b-col>
        <b-navbar id="sorters">
          <b-navbar-nav>
            <b-nav-form>
              <b-selector-input v-model="filter.market.current" :options="filter.market.options" />
            </b-nav-form>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-sort-input :value="sort.time.current" :label="sort.time.label" @input="changeSortTime" class="ml-2"/>
              <b-sort-input :value="sort.price.current" :label="sort.price.label" @input="changeSortPrice" class="ml-2"/>
<!--              <sort-dropdown :value="sort.time.current" :options="sort.time.options" @change="changeSortTime" />-->
<!--              <sort-dropdown :value="sort.price.current" :options="sort.price.options" @change="changeSortPrice" />-->
            </b-nav-form>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto d-none d-lg-block">
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
          <!--          <b-card-group v-if="nftsPaged.length" deck>-->
          <!--              :title="nft.meta.name"-->
          <!--              :image="nft.meta.image"-->
          <!--              :price="nft.price"-->
          <!--              :id="nft.id"-->
          <transition-group v-if="nftsPaged.length" name="flip-list" tag="div" class="card-deck">
            <market-card v-for="nft in nftsPaged" :key="nft.token_id" :nft="nft" :rate="rateETH" />
          </transition-group>
          <b-card v-else class="mb-3" body-class="text-center">
            <strong>No items yet...</strong>
          </b-card>
          <!--            {{ nfts }}-->
          <!--          </b-card-group>-->

          <b-pagination-nav v-if="nftsPaged.length" v-model="currentPage" :link-gen="linkGen" :number-of-pages="numberOfPages" use-router align="center" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import SortDropdown from './form/SortDropdown'
import MarketCard from './MarketCard'
import BSortInput from './form/inputs/BSortInput'
import BSelectorInput from './form/inputs/BSelectorInput'

export default {
  name: 'MarketList',
  components: { BSelectorInput, BSortInput, MarketCard, SortDropdown },
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

      filterOptions: {
        my: {
          type: 'check',
          param: 'where[owner][like]',
          label: 'My',
          // options: [
          //   {value: true, text: 'Only My'},
          //   {value: false, text: 'All'},
          // ],
        },
        id: {
          type: 'sort',
          param: 'order_by[id]',
          label: 'Newest',
          // options: [
          //   // {value: null, text: 'Sort by newness...'},
          //   {value: 'asc', text: 'Oldest first'},
          //   {value: 'desc', text: 'Newest last'},
          // ],
        },
        price: {
          type: 'sort',
          selected: null,
          param: 'order_by[price]',
          label: 'Price',
          // options: [
          //   {value: null, text: 'Sort by price...'},
          //   {value: 'asc', text: 'Cheapest first'},
          //   {value: 'desc', text: 'Cheapest last'},
          // ],
        },
        level: {
          type: 'sort',
          selected: null,
          param: 'order_by[level]',
          label: 'Level',
          // options: [
          //   {value: null, text: 'Sort by level...'},
          //   {value: 'desc', text: 'High to low'},
          //   {value: 'asc', text: 'Low to high'},
          // ],
        },
      },

      // asc - true, desc - false
      sort: {
        _current: {
          parameter: 'price',
          value: 'asc',
        },
        price: {
          label: 'Price',
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
          label: 'Novelty',
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
    ...mapGetters('user', ['currentUser']),
    // sortFunc() {
    //   return this.sort[this.sort._current.parameter].cmpFunc
    // },
    isSelected() {
      const traits = Object.keys(this.selected)
      console.log(traits)
      if (!traits.length) return false
      return traits.reduce((s, t) => s || !!(this.selected[t] && this.selected[t].length), false)
    },
    nftsFiltered() {
      const tmpNfts = this.nfts
        .filter(n => {
          if (!Object.keys(this.selected).length) return true
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
      return this.localePath({
        name: 'market',
        query: { ...this.$route.query, page: pageNum === 1 ? null : pageNum },
      })
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
      this.$router.push(this.localePath({ name: 'market', query: { q: this.innerSearch } }))
    },
    changeSortTime(value) {
      this.updSort('time', value)
    },
    changeSortPrice(value) {
      console.log(value)
      this.updSort('price', value)
    },
    updSort(parameter, value) {
      // if (this.sort._current.parameter && this.sort[this.sort._current.parameter]) {
      this.sort[this.sort._current.parameter].current = null
      // }
      this.sort._current = { parameter, value }
      this.sort[parameter].current = value
    },
    clearFilters() {
      const traits = Object.keys(this.selected)
      console.log(traits)
      if (traits.length) {
        this.selected = traits.reduce((s, t) => {
          s[t] = []
          return s
        }, {})
      }
    },
  },
}
</script>

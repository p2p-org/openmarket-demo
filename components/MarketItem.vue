<template>
    <b-container>
      <b-row v-if="nft">
        <b-col md="4">
          <b-card :img-src="image" :img-alt="title" img-top class="mb-3">
            <b-card-body>
              <div class="mb-4 d-flex justify-content-between">
                <b>{{ collection }}</b>
                <span class="text-muted">#{{ nft.token_id }}</span>
              </div>
              <h5 class="mb-3">
                <b>{{ title }}</b>
              </h5>
              <p>
                {{ description | truncate(100) }}
                <template v-if="description.length > 100">
                  <b-collapse :id="`descr_${nft.token_id}`" v-model="expandDescr" tag="span">
                    {{ description | truncate(-100, false) }}
                  </b-collapse>
                  <!--                  v-b-toggle="`descr_${nft.token_id}`"-->
                  <b-link
                    :class="expandDescr ? 'collapsed' : null"
                    :aria-expanded="expandDescr ? 'true' : 'false'"
                    :aria-controls="`descr_${nft.token_id}`"
                    @click.prevent="expandDescr = !expandDescr"
                  >
                    Read {{ expandDescr ? 'less' : 'more' }}
                  </b-link>
                </template>
              </p>

              <!--              <template v-for="stat in stats">-->
              <!--                <h5 class="mt-3">{{ stat.trait.toUpperCase() }}</h5>-->
              <!--                &lt;!&ndash;              height="0.2rem"&ndash;&gt;-->
              <!--                <b-progress :value="stat.value" :max="stat.options.max" :min="stat.options.min" show-progress></b-progress>-->
              <!--              </template>-->
              <template v-for="s in stats">
                <h5 class="mt-3">
                  {{ s.trait.toUpperCase() }}
                </h5>
                <!--              height="0.2rem"-->
                <b-progress :value="s.value" :max="s.options.max" :min="s.options.min" show-progress />
              </template>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col>
          <b-card class="mb-3 p-2 market-action">
            <!--            <b-row>-->
            <template v-if="owned">
              <template v-if="status === 1">
                <form-item-cancel-sell :busy="busy" :rate="rate" :price="price" @submit="onCancelFixed" />
                <form-item-owner :owner="owner" />
              </template>
              <template v-else-if="status === 2">
                <form-item-cancel-auction
                  :busy="busy"
                  :rate="rate"
                  :opening-price="openingPrice"
                  :buyout-price="buyoutPrice"
                  :ends="ends"
                  :highest-bid="highestBid"
                  :bids-cnt="bidsCount"
                  @reset="onCancelAuction"
                  @submit="onFinishAuction"
                />
                <form-item-owner :owner="owner" />
              </template>
              <template v-else>
                <form-item-sell
                  v-if="sell == 1"
                  :busy="busy"
                  :sold="lastSold"
                  :close="true"
                  :rate="rate"
                  @submit="onSellFixed"
                  @reset="sell = 0"
                />
                <form-item-auction
                  v-else-if="sell == 2"
                  :busy="busy"
                  :sold="lastSold"
                  :close="true"
                  :rate="rate"
                  @submit="onStartAuction"
                  @reset="sell = 0"
                />
                <form-choose-sell v-else @fixed="sell = 1" @auction="sell = 2" />
                <form-item-owner :owner="owner" />
              </template>
            </template>
            <template v-else>
              <template v-if="status === 1">
                <form-item-offer
                  v-if="buy == 1"
                  :rate="rate"
                  :busy="busy"
                  :offer="highestOffer"
                  :close="true"
                  @submit="onMakeOffer"
                  @reset="buy = 0"
                />
                <form-item-buy
                  v-else
                  :busy="busy"
                  :rate="rate"
                  :price="price"
                  :offer="highestOffer"
                  @submit="onBuyFixed"
                  @offer="buy = 1"
                />
                <form-item-owner v-if="buy == 0" :owner="owner" />
              </template>
              <template v-else-if="status === 2">
                <form-item-bid
                  :rate="rate"
                  :busy="busy"
                  :opening-price="openingPrice"
                  :highest-bid="highestBid"
                  :bids-cnt="bidsCount"
                  :buyout-price="buyoutPrice"
                  :ends="ends"
                  @submit="onPlaceBid"
                  @buyout="onBuyout"
                />
                <!--                  <b-btn variant="info">-->
                <!--                    Place bid-->
                <!--                    <b-spinner v-if="busy" type="grow" />-->
                <!--                  </b-btn>-->
                <form-item-owner :owner="owner" />
              </template>
              <template v-else>
                <form-item-offer :rate="rate" :busy="busy" :offer="highestOffer" @submit="onMakeOffer" />
                <form-item-owner :owner="owner" />
              </template>
            </template>
            <!--            </b-row>-->
          </b-card>
          <b-card v-if="owned && status === 0" class="mb-3 p-2 market-action">
            <form-item-gift :busy="busy" @submit="onTransfer" />
          </b-card>
          <template v-if="offers.length">
            <h5 class="subtitle mt-3">
              Offers
            </h5>
            <form-item-offers-list :items="offers" :owner="owner" :busy="busy" @cancel="onCancelOffer" @accept="onAcceptOffer" />
          </template>
          <h5 class="subtitle mt-3">
            Ranks
          </h5>
          <b-row>
            <b-col v-for="(r, i) in ranks" :key="i" md="6">
              <b-card :bg-variant="bgVar(i)" class="mb-3 px-2">
                <div class="title">
                  {{ mkTitle(r.trait) }}
                </div>
                <div class="mt-4">
                  <span class="value">{{ r.value }}</span
                  ><span class="total"> of max {{ r.options.max }}</span>
                </div>
              </b-card>
            </b-col>
          </b-row>
          <h5 class="subtitle mt-3">
            Properties
          </h5>
          <b-row>
            <b-col v-for="(p, i) in props" :key="i" md="6">
              <b-card :bg-variant="bgVar(i + 1)" class="mb-3 px-2">
                <div class="title">
                  {{ mkTitle(p.trait) }}
                </div>
                <div class="mt-4">
                  <span class="value">{{ p.value }}</span>
                </div>
              </b-card>
            </b-col>
          </b-row>
          <h5 class="subtitle mt-3">
            Sell history
          </h5>
          <b-row>
            <b-col>
              <b-card no-body>
                <b-table striped hover :items="items" :busy="true">
                  <template v-slot:table-busy>
                    <div class="text-center  my-2">
                      <!--                      <b-spinner class="align-middle"></b-spinner>-->
                      <strong>under construction...</strong>
                    </div>
                  </template>
                </b-table>
              </b-card>
            </b-col>
          </b-row>
          <h5 v-if="owned" class="subtitle mt-5 mb-3">
Burn <small class="text-danger">(be careful, it's irreversible)</small>
</h5>
          <form-item-burn v-if="owned" :busy="busy" @submit="onBurn" />
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import {
  ACTION_OFFER_MAKE,
  ACTION_OFFER_CANCEL,
  ACTION_OFFER_ACCEPT,
  ACTION_AUCTION_START,
  ACTION_AUCTION_FINISH,
  ACTION_FIXED_SELL,
  ACTION_FIXED_BUY,
  ACTION_FIXED_CANCEL,
  ACTION_AUCTION_BID,
  ACTION_AUCTION_CANCEL,
  ACTION_AUCTION_BUYOUT,
  ACTION_TOKEN_BURN,
  ACTION_TOKEN_TRNSFER,
  ACTION_SUCCESS,
} from '~/helpers/action-types'
import FormItemOffer from './form/ItemOffer'
import FormItemSell from './form/ItemSell'
import FormItemOwner from './form/ItemOwner'
import FormItemCancelSell from './form/ItemCancelSell'
import FormItemBuy from './form/ItemBuy'
import FormItemCancelAuction from './form/ItemCancelAuction'
import FormItemGift from './form/ItemGift'
import FormItemOffersList from './form/ItemOffersList'
import FormItemBid from './form/ItemBid'
import FormItemAuction from './form/ItemAuction'
import FormChooseSell from './form/ItemChooseSell'
import FormItemBurn from './form/ItemBurn'

export default {
  name: 'MarketItem',
  components: {
    FormItemBurn,
    FormChooseSell,
    FormItemAuction,
    FormItemBid,
    FormItemOffersList,
    FormItemGift,
    FormItemCancelAuction,
    FormItemBuy,
    FormItemCancelSell,
    FormItemOwner,
    FormItemSell,
    FormItemOffer,
  },

  props: {
    // id: {
    //   type: String,
    //   default: null,
    // },
    nft: {
      type: Object,
      default: null,
    },
    offers: {
      type: Array,
      default: () => [],
    },
    bids: {
      type: Array,
      default: () => [],
    },
    rate: {
      type: Number,
      default: 1,
    },
    // busy: {
    //   type: Boolean,
    //   default: false,
    // },
    // buyer: {
    //   type: String,
    //   default: null,
    // },
  },
  data() {
    return {
      items: [
        { date: '2019-09-01', user: 'user1', price: '10token' },
        { date: '2019-09-02', user: 'user2', price: '20token' },
        { date: '2019-09-03', user: 'user3', price: '30token' },
        { date: '2019-09-04', user: 'user4', price: '40token' },
        { date: '2019-09-05', user: 'user5', price: '50token' },
      ],
      sellPrice: '1',
      offerPrice: '1',
      recipient: null,
      // busy: false,
      expandDescr: false,
      placeBid: false,
      buy: false,
      sell: 0,
    }
  },
  computed: {
    ...mapState({
      baseCoinDenom: state => state.config.baseCoinDenom,
    }),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('market', ['isBusyNft']),

    // nft() {
    //   return this.findNft(this.id)
    // },

    label1() {
      switch (this.nft.status) {
        case 1:
          return 'Fixed price'
        case 2:
          return 'Auction'
        default:
          return ''
      }
    },
    propLevel() {
      // const p = this.nftMetaProp(this.nft.meta, 'level')
      // console.log(p)
      return this.nftMetaProp(this.nft.meta, 'level')
    },
    props() {
      // const p = this.nftMetaProp(this.nft.meta, 'level')
      // console.log(p)
      return this.nftMetaDisplay(this.nft.meta, null, false)
    },
    stats() {
      return this.nftMetaDisplay(this.nft.meta, 'stat', false)
    },
    ranks() {
      return this.nftMetaDisplay(this.nft.meta, 'rank', false)
    },
    title() {
      return this.nftMetaDisplay(this.nft.meta, 'title').value
    },
    image() {
      return this.nftMetaDisplay(this.nft.meta, 'image').value
    },
    link() {
      return this.nftMetaDisplay(this.nft.meta, 'link').value
    },
    description() {
      return this.nftMetaDisplay(this.nft.meta, 'description').value
    },
    collection() {
      return this.nftMetaDisplay(this.nft.meta, 'collection').value
    },

    price() {
      return this.nft.price
    },
    highestOffer() {
      return this.offers.reduce((p, o) => (o.price.amount > p.amount ? o.price : p), { amount: 0, denom: this.baseCoinDenom })
    },
    lastSold() {
      return { amount: 0, denom: this.baseCoinDenom }
    },
    highestBid() {
      return this.bids.reduce((p, o) => (o.price.amount > p.amount ? o.price : p), { amount: 0, denom: this.openingPrice.denom })
      // return this.bids.length
      //   ? this.bids.reduce((p, o) => (o.price.amount > p.amount ? o.price : p), { amount: 0, denom: this.baseCoinDenom })
      //   : { amount: 0, denom: this.baseCoinDenom }
    },
    bidsCount() {
      return this.bids.length || 0
    },
    openingPrice() {
      return this.nft.opening_price
    },
    buyoutPrice() {
      return this.nft.buyout_price
    },
    ends() {
      return this.nft.time_to_sell
    },
    status() {
      return this.nft.status
    },
    owned() {
      return this.nft.owner.address === this.buyer
    },
    buyer() {
      return this.currentUser ? this.currentUser.address : null
    },
    owner() {
      return this.nft.owner || null
    },
    busy() {
      return this.isBusyNft(this.nft.token_id)
    },
  },
  mounted() {
    this.$root.$on(ACTION_SUCCESS, this.onActionCompleted)
  },
  beforeDestroy() {
    this.$root.$off(ACTION_SUCCESS)
  },
  methods: {
    ...mapActions('market', ['queryUser']),
    bgVar(i) {
      switch (i % 4) {
        case 0:
          return 'primary'
        case 1:
          return 'success'
        case 2:
          return 'info'
        case 3:
          return 'danger'
        default:
          return 'warning'
      }
    },
    onActionCompleted(action, tokenId) {
      this.buy = 0
      this.sell = 0
    },
    mkTitle(str) {
      str = str.toLowerCase().split('_')
      const final = []
      for (const word of str) {
        final.push(word.charAt(0).toUpperCase() + word.slice(1))
      }
      return final.join(' ')
    },
    onMakeOffer({ price }) {
      this.$root.$emit(ACTION_OFFER_MAKE, { id: this.nft.token_id, price, user: this.currentUser })
    },
    onAcceptOffer({ offerId }) {
      this.$root.$emit(ACTION_OFFER_ACCEPT, { id: this.nft.token_id, offerId, user: this.currentUser })
    },
    onCancelOffer({ offerId }) {
      this.$root.$emit(ACTION_OFFER_CANCEL, { id: this.nft.token_id, offerId, user: this.currentUser })
    },
    onSellFixed({ price }) {
      this.$root.$emit(ACTION_FIXED_SELL, { id: this.nft.token_id, price, user: this.currentUser })
    },
    onBuyFixed() {
      this.$root.$emit(ACTION_FIXED_BUY, { id: this.nft.token_id, user: this.currentUser })
    },
    onCancelFixed() {
      this.$root.$emit(ACTION_FIXED_CANCEL, { id: this.nft.token_id, user: this.currentUser })
    },
    onStartAuction({ price, buyout, duration }) {
      // console.log({ price, buyout, duration })
      const ends = this.$dayjs()
        .add(duration, 'minute')
        .toISOString()
      this.$root.$emit(ACTION_AUCTION_START, { id: this.nft.token_id, price, buyout, ends, user: this.currentUser })
    },
    onFinishAuction() {
      this.$root.$emit(ACTION_AUCTION_FINISH, { id: this.nft.token_id, user: this.currentUser })
    },
    onPlaceBid({ price }) {
      this.$root.$emit(ACTION_AUCTION_BID, { id: this.nft.token_id, price, user: this.currentUser })
    },
    onCancelAuction() {
      this.$root.$emit(ACTION_AUCTION_CANCEL, { id: this.nft.token_id, user: this.currentUser })
    },
    onBuyout() {
      this.$root.$emit(ACTION_AUCTION_BUYOUT, { id: this.nft.token_id, user: this.currentUser })
    },
    onBurn() {
      this.$root.$emit(ACTION_TOKEN_BURN, { id: this.nft.token_id, user: this.currentUser })
    },
    onTransfer({ recipient }) {
      this.$root.$emit(ACTION_TOKEN_TRNSFER, { id: this.nft.token_id, recipient, user: this.currentUser })
    },
  },
}
</script>

<template>
  <b-card no-body class="mb-3">
    <div class="nft-image card-img-top d-flex justify-content-center align-items-center" @click.stop="toItem">
    <b-img :src="image" :alt="title" ></b-img>
    </div>
    <b-card-body class="d-flex flex-column justify-content-between">
    <div class="d-flex flex-row justify-content-between">
      <b-link :to="localePath({ name: 'market-item', params: { item: tokenId } })">
        <h5>{{ title | truncate }}</h5>
      </b-link>
      <small class="text-muted">#{{ tokenId }}</small>
    </div>
    <div class="d-flex flex-row justify-content-between">
      <template v-if="owned">
        <template v-if="status === 1">
          <coin-price-compact :price="price" />
          <b-btn variant="danger" :disabled="busy" @click.stop="onCancelFixed">
            Cancel sell
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
        <template v-else-if="status === 2">
          <coin-price-compact :price="highestBid" />
          <b-btn variant="danger" :disabled="busy" @click.stop="onCancelAuction">
            Cancel auction
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
        <template v-else>
          <div></div>
          <b-btn variant="success" :disabled="busy" :to="localePath({ name: 'market-item', params: { item: tokenId } })">
            Sell item
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>

      </template>
      <template v-else>
        <template v-if="status === 1">
          <coin-price-compact :price="price" />
          <b-btn variant="primary" :disabled="busy" @click.stop="onBuyFixed">
            Buy now
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
        <template v-else-if="status === 2">
          <coin-price-compact :price="highestBid" />
<!--          <h5 class="m-0 d-flex flex-column">-->
<!--            <span>-->
<!--              <b>{{ buyoutPrice.value | priceBig }}</b> {{ buyoutPrice.currency }}-->
<!--            </span>-->
<!--            <small v-if="buyoutPrice.value" class="text-muted">{{ buyoutPrice.value | priceEth(rate) }}</small>-->
<!--          </h5>-->
          <b-btn variant="info" :disabled="busy" :to="localePath({ name: 'market-item', params: { item: tokenId } })">
            Buyout or bid
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
        <template v-else>
          <div></div>
          <b-btn variant="warning" :disabled="busy" :to="localePath({ name: 'market-item', params: { item: tokenId } })">
            Make offer
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
      </template>
    </div>
    </b-card-body>
    <!--              <template v-slot:footer>-->
    <!--              </template>-->
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { ACTION_AUCTION_CANCEL, ACTION_FIXED_BUY, ACTION_FIXED_CANCEL } from '../helpers/action-types'
import CoinPriceCompact from './elements/CoinPriceCompact'

export default {
  name: 'MarketCard',
  components: { CoinPriceCompact },
  filters: {
    truncate(value) {
      return value.length > 46 ? value.substring(0, 46) + '...' : value
    },
  },
  props: {
    nft: {
      type: Object,
      default: null,
    },
    rate: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    noimg: '/images/noimage.svg',
  }),
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('market', ['findOffers', 'findBids', 'isBusyNft']),
    busy() {
      return this.isBusyNft(this.nft.token_id)
    },
    tokenId() {
      return this.nft.token_id
    },
    title() {
      return this.nftMetaProp(this.nft.meta, 'name').value
      // return this.meta.title || this.meta.name || this.nft.token_id
    },
    image() {
      return this.nftMetaProp(this.nft.meta, 'image').value
      // return this.meta.image || this.noimg
    },
    price() {
      return this.nft.price
    },
    openingPrice() {
      return this.nft.opening_price
    },
    buyoutPrice() {
      return this.nft.buyout_price
    },
    highestOffer() {
      return this.offers.reduce((p, o) => (o.price.amount > p.amount ? o.price : p), { amount: 0, denom: this.nft.opening_price.denom })
    },
    highestBid() {
      return this.bids.reduce((p, o) => (o.price.amount > p.amount ? o.price : p), { amount: 0, denom: this.nft.opening_price.denom })
    },

    status() {
      return this.nft.status
    },
    buyer() {
      return this.currentUser ? this.currentUser.address : null
    },

    owned() {
      return this.nft.owner.address === this.buyer
    },
    // priceExt() {
    //   if (!this.price) return { value: '-', currency: '' }
    //   const m = this.price.match(/([\d.]+)([\w]+)/i)
    //   return m ? { value: m[1], currency: m[2] } : { value: this.price, currency: '' }
    // },
    offers() {
      const o = this.findOffers(this.nft.token_id)
      return o ? o.offers : []
    },
    bids() {
      const o = this.findBids(this.nft.token_id)
      return o ? o.bids : []
    },
  },
  methods: {
    toItem() {
      this.$router.push(this.localePath({ name: 'market-item', params: { item: this.tokenId } }))
    },
    onCancelFixed() {
      this.$root.$emit(ACTION_FIXED_CANCEL, { id: this.nft.token_id, user: this.currentUser })
    },
    onBuyFixed() {
      this.$root.$emit(ACTION_FIXED_BUY, { id: this.nft.token_id, user: this.currentUser })
    },
    onCancelAuction() {
      this.$root.$emit(ACTION_AUCTION_CANCEL, { id: this.nft.token_id, user: this.currentUser })
    },
  },
}
</script>

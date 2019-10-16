<template>
  <b-card :img-src="image" :img-alt="title" img-top class="mb-3">
    <div  class="d-flex flex-row justify-content-between">
      <b-link :to="{ name: 'market-id', params: { id: tokenId } }">
        <h5>{{ title | truncate }}</h5>
      </b-link>
      <small class="text-muted">#{{ tokenId }}</small>
    </div>
    <div class="d-flex flex-row justify-content-between">
      <template v-if="owned">
        <template v-if="status === 1">
          <h5 class="m-0 d-flex flex-column">
            <span>
              <b>{{ price.value }}</b> {{ price.currency }}
            </span>
            <small v-if="price.value" class="text-muted">{{ priceEth(price.value) }} ETH</small>
          </h5>
          <b-btn variant="danger">
            Cancel sell
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
        <template v-else-if="status === 2">
          <h5 class="m-0 d-flex flex-column">
            <span>
              <b>{{ openinigPrice.value }}</b> {{ openinigPrice.currency }}
            </span>
            <small v-if="openinigPrice.value" class="text-muted">{{ priceEth(openinigPrice.value) }} ETH</small>
          </h5>
          <b-btn variant="danger">
            Cancel sell
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
        <template v-else>
          <div></div>
          <b-btn variant="success">
            Sell item
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>

      </template>
      <template v-else>
        <template v-if="status === 1">
          <h5 class="m-0 d-flex flex-column">
            <span>
              <b>{{ price.value }}</b> {{ price.currency }}
            </span>
            <small v-if="price.value" class="text-muted">{{ priceEth(price.value) }} ETH</small>
          </h5>
          <b-btn variant="primary">
            Buy now
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
        <template v-else-if="status === 2">
          <h5 class="m-0 d-flex flex-column">
            <span>
              <b>{{ openinigPrice.value }}</b> {{ openinigPrice.currency }}
            </span>
            <small v-if="openinigPrice.value" class="text-muted">{{ priceEth(openinigPrice.value) }} ETH</small>
          </h5>
          <b-btn variant="info">
            Place bid
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
        <template v-else>
          <div></div>
          <b-btn variant="warning">
            Make offer
            <b-spinner v-if="busy" small type="grow"></b-spinner>
          </b-btn>
        </template>
      </template>
    </div>

    <!--              <template v-slot:footer>-->
    <!--              </template>-->
  </b-card>
</template>

<script>
export default {
  name: 'MarketCard',
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
    busy: {
      type: Boolean,
      default: false,
    },
    buyer: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    noimg: '/images/noimage.svg'
  }),
  computed: {
    id() {
      return this.nft.id
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
    openinigPrice() {
      return this.nft.opening_price
    },
    status() {
      return this.nft.status
    },
    owned() {
      return this.nft.owner_address === this.buyer
    },
    // priceExt() {
    //   if (!this.price) return { value: '-', currency: '' }
    //   const m = this.price.match(/([\d.]+)([\w]+)/i)
    //   return m ? { value: m[1], currency: m[2] } : { value: this.price, currency: '' }
    // },
  },
  methods: {
    priceEth(value) {
      return (parseFloat(value) / this.rate).toFixed(5)
    },
  }
}
</script>

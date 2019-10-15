<template>
  <b-card :img-src="image" :img-alt="title" img-top class="mb-3">
    <div  class="d-flex flex-row justify-content-between">
      <b-link :to="{ name: 'market-item-id', params: { id: id } }">
        <h5>{{ title | truncate }}</h5>
      </b-link>
      <small class="text-muted">{{ tokenId }}</small>
    </div>
    <div class="d-flex flex-row justify-content-between">
      <h5 class="m-0 d-flex flex-column">
        <span>
          <b>{{ priceExt.value }}</b> {{ priceExt.currency }}
        </span>
        <small v-if="price" class="text-muted">{{ priceEth }} ETH</small>
      </h5>
      <b-btn v-if="status === 0" variant="warning">
        Make offer
        <b-spinner v-if="busy" small type="grow"></b-spinner>
      </b-btn>
      <b-btn v-else variant="primary">
        Buy now
        <b-spinner v-if="busy" small type="grow"></b-spinner>
      </b-btn>
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
  },
  data: () => ({
    noimg: '/images/noimage.svg'
  }),
  computed: {
    id() {
      return this.nft.id
    },
    meta() {
      return this.nft.meta || {}
    },
    tokenId() {
      return '#' + this.nft.token_id
    },
    title() {
      return this.meta.title || this.meta.name || this.nft.token_id
    },
    image() {
      return this.meta.image || this.noimg
    },
    price() {
      return this.nft.price
    },
    status() {
      return this.nft.status
    },
    priceExt() {
      if (!this.price) return { value: '-', currency: '' }
      const m = this.price.match(/([\d.]+)([\w]+)/i)
      return m ? { value: m[1], currency: m[2] } : { value: this.price, currency: '' }
    },
    priceEth() {
      return (parseFloat(this.priceExt.value) / this.rate).toFixed(5)
    },
  },
}
</script>

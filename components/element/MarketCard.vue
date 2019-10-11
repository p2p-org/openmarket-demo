<template>
  <b-card :img-src="image" :img-alt="title" img-top class="mb-3">

      <b-link :to="{ name: 'market-item-id', params: { id: id }}"><h5>{{ title | truncate }}</h5></b-link>

    <div class="d-flex flex-row justify-content-between">
      <h5 class="m-0">
        <b>{{ priceExt.value }}</b> {{ priceExt.currency }}<br /><small class="text-muted">{{ priceEth }} ETH</small>
      </h5>
      <b-btn variant="primary">
        Buy now
        <!--                    <b-spinner v-if="nft.id === processedId" small type="grow"></b-spinner>-->
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
    id: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      default: null,
    },
    rate: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    priceExt() {
      const m = this.price.match(/([\d.]+)([\w]+)/i)
      return m ? { value: m[1], currency: m[2] } : { value: this.price, currency: '' }
    },
    priceEth() {
      return (parseFloat(this.priceExt.value) / this.rate).toFixed(5)
    },
  },
}
</script>

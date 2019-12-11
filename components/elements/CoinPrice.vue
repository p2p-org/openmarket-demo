<template>
  <div>
    <div class="d-flex justify-content-middle align-items-center">
      <b-img :src="img" rounded="circle" width="33px" height="33px" />
      <h1 class="ml-2 my-0">
        {{ price.amount | priceBig }} <small>{{ name }} <span class="text-muted">({{ denom }})</span></small>
      </h1>
    </div>
    <h4 class="mt-1">
      <small class="text-muted">{{ price.amount | priceEth(rate) }}</small>
    </h4>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  props: {
    price: {
      type: Object,
      default: () => ({
        amount: 0,
        denom: null,
      }),
    },
  },
  computed: {
    ...mapState({
      baseCoinDenom: state => state.config.baseCoinDenom,
    }),
    ...mapGetters('config', ['coinImage', 'coinName', 'coinRate']),
    denom() {
      return this.price.denom || this.baseCoinDenom
    },
    img() {
      return this.coinImage(this.denom)
    },
    name() {
      return this.coinName(this.denom)
    },
    rate() {
      return this.coinRate(this.denom)
    },
  },
}
</script>

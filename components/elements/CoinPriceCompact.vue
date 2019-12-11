<template>
  <div>
    <div class="d-flex justify-content-middle align-items-center">
      <b-img :src="img" rounded="circle" width="18px" height="18px" />
      <h5 class="ml-1 my-0">
        {{ price.amount | priceBig }} <small>{{ name }}</small>
      </h5>
    </div>
    <h5 class="my-0">
      <small class="text-muted">{{ price.amount | priceEth(rate) }}</small>
    </h5>
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

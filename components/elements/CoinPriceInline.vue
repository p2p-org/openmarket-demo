<template>
  <div class="d-flex justify-content-middle align-items-center">
    <b-img :src="img" rounded="circle" width="31px" height="31px" class="d-none d-md-inline"/>
    <h5 class="ml-2 my-0">
      {{ price.amount | priceBig }} <small>{{ name }} <span
      class="text-muted d-none d-lg-inline">({{ denom }})</span></small>
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

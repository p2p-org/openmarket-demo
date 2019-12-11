<template>
  <ValidationObserver ref="observer" v-slot="{ passes, invalid }">
    <b-form novalidate @submit.stop.prevent="passes(submit)" @reset.stop.prevent="reset">
      <b-row>
        <b-col class="ml-auto">
          <b-button-close v-if="close" @click="reset" />
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" class="d-flex flex-column pr-2">
          <b-form-group class="my-0" label="Highest offer" label-class="pb-0">
            <coin-price :price="offer" />
          </b-form-group>
        </b-col>
        <b-col md="6" class="d-flex flex-row pl-2" />
      </b-row>
      <b-row class="mt-2">
        <b-col md="6" class="d-flex flex-column pr-2">
          <b-price-user-input
            v-model="price"
            name="Offer value"
            type="text"
            label="Enter your offer"
            placeholder="Offer value"
          />
          <!--          <h4 class="mt-1">-->
          <!--            <small class="text-muted">{{ price | priceEth(rate) }}</small>-->
          <!--          </h4>-->
        </b-col>
        <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
          <b-btn variant="primary" size="lg" class="py-2" :disabled="busy || invalid" type="submit" block>
            Make offer
            <b-spinner v-if="busy" type="grow" small />
          </b-btn>
        </b-col>
      </b-row>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { mapState } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import CoinPrice from '../elements/CoinPrice'
import BPriceInput from './inputs/BPriceInput'
import BPriceUserInput from './inputs/BPriceUserInput'

export default {
  name: 'FormItemOffer',
  components: {
    BPriceUserInput,
    CoinPrice,
    ValidationObserver,
    BPriceInput,
  },
  props: {
    currencyImage: {
      type: String,
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
    close: {
      type: Boolean,
      default: false,
    },
    offer: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    price: null,
  }),
  computed: {
    ...mapState({
      baseCoinDenom: state => state.config.baseCoinDenom,
    }),
  },
  watch: {
    // offer(o) {
    //   this.price = 1 + parseInt(o.value)
    // },

    offer: {
      handler(o) {
        if (o) {
          this.price = {
            amount: 1 + parseInt(o.amount),
            denom: o.denom,
          }
        } else {
          this.price = {
            amount: 1,
            denom: this.baseCoinDenom,
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // this.price = 1 + parseInt(this.offer.value)
    // this.price = {
    //   amount: '1',
    //   denom: this.baseCoinDenom,
    // }
  },
  methods: {
    submit() {
      this.$emit('submit', { price: this.price })
    },
    reset() {
      this.$emit('reset', { price: this.price })
    },
  },
}
</script>

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
          <b-form-group class="my-0" label="Highest bid / bids count" label-class="pb-0">
            <coin-price-cnt :price="highestBid">
              {{ bidsCnt }}
            </coin-price-cnt>
          </b-form-group>
        </b-col>
        <b-col md="6" class="d-flex flex-column pl-2">
          <b-form-group class="my-0" label="Ends" label-class="pb-0">
            <div class="d-flex align-items-end ">
              <!--              <fa :icon="['fas', 'clock']" />-->
              <h1 class="ml-2 my-0">
                {{ $dayjs().to(ends) }}
              </h1>
            </div>
            <h4 class="mt-1">
              <small class="text-muted">{{ ends.format('D MMM YYYY HH:mm:ss UTC') }}</small>
            </h4>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col md="6" class="d-flex flex-column pr-2">
          <b-price-user-input
            v-model="price"
            :rules="{ min_value: minPrice.amount }"
            :denoms="denoms"
            name="Bid value"
            type="text"
            :label="'Enter your bid, min ' + minPrice.amount + ' ' + minPrice.denom"
            placeholder="amount"
          />
        </b-col>
        <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
          <b-btn variant="primary" size="lg" class="py-2" :disabled="busy || invalid" type="submit" block>
            Place bid
            <b-spinner v-if="busy" type="grow" small />
          </b-btn>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="6" class="d-flex flex-column pr-4">
          <b-form-group class="my-0" label="Buyout price" label-class="pb-0">
            <coin-price :price="buyoutPrice" />
          </b-form-group>
        </b-col>
        <b-col md="6" class="d-flex flex-column p-2">
          <b-btn variant="outline-primary" size="lg" :disabled="busy" @click.stop.prevent="buynow">
            Buyout now
            <b-spinner v-if="busy" type="grow" small />
          </b-btn>
        </b-col>
      </b-row>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import CoinPriceCnt from '../elements/CoinPriceCnt'
import CoinPrice from '../elements/CoinPrice'
import BPriceUserInput from './inputs/BPriceUserInput'

export default {
  name: 'FormItemBid',
  components: {
    BPriceUserInput,
    CoinPrice,
    CoinPriceCnt,
    ValidationObserver,
  },
  props: {
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
    openingPrice: {
      type: Object,
      default: null,
    },
    highestBid: {
      type: Object,
      default: null,
    },
    bidsCnt: {
      type: Number,
      default: 0,
    },
    buyoutPrice: {
      type: Object,
      default: null,
    },
    ends: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    price: null,
  }),
  computed: {
    minPrice() {
      return this.highestBid.amount
        ? { ...this.highestBid, amount: 1 + parseInt(this.highestBid.amount) }
        : { ...this.openingPrice, amount: parseInt(this.openingPrice.amount) }
    },
    denoms() {
      return [this.openingPrice.denom]
    }
  },
  watch: {
    // highestBid(b) {
    //   this.price = 1 + parseInt(b.amount || this.openingPrice.amount)
    // },
    highestBid: {
      handler(b) {
        if (b) {
          this.price = {
            amount: 1 + parseInt(b.amount || this.openingPrice.amount),
            denom: b.denom,
          }
        } else {
          this.price = {
            amount: this.openingPrice.amount,
            denom: this.openingPrice.denom,
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // this.price = 1 + parseInt(this.highestBid.amount || this.openingPrice.amount)
  },
  methods: {
    submit() {
      this.$emit('submit', { price: this.price })
    },
    reset() {
      this.$emit('reset', { price: this.price })
    },
    buynow() {
      this.$emit('buyout')
    },
  },
}
</script>

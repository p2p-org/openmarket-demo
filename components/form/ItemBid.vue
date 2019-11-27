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
          <b-form-group class="my-0" label="Highest bid" label-class="pb-0">
            <div class="d-flex align-items-center">
              <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
              <h1 class="ml-2 my-0">
                <b>{{ bid.value }}</b> {{ bid.currency }}
              </h1>
            </div>
            <h4 class="mt-1">
              <small class="text-muted">{{ bid.value | priceEth(rate) }}</small>
            </h4>

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
              <small class="text-muted">{{ ends.format("D MMM YYYY HH:mm:ss UTC") }}</small>
            </h4>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col md="6" class="d-flex flex-column pr-2">
          <b-price-input
            :rules="{ required: true, numeric: true, min_value: bid.value + 1}"
            name="Bid value"
            type="text"
            label="Enter your bid"
            v-model="price"
            placeholder="Bid value"
            :currency-image="currencyImage"
          />
        </b-col>
        <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
          <b-btn variant="primary" size="lg" class="py-2" :disabled="busy || invalid" type="submit" block>
            Place bid
            <b-spinner v-if="busy" type="grow" small />
          </b-btn>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col md="6" class="d-flex flex-column pr-4">
          <b-form-group class="my-0" label="Buyout price" label-class="pb-0">
            <div class="d-flex align-items-center">
              <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
              <h1 class="ml-2 my-0">
                <b>{{ buyout.value }}</b> {{ buyout.currency }}
              </h1>
            </div>
            <h4 class="mt-1">
              <small class="text-muted">{{ buyout.value | priceEth(rate) }}</small>
            </h4>
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
import BPriceInput from './inputs/BPriceInput'

export default {
  name: 'FormItemBid',
  components: {
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
    bid: {
      type: Object,
      default: null,
    },
    buyout: {
      type: Object,
      default: null,
    },
    ends: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    price: 1,
  }),
  watch: {
    bid(b) {
      this.price = 1 + parseInt(b.value)
    },
  },
  created() {
    this.price = 1 + parseInt(this.bid.value)
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

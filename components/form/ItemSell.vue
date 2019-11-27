<template>
  <ValidationObserver ref="observer" v-slot="{ passes, invalid }">
    <b-form novalidate @submit.stop.prevent="passes(submit)">
      <b-row>
        <b-col class="ml-auto">
          <b-button-close v-if="close" @click="reset" />
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" class="d-flex flex-column pr-2">
          <b-form-group class="my-0" label="Last sold for" label-class="pb-0">
            <div class="d-flex justify-content-middle align-items-center">
              <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
              <h1 class="ml-2 my-0">
                <b>{{ sold.value }}</b> {{ sold.currency }}
              </h1>
            </div>
            <h4 class="mt-1">
              <small class="text-muted">{{ sold.value | priceEth(rate) }}</small>
            </h4>
          </b-form-group>
        </b-col>
        <b-col md="6" class="d-flex flex-row pl-2">
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col md="6" class="d-flex flex-column pr-2">
          <b-price-input
            v-model="price"
            rules="required|numeric"
            name="Fixed price"
            type="text"
            label="Enter fixed price"
            placeholder="price"
            :currency-image="currencyImage"
          />
        </b-col>
        <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
          <b-btn variant="primary" size="lg" class="py-2" :disabled="busy || invalid" type="submit" block>
            Sell
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
  name: 'FormItemSell',
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
    sold: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    price: '1',
  }),
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

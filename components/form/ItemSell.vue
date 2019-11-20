<template>
  <ValidationObserver ref="observer" v-slot="{ passes, invalid }">
    <b-form novalidate @submit.stop.prevent="passes(submit)">
      <b-row>
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
  },
  data: () => ({
    price: '1',
  }),
  methods: {
    submit() {
      this.$emit('submit', { price: this.price })
    },
  },
}
</script>

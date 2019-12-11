<template>
  <b-form novalidate @submit.prevent="submit">
    <b-row v-if="price">
      <b-col md="6" class="d-flex flex-column pr-4">
        <b-form-group class="my-0" label="Fixed price" label-class="pb-0">
          <coin-price :price="price" />
        </b-form-group>
      </b-col>
      <b-col md="6" class="d-flex flex-column p-2">
        <b-btn variant="danger" size="lg" :disabled="busy" type="submit">
          Cancel sell
          <b-spinner v-if="busy" type="grow" small/>
        </b-btn>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import CoinPrice from '../elements/CoinPrice'
export default {
  name: 'FormItemCancelSell',
  components: { CoinPrice },
  props: {
    rate: {
      type: Number,
      default: 1,
    },
    busy: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Object,
      default: null,
    },
  },
  methods: {
    submit() {
      this.$emit('submit')
    },
  },
}
</script>

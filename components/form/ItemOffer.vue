<template>
  <b-form novalidate @submit.prevent="submit" @reset.prevent="reset">
    <b-row>
      <b-col md="6" class="d-flex flex-column pr-2">
        <b-form-group class="my-0" label="Highest offer" label-class="pb-0">
          <div class="d-flex justify-content-middle align-items-center">
            <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
            <h1 class="ml-2 my-0">
              <b>{{ offer.value }}</b> {{ offer.currency }}
            </h1>
          </div>
        </b-form-group>
      </b-col>
      <b-col md="6" class="d-flex flex-column pl-2 justify-content-begin align-items-end">
        <b-button-close v-if="close" @click="reset"></b-button-close>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col md="6" class="d-flex flex-column pr-2">
        <b-form-group class="my-0" label="Enter your offer" label-class="">
          <b-input-group size="lg">
            <template v-slot:prepend>
              <b-input-group-text>
                <b-img :src="currencyImage" rounded="circle" width="30px" height="30px" />
              </b-input-group-text>
            </template>
            <b-form-input v-model="price" class="pl-0" />
          </b-input-group>
<!--          <h4 class="mt-1">-->
<!--            <small class="text-muted">{{ price | priceEth(rate) }}</small>-->
<!--          </h4>-->
        </b-form-group>
      </b-col>
      <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
          <b-btn variant="primary" size="lg" class="py-2" :disabled="busy" type="submit" block>
            Make offer
            <b-spinner v-if="busy" type="grow" small/>
          </b-btn>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'FormItemOffer',
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

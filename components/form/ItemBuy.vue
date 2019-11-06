<template>
  <b-form novalidate @submit.prevent="submit">
    <b-row>
      <b-col md="6" class="d-flex flex-column pr-2">
        <b-form-group class="my-0" label="Fixed price" label-class="pb-0">
          <div class="d-flex justify-content-middle align-items-center">
            <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
            <h1 class="ml-2 my-0">
              <b>{{ price.value }}</b> {{ price.currency }}
            </h1>
          </div>
<!--          <h4 class="mt-1">-->
<!--            <small class="text-muted">{{ price.value | priceEth(rate) }}</small>-->
<!--          </h4>-->
        </b-form-group>
        <b-btn variant="primary" size="lg" class="py-2 my-3" :disabled="busy" type="submit">
          Buy
          <b-spinner v-if="busy" type="grow" small />
        </b-btn>
      </b-col>
      <b-col md="6" class="d-flex flex-column pl-2">
        <b-form-group class="my-0" label="Highest offer" label-class="pb-0">
          <div class="d-flex justify-content-middle align-items-center">
            <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
            <h1 class="ml-2 my-0">
              <b>{{ offer.value }}</b> {{ offer.currency }}
            </h1>
          </div>
        </b-form-group>
        <b-btn variant="outline-primary" size="lg" class="py-2 my-3" :disabled="busy" @click.prevent="makeOffer">
          Make offer
          <b-spinner v-if="busy" type="grow" small />
        </b-btn>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'FormItemBuy',
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
    price: {
      type: Object,
      default: null,
    },
    offer: {
      type: Object,
      default: null,
    },
  },
  methods: {
    submit() {
      this.$emit('submit')
    },
    makeOffer() {
      this.$emit('offer')
    },
  },
}
</script>

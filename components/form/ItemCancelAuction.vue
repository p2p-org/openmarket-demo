<template>
  <b-form novalidate @submit.prevent="submit">
    <b-row v-if="price">
      <b-col md="6" class="d-flex flex-column pr-4">
        <b-form-group class="my-0" label="Auction opening price" label-class="pb-0">
          <div class="d-flex justify-content-middle align-items-center">
            <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
            <h1 class="ml-2 my-0">
              <b>{{ price.value }}</b> {{ price.currency }}
            </h1>
          </div>
          <h4 class="mt-1">
            <small class="text-muted">{{ price.value | priceEth(rate) }}</small>
          </h4>
        </b-form-group>
      </b-col>
      <b-col md="6" class="d-flex flex-column p-2">
        <b-btn variant="danger" size="lg" class="py-3" :disabled="busy" type="submit">
          Cancel auction
          <b-spinner v-if="busy" type="grow" />
        </b-btn>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'FormItemCancelAuction',
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
  },
  methods: {
    submit() {
      this.$emit('submit')
    },
  },
}
</script>

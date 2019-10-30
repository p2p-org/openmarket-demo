<template>
  <b-form novalidate @submit.prevent="submit">
    <b-row>
      <b-col md="6" class="d-flex flex-column pr-4">
        <b-form-group class="my-0" label="Enter offer price" label-class="pb-0">
          <b-input-group size="lg">
            <template v-slot:prepend>
              <b-input-group-text>
                <b-img :src="currencyImage" rounded="circle" width="30px" height="30px" />
              </b-input-group-text>
            </template>
            <b-form-input v-model="price" class="pl-0" />
          </b-input-group>
          <h4 class="mt-1">
            <small class="text-muted">{{ price | priceEth(rate) }}</small>
          </h4>
        </b-form-group>
      </b-col>
      <b-col md="6" class="d-flex flex-column p-2">
        <b-btn variant="warning" size="lg" class="py-3" :disabled="busy" type="submit">
          Make offer
          <b-spinner v-if="busy" type="grow" />
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

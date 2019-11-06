<template>
  <b-form novalidate @submit.prevent="submit">
    <b-row>
      <b-col md="6" class="d-flex flex-column pr-2">
        <b-form-group class="my-0" label="Enter recipient address" label-class="">
<!--                  <b-form-select v-model="recipient" :options="usersList" size="lg"></b-form-select>-->
          <b-form-input v-model="recipient" size="lg" />
        </b-form-group>
      </b-col>
      <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
        <b-btn variant="warning" size="lg" class="py-2" :disabled="busy" type="submit">
          Gift token
          <b-spinner v-if="busy" type="grow" small/>
        </b-btn>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'FormItemGift',
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
    recipient: null,
  }),
  methods: {
    submit() {
      this.$emit('submit', { recipient: this.recipient })
    },
  },
}
</script>

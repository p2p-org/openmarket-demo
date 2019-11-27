<template>
  <b-row>
    <b-col md="6" class="d-flex flex-column pr-2">
      <b-btn variant="primary" size="lg" class="py-2 my-3" :disabled="busy" @click.prevent="buyNow">
        Buy now
        <b-spinner v-if="busy" type="grow" small />
      </b-btn>
    </b-col>
    <b-col md="6" class="d-flex flex-column pl-2">
      <b-btn variant="outline-primary" size="lg" class="py-2 my-3" :disabled="busy" @click.prevent="makeOffer">
        Make offer
        <b-spinner v-if="busy" type="grow" small />
      </b-btn>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FormChooseBuy',
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    buyNow() {
      this.$emit('buy')
    },
    makeOffer() {
      this.$emit('offer')
    },
  },
}
</script>

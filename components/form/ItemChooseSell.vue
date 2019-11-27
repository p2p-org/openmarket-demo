<template>
  <b-row>
    <b-col md="6" class="d-flex flex-column pr-2">
      <b-btn variant="primary" size="lg" class="py-2 my-3" :disabled="busy" @click.prevent="sellFixed">
        Sell for fixed price
        <b-spinner v-if="busy" type="grow" small />
      </b-btn>
    </b-col>
    <b-col md="6" class="d-flex flex-column pl-2">
      <b-btn variant="outline-primary" size="lg" class="py-2 my-3" :disabled="busy" @click.prevent="startAuction">
        Make an auction
        <b-spinner v-if="busy" type="grow" small />
      </b-btn>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FormChooseSell',
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    startAuction() {
      this.$emit('auction')
    },
    sellFixed() {
      this.$emit('fixed')
    },
  },
}
</script>

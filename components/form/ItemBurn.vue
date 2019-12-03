<template>
  <b-row class="mt-2">
    <b-col md="6" class="d-flex flex-column">
        <b-btn variant="danger" size="lg" block :disabled="busy" @click.stop.prevent="submit">
          <fa :icon="['fas', 'fire']" /> Burn it!
          <b-spinner v-if="busy" type="grow" small />
        </b-btn>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FormItemBurn',
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    submit() {
      this.$emit('submit', { recipient: this.recipient })
    },
  },
}
</script>

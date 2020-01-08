<template>
  <b-form-group v-bind="$attrs" :label-for="id">
    <b-form-radio-group
      :id="id"
      v-model="innerValue"
      :options="options"
      buttons
      button-variant="outline-secondary"
      name="radio-btn-outline"
      size="sm"
    />
  </b-form-group>
</template>

<script>
export default {
  props: {
    // must be included in props
    value: {
      type: null,
    },
    options: {
      type: Array,
    },
  },
  data: () => ({
    innerValue: null,
  }),
  computed: {
    id() {
      return `input-${this.cuid}`
    },
  },
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit('input', newVal)
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal
    },
  },
  created() {
    this.innerValue = this.value
  },
}
</script>

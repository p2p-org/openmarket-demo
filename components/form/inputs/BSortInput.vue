<template>
  <b-form-group v-bind="$attrs" :label-for="id" label-class="mr-1">
<!--    <span class="mr-1 text-muted">{{ $attrs.title }}</span>-->
    <b-button-group :id="id" size="sm">
      <b-button variant="outline-secondary" :pressed="innerValue === 'asc'" :title="titles.asc" @click.stop.prevent="updateValue('asc')">
        <svg class="svg-inline--fa fa-w-16">
          <use xlink:href="#sort-down" />
        </svg>
<!--        <fa :icon="['fas', 'sort-amount-up']" />-->
      </b-button>
      <b-button variant="outline-secondary" :pressed="innerValue === 'desc'" :title="titles.desc" @click.stop.prevent="updateValue('desc')">
        <svg class="svg-inline--fa fa-w-16">
          <use xlink:href="#sort-up" />
        </svg>
<!--        <fa :icon="['fas', 'sort-amount-down']" />-->
      </b-button>
    </b-button-group>
  </b-form-group>
</template>

<script>
export default {
  props: {
    // must be included in props
    value: {
      type: null,
    },
    titles: {
      type: Object,
      default: null,
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
  methods: {
    updateValue(value) {
      this.innerValue = value
    },
  },
}
</script>

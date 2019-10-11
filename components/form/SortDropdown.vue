<template>
  <b-dropdown size="sm" variant="outline-secondary" class="mr-2">
    <b-dropdown-item-button
      v-for="o in options"
      :key="o.value"
      @click.prevent="onChange(o.value)"
      :active="o.value === currentOption.value"
    >
      {{ o.text }}
    </b-dropdown-item-button>
    <template v-slot:button-content>
      {{ currentOption.text }}
    </template>
  </b-dropdown>
</template>

<script>
export default {
  name: 'SortDropdown',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: null,
    },
  },
  computed: {
    currentOption() {
      return this.options.find(o => o.value === this.value) || { text: ' - select -', value: null }
    },
  },
  methods: {
    onChange(val) {
      this.$emit('change', val)
    },
  },
}
</script>

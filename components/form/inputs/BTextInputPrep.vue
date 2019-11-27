<template>
  <ValidationProvider v-slot="{ validated, dirty, errors }" :vid="vid" :name="$attrs.name" :rules="rules">
<!--    :invalid-feedback="errors[0]"-->
    <b-form-group class="my-0" v-bind="$attrs" :state="validateState(validated, dirty, errors)">
      <b-input-group>
        <template v-slot:prepend>
          <slot></slot>
        </template>
        <b-form-input v-model="innerValue" v-bind="$attrs" :state="validateState(validated, dirty, errors)" size="lg" />
      </b-input-group>
    </b-form-group>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider,
  },
  props: {
    vid: {
      type: String,
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    // must be included in props
    value: {
      type: null,
    },
  },
  data: () => ({
    innerValue: '',
  }),
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
    if (this.value) {
      this.innerValue = this.value
    }
  },
  methods: {
    validateState(validated, dirty, errors) {
      if (dirty || validated) {
        return !errors.length
      }
      return null
    },
  },
}
</script>

<template>
  <ValidationProvider v-slot="{ validated, dirty, errors }" :vid="vid" :name="$attrs.name" :rules="rules">
<!--    :invalid-feedback="errors[0]"-->
    <b-form-group class="my-0" v-bind="$attrs" :label-for="id" :state="validateState(validated, dirty, errors)">
      <b-input-group size="lg">
        <template v-slot:prepend>
          <b-dropdown :variant="classDropdown(validated, dirty, errors)">
            <template v-slot:button-content>
              <b-img :src="coinImage(innerValue.denom)" rounded="circle" width="30px" height="30px" />
            </template>
            <b-dropdown-item v-for="denom in coins" :key="denom" @click="setCoin(denom)">
              <b-img :src="coinImage(denom)" rounded="circle" width="30px" height="30px" /> {{ coinName(denom) }} <small class="text-muted">({{ denom }})</small>
            </b-dropdown-item>
          </b-dropdown>
        </template>
        <b-form-input v-model="innerValue.amount" v-bind="$attrs" :id="id" :state="validateState(validated, dirty, errors)" />
      </b-input-group>
    </b-form-group>
  </ValidationProvider>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
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
      type: Object,
      default: null,
    },
    // must be included in props
    value: {
      type: null,
    },
  },
  data: () => ({
    innerValue: {
      amount: 0,
      denom: null,
    },
  }),
  computed: {
    ...mapState({
      coins: state => state.market.coins,
    }),
    ...mapGetters('config', ['coinImage', 'coinName']),
    id() {
      return `input-${this.cuid}`
    },
    innerRules() {
      return { required: true, numeric: true, min_value: 1, ...this.rules }
    },
  },
  watch: {
    // Handles internal model changes.
    innerValue: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true,
    },
    // Handles external model changes.
    value: {
      handler(newVal) {
        this.innerValue = newVal
      },
      deep: true,
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
    classDropdown(validated, dirty, errors) {
      switch (this.validateState(validated, dirty, errors)) {
        case true:
          return 'outline-success'
        case false:
          return 'outline-danger'
        default:
          return 'outline-default'
      }
    },
    setCoin(denom) {
      this.innerValue.denom = denom
    },
  },
}
</script>

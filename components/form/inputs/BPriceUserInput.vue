<template>
  <ValidationProvider v-slot="{ validated, dirty, errors }" :vid="vid" :name="$attrs.name" :rules="innerRules">
<!--    :invalid-feedback="errors[0]"-->
    <b-form-group class="my-0" v-bind="$attrs" :label-for="id" :state="validateState(validated, dirty, errors)">
      <b-input-group size="lg">
        <template v-slot:prepend>
          <b-dropdown :variant="classDropdown(validated, dirty, errors)">
            <template v-slot:button-content>
              <b-img :src="coinImage(innerValue.denom)" rounded="circle" width="30px" height="30px" />
            </template>
            <b-dropdown-item v-for="denom in innerCoins" :key="denom" @click="setCoin(denom)">
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
/*
 *  Limit price input to current user amounts
 */
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
    denoms: {
      type: Array,
      default: () => []
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
    ...mapGetters('user', ['currentUser', 'currentUserCoins']),
    ...mapGetters('config', ['coinImage', 'coinName']),
    id() {
      return `input-${this.cuid}`
    },
    innerCoins() {
      // if (this.currentUser && this.currentUser.coins) {
      //   return this.coins.filter(c => this.currentUser.coins.findIndex(x => x.denom === c) !== -1)
      // }
      // return this.currentUser ? this.currentUser.coins.map(c => c.denom) : this.coins
      if (this.denoms.length) {
        return this.coins.filter(d => this.denoms.includes(d))
      }
      return this.currentUser ? this.coins.filter(d => this.currentUserCoins.findIndex(c => c.denom === d) !== -1) : this.coins
    },
    maxAmount() {
      if (!this.currentUser || !this.currentUser.coins) return 0
      const c = this.currentUser.coins.find(x => x.denom === this.innerValue.denom)
      return c ? c.amount : 0
    },
    innerRules() {
      return { required: true, numeric: true, min_value: 1, max_value: this.maxAmount, ...this.rules }
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

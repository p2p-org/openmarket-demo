<template>
  <ValidationObserver ref="observer" v-slot="{ passes, invalid }">
    <b-form novalidate @submit.stop.prevent="passes(submit)">
    <b-row>
      <b-col md="6" class="d-flex flex-column pr-2">
<!--                  <b-form-select v-model="recipient" :options="usersList" size="lg"></b-form-select>-->
        <b-text-input
          :rules="{required: true, regex:/^cosmos[a-z0-9]{39}$/i}"
          name="Recipient"
          type="text"
          label="Enter recipient address"
          v-model="recipient"
          placeholder="recipient"
        />
      </b-col>
      <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
        <b-btn variant="warning" size="lg" class="py-2" :disabled="busy || invalid" type="submit">
          Gift token
          <b-spinner v-if="busy" type="grow" small />
        </b-btn>
      </b-col>
    </b-row>
  </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import BTextInput from './inputs/BTextInput'

export default {
  name: 'FormItemGift',
  components: {
    ValidationObserver,
    BTextInput,
  },
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
      if (this.recipient) {
        this.$emit('submit', { recipient: this.recipient })
      }
    },
  },
}
</script>

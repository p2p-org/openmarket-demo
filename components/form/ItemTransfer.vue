<template>
  <ValidationObserver ref="observer" v-slot="{ passes, invalid }">
    <b-form novalidate @submit.stop.prevent="passes(submit)">
      <b-row>
        <b-col md="6" class="d-flex flex-column pr-2">
          <!--                  <b-form-select v-model="recipient" :options="usersList" size="lg"></b-form-select>-->
          <b-text-input-prep
            v-model="recipient"
            :rules="{ required: true, regex: /^cosmos[a-z0-9]{39}$/i }"
            name="Recipient"
            type="text"
            label="Enter recipient address"
            placeholder="recipient"
          >
            <b-input-group-text><fa :icon="['fas', 'address-book']"/></b-input-group-text>
          </b-text-input-prep>
        </b-col>
        <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
          <b-select-input
            v-model="path"
            name="Network"
            label="Choose destination network"
            placeholder="network"
            :options="options"
            :disabled="busy"
          />
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="8" class="d-flex flex-column pl-2 justify-content-end mx-auto">
          <b-btn variant="warning" size="lg" class="py-2" :disabled="busy || invalid" type="submit">
            Transfer/Gift token
            <b-spinner v-if="busy" type="grow" small />
          </b-btn>
        </b-col>
      </b-row>
    </b-form>
  </ValidationObserver>
</template>

<script>
import {  mapGetters, mapState } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import BTextInputPrep from './inputs/BTextInputPrep'
import BSelectInput from './inputs/BSelectInput'

export default {
  name: 'FormItemTransfer',
  components: {
    BSelectInput,
    BTextInputPrep,
    ValidationObserver
  },
  props: {
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
    path: null,
  }),
  computed: {
    ...mapGetters('config', ['ibcPath']),
    options() {
      return [
        { value: null, text: `Home (${this.ibcPath.src.chainId})` },
        { value: this.ibcPath.dst.channelTx, text: `Target (${this.ibcPath.dst.chainId})` },
      ]
    }
  },
  methods: {
    submit() {
      if (this.recipient) {
        this.$emit('submit', { recipient: this.recipient, path: this.path })
      }
    },
  },
}
</script>

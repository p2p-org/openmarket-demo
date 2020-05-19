<template>
    <b-container>
      <b-row>
        <b-col>
          <b-card class="mb-3 p-2">
            <h6 class="text-muted">
              Token Balances
            </h6>
            <b-list-group flush>
              <b-list-group-item
                v-for="(c, k) in currentUserCoins"
                :key="k"
                class="d-flex justify-content-between align-items-center border-0 px-0"
              >
                <div class="d-flex align-items-center">
                  <b-img :src="coinImage(c.denom)" rounded="circle" width="25px" height="25px" />
                  <h5 class="ml-2 my-0">
                    {{ c.amount }}
                    <small>{{ coinName(c.denom) }} <span class="text-muted">({{ c.denom }})</span></small>
                  </h5>
                </div>
                <b-btn variant="primary" disabled size="sm">
                  Add funds
                </b-btn>
              </b-list-group-item>
            </b-list-group>
          </b-card>
          <b-card class="mb-3 p-2 market-action">
            <ValidationObserver ref="observer" v-slot="{ passes, invalid }">
              <b-form novalidate @submit.stop.prevent="passes(onCoinTransfer)">
                <b-row>
                  <b-col md="4" class="d-flex flex-column pl-2 justify-content-end">
                    <b-text-input-prep
                      v-model="recipient"
                      :rules="{ required: true, regex: /^cosmos[a-z0-9]{39}$/i }"
                      name="Recipient"
                      type="text"
                      label="Enter recipient address"
                      placeholder="address"
                      :disabled="busyTx"
                    >
                      <b-input-group-text>
                        <fa :icon="['fas', 'address-book']" />
                      </b-input-group-text>
                    </b-text-input-prep>
                  </b-col>

                  <b-col md="4" class="d-flex flex-column pl-2 justify-content-end">
                    <b-select-input
                      v-model="path"
                      name="Network"
                      label="Choose destination network"
                      placeholder="network"
                      :options="options"
                      :disabled="busyTx"
                    />
                  </b-col>
                  <b-col md="4" class="d-flex flex-column pl-2 justify-content-end">
                    <b-price-user-input
                      v-model="coin"
                      name="Coins amount"
                      type="text"
                      label="Enter coins amount"
                      placeholder="amount"
                      :disabled="busyTx"
                    />
                  </b-col>
                </b-row>
                <b-row class="mt-2">
                  <b-col md="8" />
                  <b-col md="4" class="d-flex flex-column pl-2 justify-content-end">
                    <b-btn variant="primary" size="lg" class="py-2" :disabled="busyTx || invalid" type="submit">
                      Send coins
                      <b-spinner v-if="busyTx" type="grow" small />
                    </b-btn>
                  </b-col>
                </b-row>
              </b-form>
            </ValidationObserver>
          </b-card>
        </b-col>
      </b-row>

    </b-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import BTextInputPrep from '~/components/form/inputs/BTextInputPrep'
import BPriceUserInput from '~/components/form/inputs/BPriceUserInput'
import BSelectInput from '../../components/form/inputs/BSelectInput'

export default {
  name: 'TabMyBalances',
  components: {
    BSelectInput,
    BPriceUserInput,
    BTextInputPrep,
    ValidationObserver,
  },
  data: () => ({
    // id: this.$route.params.id,
    // alerts: [],
    form: {},
    coin: null,
    recipient: null,
    busyTx: false,
    busy: false,
    path: null,
  }),
  // validate({ params }) {
  //   // Must be a number
  //   return /^\d+$/.test(params.id)
  // },
  computed: {
    ...mapState({
      ibc: state => state.config.ibc,
      baseCoinDenom: state => state.config.baseCoinDenom,
      currentAddress: state => state.user.currentAddress,
    }),
    ...mapGetters('user', ['currentUser', 'userIdByAddress', 'currentUserCoins']),
    ...mapGetters('config', ['coinImage', 'coinName']),
    userBalance() {
      let val = 0
      if (this.currentUser && this.currentUser.coins && this.currentUser.coins.length) {
        val = this.currentUser.coins.find(x => x.denom === this.baseCoinDenom)
        val = val ? val.amount : 0
      }
      return val
    },
    options() {
      return [
        { value: null, text: `Home (${this.ibc.src.chainId})` },
        { value: this.ibc.dst.channelTx, text: `Target (${this.ibc.dst.chainId})` },
      ]
    }
  },
  created() {
    this.coin = {
      amount: 0,
      denom: this.baseCoinDenom,
    }
  },
  methods: {
    ...mapActions('user', ['addUser', 'updUser', 'setCurrentUser', 'loadCurrentUserInfo']),
    ...mapActions('market', ['coinTransfer', 'waitMarket']),

    onCoinTransfer() {
      this.busyTx = true
      this.$bvModal
        .msgBoxConfirm('Confirm coin transfer?')
        .then(confirm => {
          if (confirm) {
            return this.coinTransfer({ user: this.currentUser, recipient: this.recipient, coin: this.coin, path: this.path })
              .then(tx => this.waitMarket({ hash: tx.txhash }))
              .then(tx => {
                console.log('tx mined', tx)
                return this.loadCurrentUserInfo()
              })
              .then(() => {
                this.recipient = null
                this.coin = {
                  amount: 0,
                  denom: this.baseCoinDenom,
                }
                this.$refs.observer.reset()
                return this.$bvModal.msgBoxOk('Coin transfered', { title: 'Great', okVariant: 'success' })
              })
              .catch(e => {
                console.log('transfer fail', e)
                if (e && e.message) {
                  this.$bvModal.msgBoxOk(e.message, { title: 'Error', okVariant: 'danger' })
                }
              })
          }
        })
        .then(() => {
          this.busyTx = false
        })
    },
  },
}
</script>

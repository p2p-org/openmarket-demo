<template>
  <section class="user">
    <b-card v-if="currentUser" no-body class="py-3 mb-3">
      <b-container>
        <b-row>
          <b-col>
            <b-row>
              <b-col>
                <div class="d-flex flex-row align-items-center">
                  <client-only>
                    <jazzicon :address="userAddress" :diameter="70" />
                  </client-only>
                  <h3 class="ml-3">
                    {{ currentUser.name }}
                    <br >
                    <small class="text-muted">
                      {{ currentUser.address }}
                    </small>
                  </h3>
                </div>
              </b-col>
              <b-col lg="5" class="d-flex flex-column">
                <h6 class="text-muted">
                  Balances
                </h6>
                <b-list-group flush>
                  <b-list-group-item
                    v-for="(c, k) in currentUser.coins"
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
                <!--                  <div v-for="c in currentUser.coins">-->
                <!--                    <div class="d-flex justify-content-middle align-items-center">-->
                <!--                      <b-img :src="coinImage(c.denom)" rounded="circle" width="33px" height="33px" />-->
                <!--                      <h1 class="ml-2 my-0">-->
                <!--                        <b>{{ c.amount | priceBig }}</b> {{ coinName(c.denom) }}-->
                <!--                      </h1>-->
                <!--                    </div>-->
                <!--&lt;!&ndash;                    <h4 class="mt-1">&ndash;&gt;-->
                <!--&lt;!&ndash;                      <small class="text-muted">{{ price.value | priceEth(rate) }}</small>&ndash;&gt;-->
                <!--&lt;!&ndash;                    </h4>&ndash;&gt;-->
                <!--                  </div>-->
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
    <b-container>
      <b-row>
        <b-col lg="10" xl="8" class="mx-auto">
          <b-card class="mb-3 p-2 market-action">
            <ValidationObserver ref="observer" v-slot="{ passes, invalid }">
              <b-form novalidate @submit.stop.prevent="passes(onCoinTransfer)">
                <b-row>
                  <b-col>
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
                  <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
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
                  <b-col md="6" />
                  <b-col md="6" class="d-flex flex-column pl-2 justify-content-end">
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
      <b-row class="justify-content-md-center">
        <b-col lg="10" xl="8">
          <h5 v-if="address !== null">
            Change user
          </h5>
          <h5 v-else>
            Add user
          </h5>
          <b-card>
            <b-form-group id="fieldset-name" label="Name" label-for="input-name">
              <b-form-input id="input-name" v-model="form.name" trim />
            </b-form-group>
            <b-form-group id="fieldset-address" label="Address" label-for="input-address">
              <b-form-input id="input-address" v-model="form.address" trim readonly />
            </b-form-group>
            <b-form-group id="fieldset-address" label="Mnemonic" label-for="input-mnemonic">
              <!--            <b-input-group>-->
              <b-form-input id="input-address" v-model="form.mnemonic" trim :readonly="address !== null" />
              <!--              <b-input-group-append v-if="id === null">-->
              <!--                <b-button variant="info" @click="genMnemonic">Generate</b-button>-->
              <!--              </b-input-group-append>-->
              <!--            </b-input-group>-->
            </b-form-group>
            <!--          <b-form-group id="fieldset-password" label="Private key" label-for="input-pk">-->
            <!--            <b-form-input id="input-password" v-model="form.pk" trim :readonly="!isPk" />-->
            <!--          </b-form-group>-->
            <template slot="footer">
              <b-button variant="primary" :disabled="busy" @click.prevent="doSetUser">
                Save
                <b-spinner v-if="busy" type="grow" small />
              </b-button>
              <b-button v-if="address === null" variant="info" :disabled="busy" @click="genUser">
                Generate
              </b-button>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import BTextInputPrep from '../../components/form/inputs/BTextInputPrep'
import BPriceUserInput from '../../components/form/inputs/BPriceUserInput'
import Jazzicon from '~/components/Jazzicon'

export default {
  name: 'UserLogin',
  components: {
    BPriceUserInput,
    BTextInputPrep,
    ValidationObserver,
    Jazzicon,
  },
  data: () => ({
    // id: this.$route.params.id,
    // alerts: [],
    form: {},
    coin: null,
    recipient: null,
    busyTx: false,
    busy: false,
  }),
  // validate({ params }) {
  //   // Must be a number
  //   return /^\d+$/.test(params.id)
  // },
  computed: {
    ...mapState({
      baseCoinDenom: state => state.config.baseCoinDenom,

      users: state => state.user.users,
      current: state => state.user.current,
    }),
    ...mapGetters('user', ['currentUser', 'userIdByAddress']),
    ...mapGetters('config', ['coinImage', 'coinName']),
    address() {
      return this.$route.params.address !== null && typeof this.$route.params.address !== 'undefined' ? this.$route.params.address : null
    },
    userAddress() {
      return this.currentUser ? this.currentUser.address.substring(8) : ''
    },
  },
  watch: {
    current(address) {
      if (address) {
        //     console.log(this.$route)
        //     console.log(u)
        //     const id = this.userIdByAddress(u.address)
        //     if (id !== -1) {
        this.$router.push({ name: this.$route.name, params: { address } })
        //     }
        this.form = { ...this.currentUser }
      }
    },
  },
  created() {
    this.coin = {
      amount: 0,
      denom: this.baseCoinDenom,
    }
  },
  mounted() {
    if (this.address && this.users[this.address]) {
      // this.setCurrentUser(this.address).then(() => {
      this.form = { ...this.currentUser }
      // })
    } else {
      this.$router.push({ name: this.$route.name })
    }
  },
  methods: {
    ...mapActions('user', ['addUser', 'updUser', 'setCurrentUser', 'loadCurrentUserInfo']),
    ...mapActions('market', ['coinTransfer', 'waitMarket']),
    doSetUser() {
      // if (!this.form.address) return
      this.busy = true
      if (this.address) {
        this.updUser({ params: this.form, address: this.address })
          .then(() => {
            this.busy = false
            this.$bvModal.msgBoxOk('User updated', { title: 'Success', okVariant: 'success' })
          })
          .catch(err => {
            this.busy = false
            this.$bvModal.msgBoxOk(err, { title: 'Error', okVariant: 'danger' })
          })
      } else {
        let name = this.form.name
        if (!name) {
          name = 'stranger' + (Object.keys(this.users).length + 1)
        }
        const mnemonic = this.form.mnemonic
        this.form = { name, mnemonic, address: '...generating' }
        setTimeout(() => {
          this.addUser({ mnemonic, name })
            .then(address => {
              console.log('new user added', address, this.currentUser)
              this.busy = false
              this.form = { ...this.form, address }
              this.$bvModal.msgBoxOk('User added', { title: 'Success', okVariant: 'success' }).then(() => {
                this.setCurrentUser(address)
                // this.$router.push({ name: 'user-address', params: { address: this.current } })
              })
            })
            .catch(err => {
              this.busy = false
              this.$bvModal.msgBoxOk(err, { title: 'Error', okVariant: 'danger' })
            })
        }, 100)
      }
    },
    genUser() {
      let name = this.form.name
      if (!name) {
        name = 'stranger' + (Object.keys(this.users).length + 1)
      }
      this.form = { name, mnemonic: '...generating', address: '...generating' }

      setTimeout(() => {
        const mnemonic = this.$txApi.randomMnemonic(192)
        // const address = this.$txApi.getAddress(mnemonic)
        // console.log(mnemonic)
        this.form = { name, mnemonic }
      }, 100)
    },
    onCoinTransfer() {
      this.busyTx = true
      this.$bvModal
        .msgBoxConfirm('Confirm coin transfer?')
        .then(confirm => {
          if (confirm) {
            return this.coinTransfer({ user: this.currentUser, recipient: this.recipient, coin: this.coin })
              .then(res => this.waitMarket({ hash: res.result.txhash }))
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

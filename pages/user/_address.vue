<template>
  <section class="user">
    <b-row class="justify-content-md-center">
      <b-col md="10" lg="8" xl="6">
        <h5 v-if="address !== null">Change user</h5>
        <h5 v-else>Add user</h5>
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
            <b-button variant="primary" @click.prevent="doSetUser" :disabled="busy">
              Save
              <b-spinner v-if="busy" type="grow" small />
            </b-button>
            <b-button v-if="address === null" variant="info" @click="genUser" :disabled="busy">Generate</b-button>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'UserLogin',
  data: () => ({
    // id: this.$route.params.id,
    // alerts: [],
    form: {},
    busy: false,
  }),
  // validate({ params }) {
  //   // Must be a number
  //   return /^\d+$/.test(params.id)
  // },
  computed: {
    ...mapState({
      users: state => state.user.users,
      current: state => state.user.current,
    }),
    ...mapGetters('user', ['currentUser', 'userIdByAddress']),
    address() {
      return this.$route.params.address !== null && typeof this.$route.params.address !== 'undefined'
        ? this.$route.params.address
        : null
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
    ...mapActions('user', ['addUser', 'updUser', 'setCurrentUser']),
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
              this.$bvModal.msgBoxOk('User added', { title: 'Success', okVariant: 'success' })
                .then(() => {
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
  },
}
</script>

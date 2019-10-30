<template>
  <section class="user">
    <b-row class="justify-content-md-center">
      <b-col md="10" lg="8" xl="6">
        <h5 v-if="id !== null">Change user</h5>
        <h5 v-else>Add user</h5>
        <b-card>
          <b-form-group id="fieldset-name" label="Name" label-for="input-name">
            <b-form-input id="input-name" v-model="form.name" trim />
          </b-form-group>
          <b-form-group id="fieldset-address" label="Address" label-for="input-address">
            <b-form-input id="input-address" v-model="form.address" trim readonly />
          </b-form-group>
          <b-form-group id="fieldset-address" label="Mnemonic" label-for="input-mnemonic">

            <b-input-group>
              <b-form-input id="input-address" v-model="form.mnemonic" trim :readonly="id !== null" />
              <b-input-group-append v-if="id === null">
                <b-button variant="info" @click="genMnemonic">Generate</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
<!--          <b-form-group id="fieldset-password" label="Private key" label-for="input-pk">-->
<!--            <b-form-input id="input-password" v-model="form.pk" trim :readonly="!isPk" />-->
<!--          </b-form-group>-->
          <template slot="footer">
            <b-button variant="primary" @click.prevent="doSetUser" :disabled="busy">
              Save
              <b-spinner v-if="busy" type="grow" />
            </b-button>
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
      currentId: state => state.user.currentId,
    }),
    ...mapGetters('user', ['currentUser', 'userIdByAddress']),
    id() {
      return this.$route.params.id !== null && typeof this.$route.params.id !== 'undefined'
        ? parseInt(this.$route.params.id)
        : null
    },
  },
  watch: {
    currentUser(u) {
      if (u) {
        console.log(this.$route)
        console.log(u)
        const id = this.userIdByAddress(u.address)
        if (id !== -1) {
          this.$router.push({ name: this.$route.name, params: { id } })
        }
      }
      // this.form = { ...this.currentUser }
    },
  },
  mounted() {
    if (this.id !== null && this.id < this.users.length) {
      this.setCurrentUser(this.id).then(() => {
        this.form = { ...this.currentUser }
      })
    } else {
      this.$router.push({ name: this.$route.name })
    }
  },
  methods: {
    ...mapActions('user', ['setUser', 'setCurrentUser']),
    doSetUser() {
      if (!this.form.address) return
      this.busy = true
      this.setUser({ ...this.form, id: this.id })
        .then(() => {
          this.busy = false
          this.$router.push({ name: 'user-id', params: { id: this.currentId } })
          this.$bvModal.msgBoxOk('User saved', { title: 'Success', okVariant: 'success' })
        })
        .catch(err => {
          this.busy = false
          this.$bvModal.msgBoxOk(err, { title: 'Error', okVariant: 'danger' })
        })
    },
    genMnemonic() {
      const mnemonic = this.$txApi.randomMnemonic(192)
      const address = this.$txApi.getAddress(mnemonic)
      // console.log(mnemonic)
      this.form = { ...this.form, mnemonic, address }
    },
  },
}
</script>

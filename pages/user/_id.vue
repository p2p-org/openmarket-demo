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

          <b-form-group id="fieldset-address" label="Mnemonic" label-for="input-mnemonic">
            <b-form-input id="input-address" v-model="form.mnemonic" trim />
          </b-form-group>
          <b-form-group id="fieldset-password" label="Password" label-for="input-password">
            <b-form-input id="input-password" v-model="form.password" trim />
          </b-form-group>
          <template slot="footer">
            <b-button variant="primary" @click.prevent="doSetUser">Save</b-button>
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
  }),
  // validate({ params }) {
  //   // Must be a number
  //   return /^\d+$/.test(params.id)
  // },
  computed: {
    ...mapState({
      currentId: state => state.user.currentId,
    }),
    ...mapGetters('user', ['currentUser']),
    id() {
      return this.$route.params.id !== null && typeof this.$route.params.id !== 'undefined'
        ? this.$route.params.id
        : null
    },
  },
  watch: {
    currentUser(u) {
      this.form = { ...this.currentUser }
    },
  },
  mounted() {
    if (this.id !== null) {
      this.setCurrentUser(this.id).then(() => {
        this.form = { ...this.currentUser }
      })
    }
  },
  methods: {
    ...mapActions('user', ['setUser', 'setCurrentUser']),
    doSetUser() {
      this.setUser({ ...this.form, id: this.id }).then(() => {
        this.$router.push({ name: 'user-id', params: { id: this.currentId } })
      })
    },
  },
}
</script>

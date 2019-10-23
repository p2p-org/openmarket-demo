<template>
  <section class="nft">
    <b-container>
      <b-row class="">
        <b-col>
          <b-card>
            <b-form v-if="show" @submit.prevent="onSubmit" @reset.prevent="onReset">
              <b-form-group id="input-group-1" label="Token ID:" label-for="input-1">
                <b-form-input id="input-1" v-model="form.tokenId" type="text" required placeholder="Enter token ID" />
              </b-form-group>

              <b-button type="submit" variant="primary" :disabled="busy">
                Mint
                <b-spinner v-if="busy" small type="grow" />
              </b-button>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Nft',
  // props: {
  //   minter: {
  //     type: String,
  //     default: null,
  //   },
  // },

  data() {
    return {
      form: {},
      show: true,
      busy: false,
    }
  },
  computed: {
    ...mapState({
      nfts: state => state.market.nfts,
    }),
    ...mapGetters('user', ['currentUser']),
    nextId() {
      const id = this.nfts.reduce((a, n) => {
        const i = parseInt(n.token_id.replace(/\D/g, ''))
        return i > a ? i : a
      }, 0)
      return `TOKEN_${id + 1}`
    },
  },
  // watch: {
  //   minter(minter) {
  //     this.updNextTokenId()
  //   },
  // },
  mounted() {
    this.updNextTokenId()
  },
  methods: {
    ...mapActions('market', ['queryNft', 'nftMint']),
    ...mapActions('user', ['loadUserInfo']),
    updNextTokenId() {
      this.queryNft({ force: true }).then(() => {
        this.form = { tokenId: this.nextId }
      })
    },
    onSubmit() {
      this.busy = true
      this.nftMint({
        user: this.currentUser,
        token: {
          id: this.nextId,
          // description: '',
          // image: '',
          uri: '/api/token/' + this.nextId,
        },
      }).then(r => {
        console.log(r)
      })

      // todo
      setTimeout(() => {
        this.updNextTokenId()
        this.$bvModal
          .msgBoxOk('NFT Minted')
          .then(value => {
            this.busy = false
          })
          .catch(err => {
            // An error occurred
          })
      }, 2000)
    },
    onReset(evt) {
      // Reset our form values
      this.form.tokenId = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
}
</script>

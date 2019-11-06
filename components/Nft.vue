<template>
  <section class="nft">
    <b-container>
      <b-row class="">
        <b-col>
          <b-alert show dismissible variant="info">
            Please note, if you leave all fields empty, they will be automatically generated.
          </b-alert>
          <b-card>
            <b-form v-if="show" novalidate @submit.prevent="onSubmit" @reset.prevent="onReset">
              <b-form-group id="input-group-1" label="Token ID:" label-for="input-1">
                <b-form-input id="input-1" v-model="form.tokenId" type="text" required placeholder="Enter token ID" disabled />
              </b-form-group>
              <b-form-group id="input-group-1" label="Token Name:" label-for="input-2" description="Left blank to automatically generate">
                <b-form-input id="input-1" v-model="form.name" type="text" required trim placeholder="Enter token name" />
              </b-form-group>
              <b-form-group
                id="input-group-1"
                label="Token description:"
                label-for="input-3"
                description="Left blank to automatically generate"
              >
                <b-form-textarea id="input-1" v-model="form.description" required trim placeholder="Enter token description" />
              </b-form-group>
              <b-form-group
                id="input-group-1"
                label="Token Image URL:"
                label-for="input-4"
                description="Left blank to automatically generate"
              >
                <b-form-input id="input-1" v-model="form.image" type="text" required trim placeholder="Enter token image URL" />
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
import { Nft } from '~/models'

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
      prefix: 'TOKEN_',
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
      return id + 1
    },
  },
  // watch: {
  //   minter(minter) {
  //     this.updNextTokenId()
  //   },
  // },
  mounted() {
    this.updNextTokenId()
    Nft.params({ t: Date.now() })
      .get()
      .then(nfts => {
        // console.log('12312312', nfts)
      })
  },
  methods: {
    ...mapActions('market', ['queryNft', 'nftMint']),
    ...mapActions('user', ['loadUserInfo']),
    updNextTokenId() {
      this.queryNft({ force: true }).then(() => {
        this.form = { tokenId: this.prefix + this.nextId }
      })
    },
    onSubmit() {
      this.busy = true
      const id = this.nextId
      const tokenId = this.prefix + id
      const meta = {}
      if (this.form.name) {
        this.nftAddMetaProp(meta, { trait: 'name', value: this.form.name, display: 'title' })
      }
      if (this.form.image) {
        this.nftAddMetaProp(meta, { trait: 'image', value: this.form.image, display: 'image' })
      }
      if (this.form.description) {
        this.nftAddMetaProp(meta, { trait: 'description', value: this.form.description, display: 'description' })
      }

      // let a = new Nft({ ...this.form, id })
      // console.log('NN', a)

      // save to db
      new Nft({ id, meta })
        .save()
        .then(m =>
          this.nftMint({
            user: this.currentUser,
            token: {
              id: tokenId,
              // description: '',
              // image: '',
              uri: '/api/token/' + tokenId,
            },
          })
        )
        .then(r => {
          // console.log(r)
          // todo
          setTimeout(() => {
            this.updNextTokenId()
            this.$bvModal.msgBoxOk('NFT Minted').then(value => {
              this.busy = false
              this.$router.push({ name: 'market-item', params: { item: tokenId } })
            })
          }, 2000)
        })
        .catch(this.handleErr)
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
    handleErr(e) {
      this.busy = false
      this.$bvModal.msgBoxOk(e.message, { title: 'Error', okVariant: 'danger' })
    },
  },
}
</script>

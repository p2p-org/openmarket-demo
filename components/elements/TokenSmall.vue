<template>
  <div class="d-flex justify-content-start el-token-small">
    <b-img v-if="image" v-bind="imgProps" rounded="circle" :src="image" :alt="title" class="ml-1" />
    <b-spinner v-else />
    <div class="d-flex flex-column justify-content-center">
      <h6 class="ml-2 mb-1">{{ title | truncate(35) }}</h6>
      <small><b-link :to="localePath({ name: 'market-item', params: { item: tokenId } })" class="ml-2">
        #{{ tokenId }}
      </b-link>
      </small>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    tokenId: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    imgProps: { width: 50, height: 50 },
  }),
  computed: {
    ...mapGetters('market', ['findNft', 'isBusyNft']),
    busy() {
      return this.isBusyNft(this.tokenId)
    },
    nft() {
      return this.findNft(this.tokenId)
    },
    title() {
      return this.nft ? this.nftMetaProp(this.nft.meta, 'name').value : this.tokenId
    },
    image() {
      return this.nft ? this.nftMetaProp(this.nft.meta, 'image').value : null
    },
  },
  watch: {
    // tokenId(tokenId) {
    //   if (tokenId) {
    //     this.nft = this.findNft(tokenId)
    //     if ()
    //   }
    // },

    nft: {
      handler(nft) {
        if (!nft || !nft.meta) {
          this.nftBusyLock({ tokenId: this.tokenId }).then(() => {
            this.queryNft({ force: true, params: { tokenId: this.tokenId } })
              .catch(console.log)
              .then(() => this.nftBusyUnlock({ tokenId: this.tokenId }))
          })
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {

  },
  methods: {
    ...mapActions('market', ['queryNft', 'nftBusyLock', 'nftBusyUnlock']),

  },
}
</script>

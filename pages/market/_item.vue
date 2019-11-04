<template>
  <page>
    <market-item :nft="nft" :rate="rateETH" @sell-fixed="onSellFixed" @cancel-fixed="onCancelFixed"></market-item>
  </page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Page from '@/components/Page'
import MarketItem from '@/components/MarketItem'

export default {
  name: 'PageMarketItem',
  validate({ params }) {
    // Must be a number
    return /^[\d\w]+$/.test(params.item)
  },
  components: { MarketItem, Page },
  // props: {
  //   id: {
  //     type: String,
  //     default: null,
  //   },
  // },
  data: () => ({
  }),
  computed: {
    ...mapState({
      rateETH: state => state.config.rateETH,
    }),

    ...mapGetters('user', ['currentUser']),
    ...mapGetters('market', ['findNft']),
    nft() {
      return this.findNft(this.$route.params.item)
    },

  },
  mounted() {
    this.queryNft({ force: true, params: { tokenId: this.$route.params.item } })
  },
  methods: {
    ...mapActions('market', ['queryNft', 'nftSellFixed', 'nftCancelFixed']),
    onSellFixed() {

    },
    onCancelFixed() {

    }
  },
}
</script>

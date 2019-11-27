<template>
  <page>
    <market-item :nft="nft" :offers="offers" :bids="bids" :rate="rateETH" @sell-fixed="onSellFixed" @cancel-fixed="onCancelFixed"></market-item>
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
    ...mapGetters('market', ['findNft', 'findOffers', 'findBids']),
    nft() {
      return this.findNft(this.$route.params.item)
    },
    offers() {
      const o = this.findOffers(this.$route.params.item)
      return o ? o.offers : []
    },
    bids() {
      const o = this.findBids(this.$route.params.item)
      return o ? o.bids : []
    },
  },
  created() {
    this.queryNft({ force: true, params: { tokenId: this.$route.params.item } })
      .then(() => this.queryOffer({ params: { tokenId: this.$route.params.item } }))
      .then(() => this.queryBid({ params: { tokenId: this.$route.params.item } }))
  },
  methods: {
    ...mapActions('market', ['queryNft', 'nftSellFixed', 'nftCancelFixed', 'queryOffer', 'queryBid']),
    onSellFixed() {

    },
    onCancelFixed() {

    }
  },
}
</script>

<template>
  <market>
    <market-item :nft="nft" :offers="offers" :bids="bids" :rate="rate" />
  </market>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Market from '@/components/Market'
import MarketItem from '@/components/MarketItem'

export default {
  name: 'PageMarketItem',
  validate({ params }) {
    // Must be a number
    return /^[\d\w]+$/.test(params.item)
  },
  components: { MarketItem, Market },
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
      rate: state => state.config.rateETH,
      userAddress: state => state.config.v,
    }),
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
  watch: {
    nft(nft) {
      if (!nft) {
        this.$router.push(this.localePath({ name: 'market', query: { owner: this.userAddress } }))
      }
    },
  },
  created() {
    this.queryNft({ force: true, params: { tokenId: this.$route.params.item } })
    .then(() => {
      if (!this.nft) {
        this.$router.push(this.localePath({ name: 'market' }))
      }
    })
      // .then(() => this.queryOffer({ params: { tokenId: this.$route.params.item } }))
      // .then(() => this.queryBid({ params: { tokenId: this.$route.params.item } }))
  },
  methods: {
    ...mapActions('market', ['queryNft', 'queryOffer', 'queryBid']),
  },
}
</script>

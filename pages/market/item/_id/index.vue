<template>
  <page>
    <market-item :nft="nft"></market-item>
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
    return /^[\d\w]+$/.test(params.id)
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
    ...mapGetters('market', ['findNft']),
    nft() {
      return this.findNft(this.$route.params.id)
    }
  },
  mounted() {

  },
  methods: {
  },
}
</script>

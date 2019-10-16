<template>
  <page>
    <market-item :id="$route.params.id"></market-item>
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
  },
  mounted() {

  },
  methods: {
  },
}
</script>

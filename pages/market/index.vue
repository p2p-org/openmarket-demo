<template>
  <market>
    <b-container>
      <b-jumbotron class="banner1">
        <h1>BlockRobots</h1>
        <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos
          dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia
          animi, id est laborum et dolorum fuga.
        </p>
      </b-jumbotron>
    </b-container>
    <section class="market">
      <market-list :owner="owner" :search="search" />
    </section>
  </market>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import MarketList from '~/components/MarketList'
import Market from '~/components/Market'

export default {
  name: 'PageMarket',
  components: { Market, MarketList },
  data: () => ({}),
  computed: {
    ...mapState({
      currentAddress: state => state.user.currentAddress,
    }),
    owner() {
      return this.$route.query.owner || null
    },
    search() {
      return this.$route.query.q || null
    },
  },
  watch: {
    owner: {
      handler(owner) {
        this.queryNft({ force: true, params: { owner } }).catch(this.alertError)
      },
      immediate: true,
    },
    currentAddress(to, from) {
      if (to && from) {
        if (this.owner === from) {
          this.$router.push({ name: this.$route.name, query: { ...this.$route.query, owner: to } })
        }
      }
    },
  },
  created() {
    // this.reloadNftPage()
    // todo search query to server
    // this.queryNft({ force: true, params: { owner: this.owner } })

    // this.queryNft({ force: true, params: { tokenId: this.$route.params.item } })
      // .then(() => this.queryOffer({ params: { tokenId: this.$route.params.item } }))
      // .then(() => this.queryBid({ params: { tokenId: this.$route.params.item } }))
  },
  methods: {
    ...mapActions('market', ['queryNft']),
  },
}
</script>

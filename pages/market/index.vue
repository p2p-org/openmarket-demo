<template>
  <page>
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
      <market-list :owner="owner" />
    </section>
  </page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import MarketList from '@/components/MarketList'
import Page from '@/components/Page'

export default {
  name: 'PageMarket',
  components: { Page, MarketList },
  data: () => ({}),
  computed: {
    ...mapState({
      current: state => state.user.current,
    }),
    owner() {
      return this.$route.query.owner || null
    },
  },
  watch: {
    current(to, from) {
      if (to && from) {
        if (this.owner === from) {
          this.$router.push({ name: this.$route.name, query: { owner: to } })
        }
      }
    },
  },
  mounted() {},
  methods: {},
}
</script>

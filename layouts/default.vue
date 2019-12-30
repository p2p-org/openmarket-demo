<template>
  <div>
    <page-header v-if="!loading" />
    <nuxt v-if="!loading" />
    <!--    <page-footer />-->
    <pre-loader />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PreLoader from '../components/PreLoader'
import PageHeader from '~/components/Header'
// import PageFooter from '~/components/Footer'

export default {
  name: 'Layout',
  components: {
    PreLoader,
    PageHeader,
    // PageFooter,
  },

  data: () => ({}),
  computed: {
    ...mapState({
      loading: state => state.loading,
    }),
  },
  mounted() {
    this.queryCoins()
    // this.initUsers().then(() => {
      this.stopLoader()
    // })
  },
  methods: {
    ...mapActions(['initUsers', 'stopLoader']),
    ...mapActions('market', ['queryCoins']),
  },
}
</script>

<template>
  <div :class="theme">
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
      theme: state => state.theme,
    }),
  },
  mounted() {
    this.initUsers().then(() => {
      this.stopLoader()
    })
    console.log('rrrr', this.$router)
  },
  methods: {
    ...mapActions(['initUsers', 'stopLoader']),
  },
}
</script>

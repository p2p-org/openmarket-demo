<template>
  <div :class="getTheme">
    <page-header />
    <nuxt />
    <!--    <page-footer />-->
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import PageHeader from '~/components/Header'
// import PageFooter from '~/components/Footer'

export default {
  name: 'Layout',
  components: {
    PageHeader,
    // PageFooter,
  },

  computed: {
    // ...mapState({
    //   user: (state) => state.user.user,
    // }),
    ...mapGetters(['getTheme']),
  },
  methods: {
    // ...mapActions('user', ['logout']),
  }
}
</script>

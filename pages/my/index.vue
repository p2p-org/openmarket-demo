<template>
  <page>
    <my-list :owner="currentUser.address" />
  </page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Page from '@/components/Page'
import MyList from '@/components/MyList'

export default {
  name: 'PageMy',
  components: { MyList, Page },
  data: () => ({}),
  computed: {
    ...mapGetters('user', ['currentUser']),
  },
  mounted() {},
  methods: {},
}
</script>

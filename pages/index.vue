<template>
  <page>
    <b-container>
      <b-jumbotron>
        <h1 class="text-center">Open Market Demo</h1>
      </b-jumbotron>
    </b-container>
  </page>
</template>

<script>
import Page from '@/components/Page'

export default {
  name: 'PageIndex',
  components: { Page },
  created() {
    // if (this.$route.name === 'index') {
      this.$router.push(this.localePath({ name: 'market' }))
    // }
  },
}
</script>

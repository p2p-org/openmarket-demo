<template>
  <page>
    <nft />
  </page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Nft from '@/components/Nft'
import Page from '@/components/Page'

export default {
  name: 'PageNft',
  components: { Page, Nft },
}
</script>

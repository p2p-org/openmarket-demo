<template>
  <div class="d-flex justify-content-start align-items-center el-owner-address">
    <client-only>
<!--      class="d-none d-md-inline"-->
      <jazzicon :address="address" :diameter="31" />
    </client-only>
    <b-link :to="localePath({ name: 'market', query: { owner: address } })" class="ml-2">
      <span class="d-none d-lg-inline">{{ address | truncate(10, false) }}</span><span class="text-nowrap">{{ address | truncate(-5) }}</span>
    </b-link>
    <slot />
  </div>
</template>

<script>
import Jazzicon from '../Jazzicon'

export default {
  components: { Jazzicon },
  props: {
    address: {
      type: String,
      default: null,
    },
  },
}
</script>

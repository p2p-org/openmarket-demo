<template>
  <b-row v-if="owner" class="mt-2">
    <b-col md="6" class="d-flex flex-column pr-4">
      <b-form-group label="Owner" label-class="pb-0">
        <client-only>
          <jazzicon :address="ownerAddress" :diameter="20" />
        </client-only>
        <b-link :to="{ name: 'market', query: { owner: ownerAddress } }">
          {{ ownerAddress | collapse(10, 5) }}
        </b-link>
        <span class="text-muted"> items on sale {{ ownerItemsOnSaleCount }} / {{ ownerItemsCount }}</span>
      </b-form-group>
    </b-col>
    <b-col md="6" class="d-flex flex-column p-2">
    </b-col>
  </b-row>
</template>

<script>
import Jazzicon from '../Jazzicon'
export default {
  name: 'FormItemOwner',
  components: {
    Jazzicon,
  },
  props: {
    owner: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ownerAddress() {
      return this.owner.address
    },
    ownerItemsCount() {
      return this.owner ? this.owner.items_owned.aggregate.count : '-'
    },
    ownerItemsOnSaleCount() {
      return this.owner ? this.owner.items_on_sale.aggregate.count : '-'
    },
  },
}
</script>

<template>
  <b-row v-if="owner" class="mt-2">
    <b-col class="d-flex flex-column pr-4">
      <b-form-group label="Owner" :label-for="id" class="my-0">
<!--        <owner-address :address="ownerAddress" />-->
<!--        <client-only>-->
<!--          <jazzicon :address="ownerAddress" :diameter="20" />-->
<!--        </client-only>-->
<!--        <b-link :id="id" :to="localePath({ name: 'market', query: { owner: ownerAddress } })">-->
<!--          {{ ownerAddress | collapse(10, 5) }}-->
<!--        </b-link>-->
        <owner-address :address="ownerAddress">
          <span class="text-muted ml-2"> items on sale <b>{{ ownerItemsOnSaleCount }}</b> of <b>{{ ownerItemsCount }}</b> total</span>
        </owner-address>
      </b-form-group>
    </b-col>
<!--    <b-col md="6" class="d-flex flex-column p-2">-->
<!--    </b-col>-->
  </b-row>
</template>

<script>
import Jazzicon from '../Jazzicon'
import OwnerAddress from '../elements/OwnerAddress'
export default {
  name: 'FormItemOwner',
  components: {
    OwnerAddress,
    Jazzicon,
  },
  props: {
    owner: {
      type: Object,
      default: null,
    },
  },
  computed: {
    id() {
      return `input-${this.cuid}`
    },
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

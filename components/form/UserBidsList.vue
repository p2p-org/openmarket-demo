<template>
  <b-table v-if="items.length" borderless sort-icon-left :items="items" :fields="fields" class="offers-list">
    <template v-slot:cell(token_id)="data">
      <token-small :token-id="data.value"></token-small>
    </template>
    <template v-slot:cell(price)="data">
      <coin-price-inline :price="data.item.price" />
    </template>
    <template v-slot:cell(bidder)="data">
      <owner-address :address="data.value" />
    </template>
    <template v-slot:cell(created_at)="data">
      <date-time :value="data.value" />
    </template>

  </b-table>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import CoinPriceInline from '../elements/CoinPriceInline'
import DateTime from '../elements/DateTime'
import TokenSmall from '../elements/TokenSmall'
import OwnerAddress from '../elements/OwnerAddress'

export default {
  name: 'FormUserBidsList',
  components: { OwnerAddress, TokenSmall, DateTime, CoinPriceInline },
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    fields: [
      {
        key: 'token_id',
        label: 'Token',
        formatter: (value, key, item) => {
          return item.nft.token_id
        },
        sortable: true,
        sortByFormatted: true,
        // filterByFormatted: true,
      },
      { key: 'price', label: 'Bid', sortable: true },
      { key: 'bidder', sortable: true },
      { key: 'created_at', label: 'Date', sortable: true },
      { key: 'actions', label: '', class: 'bids-actions ' },
    ],
  }),
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('market', ['isBusyNft']),
    buyer() {
      return this.currentUser ? this.currentUser.address : null
    },
  },
  methods: {

  },
}
</script>

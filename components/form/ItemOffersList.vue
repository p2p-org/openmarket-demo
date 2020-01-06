<template>
  <b-table v-if="items.length" borderless sort-icon-left :items="items" :fields="fields" class="offers-list">
    <template v-slot:cell(price)="data">
      <coin-price-inline :price="data.item.price" />
    </template>
    <template v-slot:cell(buyer)="data">
      <owner-address :address="data.value" />
    </template>
    <template v-slot:cell(created_at)="data">
      <date-time :value="data.value" />
    </template>
    <template v-slot:cell(actions)="data">
      <b-btn
        v-if="isMyOffer(data.item)"
        variant="outline-secondary"
        size="sm"
        :disabled="isBusyNft(data.item.nft.token_id)"
        @click.stop="cancel(data.item)"
        >Cancel
      </b-btn>
      <b-btn
        v-else-if="isMyNft(data.item)"
        variant="outline-primary"
        size="sm"
        :disabled="isBusyNft(data.item.nft.token_id)"
        @click.stop="accept(data.item)"
        >Accept
      </b-btn>
    </template>
  </b-table>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import CoinPriceInline from '../elements/CoinPriceInline'
import OwnerAddress from '../elements/OwnerAddress'
import DateTime from '../elements/DateTime'

export default {
  name: 'FormItemOffersList',
  components: { DateTime, OwnerAddress, CoinPriceInline },
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
      { key: 'price', label: 'Offer', sortable: true },
      { key: 'buyer', sortable: true },
      { key: 'created_at', label: 'Date', sortable: true },
      { key: 'actions', label: '', class: 'offer-actions ' },
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
    isMyOffer(offer) {
      return offer.buyer && offer.buyer === this.buyer
    },
    isMyNft(offer) {
      return offer.nft && offer.nft.owner_address === this.buyer
    },
    accept(offer) {
      this.$emit('accept', { offerId: offer.offer_id })
    },
    cancel(offer) {
      this.$emit('cancel', { offerId: offer.offer_id })
    },
  },
}
</script>

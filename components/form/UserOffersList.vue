<template>
  <b-table v-if="items.length" borderless sort-icon-left :items="items" :fields="fields" class="offers-list">
    <template v-slot:cell(token_id)="data">
      <token-small :token-id="data.value"></token-small>
    </template>
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
<!--        <b-spinner v-if="isBusyNft(data.item.nft.token_id)" type="grow" small />-->
      </b-btn>
      <b-btn
        v-else-if="isMyNft(data.item)"
        variant="outline-primary"
        size="sm"
        :disabled="isBusyNft(data.item.nft.token_id)"
        @click.stop="accept(data.item)"
        >Accept
<!--        <b-spinner v-if="isBusyNft(data.item.nft.token_id)" type="grow" small />-->
      </b-btn>
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
  name: 'FormUserOffersList',
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
      this.$emit('accept', { tokenId: offer.nft.token_id, offerId: offer.offer_id })
    },
    cancel(offer) {
      this.$emit('cancel', { tokenId: offer.nft.token_id, offerId: offer.offer_id })
    },
    sortByTokenId(aRow, bRow) {
      return aRow.nft.token_id.compare(bRow.nft.token_id)
    },
  },
}
</script>

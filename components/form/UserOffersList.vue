<template>
  <b-table v-if="items.length" class="offers-list" borderless :items="items" :fields="fields" >
    <template v-slot:cell(token_id)="data">
      {{ data.item.nft.token_id }}
    </template>
    <template v-slot:cell(price)="data">
      <coin-price-inline :price="data.item.price" />
<!--      <div class="d-flex justify-content-start align-items-center">-->
<!--        <b-img :src="currencyImage" rounded="circle" width="31px" height="31px" />-->
<!--        <h6 class="ml-2 my-0">-->
<!--          <b>{{ data.item.price.value }}</b> {{ data.item.price.currency }}-->
<!--        </h6>-->
<!--      </div>-->
    </template>
    <template v-slot:cell(buyer)="data">
      <div class="d-flex justify-content-start align-items-center">
      <client-only>
        <jazzicon :address="data.item.buyer" :diameter="31" />
      </client-only>
      <b-link :to="localePath({ name: 'market', query: { owner: data.item.buyer } })" class="ml-2">
        {{ data.item.buyer | collapse(10, 5) }}
      </b-link>
      </div>
    </template>
    <template v-slot:cell(created_at)="data">
      {{ data.item.created_at | mToDate }}
    </template>
    <template v-slot:cell(actions)="data">
         <b-btn v-if="isMyOffer(data.item)" variant="outline-secondary" size="sm" :disabled="busy" @click.stop="cancel(data.item)">Cancel</b-btn>
         <b-btn v-else-if="isMyNft(data.item)" variant="outline-primary" size="sm" :disabled="busy" @click.stop="accept(data.item)">Accept</b-btn>
    </template>
  </b-table>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import Jazzicon from '../Jazzicon'
import CoinPriceInline from '../elements/CoinPriceInline'

export default {
  name: 'FormUserOffersList',
  components: { CoinPriceInline, Jazzicon },
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
    price: '1',
    fields: [
      { key: 'token_id', label: 'Token', sortable: true },
      { key: 'price', label: 'Offer', sortable: false },
      { key: 'buyer', sortable: false },
      { key: 'created_at', label: 'Date', sortable: false },
      { key: 'actions', label: '', class: 'offer-actions ' },
    ],
  }),
  computed: {
    ...mapGetters('user', ['currentUser']),
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

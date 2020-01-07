<template>
  <b-container>
    <b-row>
      <b-col>
        <b-tabs v-model="tabIndex" pills content-class="mt-3">
          <b-tab title="Income offers" @click="loadIncomeOffers">
            <form-user-offers-list v-if="incomeOffers.length" :items="incomeOffers" :busy="incomeOffersBusy" @cancel="onCancelOffer" @accept="onAcceptOffer"/>
            <b-card v-else body-class="text-center">
              <strong>There are no income offers yet...</strong>
            </b-card>
          </b-tab>
          <b-tab title="My offers" @click="loadMyOffers">
            <form-user-offers-list v-if="myOffers.length" :items="myOffers" :busy="myOffersBusy" @cancel="onCancelOffer" @accept="onAcceptOffer"/>
            <b-card v-else body-class="text-center">
              <strong>There are no your offers yet...</strong>
            </b-card>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ACTION_OFFER_ACCEPT, ACTION_OFFER_CANCEL, ACTION_SUCCESS } from '~/helpers/action-types'
import { prepOffer } from '~/helpers'
import FormUserOffersList from '~/components/form/UserOffersList'

export default {
  name: 'TabMyOffers',
  components: {
    FormUserOffersList,
  },
  data: () => ({
    tabIndex: 0,
    myOffers: [],
    myOffersBusy: false,
    incomeOffers: [],
    incomeOffersBusy: false,
  }),
  computed: {
    ...mapState({
      currentAddress: state => state.user.currentAddress,
    }),
    ...mapGetters('user', ['currentUser']),

    // offers() {
    //   const o = this.findOffers(this.$route.params.item)
    //   return o ? o.offers : []
    // },
    // bids() {
    //   const o = this.findBids(this.$route.params.item)
    //   return o ? o.bids : []
    // },
  },
  watch: {
    currentAddress(address) {
      if (address) {
        this.loadMyOffers()
        this.loadIncomeOffers()
      }
    },
  },
  mounted() {
    this.loadMyOffers()
    this.loadIncomeOffers()
    this.$root.$on(ACTION_SUCCESS, this.onActionCompleted)
  },
  beforeDestroy() {
    this.$root.$off(ACTION_SUCCESS)
  },
  methods: {
    ...mapActions('market', ['queryOffer', 'queryNft']),
    onActionCompleted({ action, tokenId }) {
      console.log(action, tokenId)
      switch (action) {
        case ACTION_OFFER_ACCEPT:
          this.loadIncomeOffers()
          break
        case ACTION_OFFER_CANCEL:
          this.loadMyOffers()
          break
        default:
      }
    },
    loadMyOffers() {
      if (this.myOffersBusy) return
      this.myOffersBusy = true
      this.queryOffer({ params: { buyer: this.currentAddress } }).then(offers => {
        this.myOffers = offers.map(prepOffer)
        this.myOffersBusy = false
      })
    },
    loadIncomeOffers() {
      if (this.incomeOffersBusy) return
      this.incomeOffersBusy = true
      this.queryOffer({ params: { owner: this.currentAddress } }).then(offers => {
        this.incomeOffers = offers.map(prepOffer)
        this.incomeOffersBusy = false
      })
    },
    onCancelOffer({ tokenId, offerId }) {
      this.$root.$emit(ACTION_OFFER_CANCEL, { id: tokenId, offerId, user: this.currentUser })
    },
    onAcceptOffer({ tokenId, offerId }) {
      this.$root.$emit(ACTION_OFFER_ACCEPT, { id: tokenId, offerId, user: this.currentUser })
    },
  },
}
</script>

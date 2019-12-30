<template>
  <section v-if="currentUser" class="user">
    <b-container>
      <b-row>
        <b-col>
          <b-tabs v-model="tabIndex" pills content-class="mt-3">
            <b-tab title="Income offers" @click="loadIncomeOffers">
              <form-user-offers-list v-if="incomeOffers.length" :items="incomeOffers" :busy="incomeOffersBusy" />
              <b-card v-else class="mb-3 p-2 text-center">
                <strong>No offers yet...</strong>
              </b-card>
            </b-tab>
            <b-tab title="My offers" @click="loadMyOffers">
              <form-user-offers-list v-if="myOffers.length" :items="myOffers" :busy="myOffersBusy" />
              <!--                @cancel="onCancelOffer"-->
              <!--                @accept="onAcceptOffer"-->
              <b-card v-else class="mb-3 p-2 text-center">
                <strong>No offers yet...</strong>
              </b-card>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { prepOffer } from '~/helpers'
import FormUserOffersList from '~/components/form/UserOffersList'

export default {
  name: 'PageMyOffers',
  components: {
    FormUserOffersList,
  },
  props: {
    roomId: {
      type: String,
      default: null,
    },
    messages: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    tabIndex: 0,
    myOffers: [],
    myOffersBusy: false,
    incomeOffers: [],
    incomeOffersBusy: false,
    items: [
      { date: '2019-09-01', user: 'user1', price: '10token' },
      { date: '2019-09-02', user: 'user2', price: '20token' },
      { date: '2019-09-03', user: 'user3', price: '30token' },
      { date: '2019-09-04', user: 'user4', price: '40token' },
      { date: '2019-09-05', user: 'user5', price: '50token' },
    ],
  }),
  computed: {
    ...mapState({}),
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
  mounted() {
    this.loadMyOffers()
    this.loadIncomeOffers()
  },
  methods: {
    ...mapActions('market', ['queryOffer', 'queryNftMeta', 'queryNft']),
    loadMyOffers(evt) {
      this.myOffersBusy = true
      this.queryOffer({ params: { owner: this.currentUser.address } }).then(offers => {
        this.incomeOffers = offers.map(prepOffer)
        this.myOffersBusy = false
      })
    },
    loadIncomeOffers(evt) {
      this.incomeOffersBusy = true
      this.queryOffer({ params: { owner: this.currentUser.address } }).then(offers => {
        this.incomeOffers = offers.map(prepOffer)
        this.incomeOffersBusy = false
      })
    },
  },
}
</script>

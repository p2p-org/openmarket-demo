<template>
  <b-container>
    <b-row>
      <b-col>
        <b-tabs v-model="tabIndex" pills content-class="mt-3">
          <b-tab title="My bids" @click="loadMyBids">
            <form-user-bids-list v-if="myBids.length" :items="myBids" :busy="myBidsBusy" />
            <b-card v-else body-class="text-center">
              <strong>There are no your bids yet...</strong>
            </b-card>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { prepBid } from '~/helpers'
import FormUserBidsList from '~/components/form/UserBidsList'

export default {
  name: 'TabMyBids',
  components: {
    FormUserBidsList,
  },
  data: () => ({
    tabIndex: 0,
    myBids: [],
    myBidsBusy: false,
  }),
  computed: {
    ...mapState({
      currentAddress: state => state.user.currentAddress,
    }),
    ...mapGetters('user', ['currentUser']),
  },
  watch: {
    currentAddress(address) {
      if (address) {
        this.loadMyBids()
      }
    },
  },
  mounted() {
    this.loadMyBids()
  },
  beforeDestroy() {
  },
  methods: {
    ...mapActions('market', ['queryBid', 'queryNft']),
    loadMyBids() {
      if (this.myBidsBusy) return
      this.myBidsBusy = true
      this.queryBid({ params: { bidder: this.currentAddress } }).then(bids => {
        this.myBids = bids.map(prepBid)
        this.myBidsBusy = false
      })
    },
  },
}
</script>

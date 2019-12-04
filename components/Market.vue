<template>
  <div><slot /></div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Market',
  data() {
    return {
      txWait: 2000, // approx. time needed to mine and index tx
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    // user() {
    //   return this.currentUser ? this.currentUser.address : null
    // },
  },
  mounted() {
    this.$root.$on('marketSellFixed', this.doSellFixed)
    this.$root.$on('marketBuyFixed', this.doBuyFixed)
    this.$root.$on('marketCancelFixed', this.doCancelFixed)
    this.$root.$on('marketMakeOffer', this.doMakeOffer)
    this.$root.$on('marketAcceptOffer', this.doAcceptOffer)
    this.$root.$on('marketCancelOffer', this.doCancelOffer)
    this.$root.$on('marketPlaceBid', this.doPlaceBid)
    this.$root.$on('marketBuyout', this.doBuyout)
    this.$root.$on('marketStartAuction', this.doStartAuction)
    this.$root.$on('marketFinishAuction', this.doFinishAuction)
    this.$root.$on('marketCancelAuction', this.doCancelAuction)
    this.$root.$on('marketTransfer', this.doTransfer)
    this.$root.$on('marketBurn', this.doBurn)
  },
  methods: {
    ...mapActions('market', [
      'queryNft',
      'queryOffer',
      'queryBid',
      'nftSellFixed',
      'nftCancelFixed',
      'nftBuyFixed',
      'nftTransfer',
      'nftPlaceBid',
      'nftBuyout',
      'nftStartAuction',
      'nftFinishAuction',
      'nftBurn',
      'nftCancelAuction',
      'nftMakeOffer',
      'nftAcceptOffer',
      'nftCancelOffer',
      'nftCheckBusy',
      'nftBusyLock',
      'nftBusyUnlock',
      'waitMarket',
      'clearNft',
    ]),
    ...mapActions('user', ['loadCurrentUserInfo']),
    loadNft(tokenId = null) {
      return this.queryNft({ force: true, params: { tokenId } })
        .then(() => this.queryOffer({ params: { tokenId } }))
        .then(() => this.queryBid({ params: { tokenId } }))
    },
    doSellFixed({ price, id, user }) {
      this.userAction(
        'sellFixed',
        id,
        'Confirm sell?',
        'NFT listed for Fixed Price',
        () =>
          this.nftSellFixed({
            user,
            token: {
              id,
              price,
            },
          }),
        () => this.loadNft(id)
      )
    },
    doBuyFixed({ id, user }) {
      this.userAction(
        'buyFixed',
        id,
        'Confirm buy?',
        'Yep, you bought it!',
        () =>
          this.nftBuyFixed({
            user,
            token: {
              id,
            },
          }),
        () => this.loadCurrentUserInfo().then(() => this.loadNft(id))
      )
    },
    doCancelFixed({ id, user }) {
      this.userAction(
        'cancelFixed',
        id,
        'Confirm cancel sell?',
        'NFT unlisted',
        () =>
          this.nftCancelFixed({
            user,
            token: {
              id,
            },
          }),
        () => this.loadNft(id)
      )
    },
    doMakeOffer({ id, price, user }) {
      this.userAction(
        'makeOffer',
        id,
        'Confirm make offer?',
        'Offer committed!',
        () =>
          this.nftMakeOffer({
            user,
            token: {
              id,
              price,
            },
          }),
        () => this.loadNft(id)
      )
    },
    doAcceptOffer({ id, offerId, user }) {
      this.userAction(
        'acceptOffer',
        id,
        'Confirm accept offer?',
        'You accepted the offer, item sold!',
        () =>
          this.nftAcceptOffer({
            user,
            token: {
              id,
              offerId,
            },
          }),
        () => this.loadCurrentUserInfo().then(() => this.loadNft(id))
      )
    },
    doCancelOffer({ id, offerId, user }) {
      this.userAction(
        'cancelOffer',
        id,
        'Confirm cancel offer?',
        'Offer removed!',
        () =>
          this.nftCancelOffer({
            user,
            token: {
              id,
              offerId,
            },
          }),
        () => this.loadNft(id)
      )
    },
    doStartAuction({ id, price, user, buyout, ends }) {
      this.userAction(
        'startAuction',
        id,
        'Confirm start auction?',
        'Auction for item started!',
        () =>
          this.nftStartAuction({
            user,
            token: {
              id,
              price,
              buyout,
              ends,
            },
          }),
        () => this.loadNft(id)
      )
    },
    doPlaceBid({ id, price, user }) {
      this.userAction(
        'placeBid',
        id,
        'Confirm bid placing?',
        'Your bid placed',
        () =>
          this.nftPlaceBid({
            user,
            token: {
              id,
              price,
            },
          }),
        () => this.loadNft(id)
      )
    },
    doBuyout({ id, user }) {
      this.userAction(
        'buyout',
        id,
        'Confirm item buyout?',
        'Yep, you bought it!',
        () =>
          this.nftBuyout({
            user,
            token: {
              id,
            },
          }),
        () => this.loadCurrentUserInfo().then(() => this.loadNft(id))
      )
    },
    doCancelAuction({ id, user }) {
      this.userAction(
        'cancelAuction',
        id,
        'Confirm cancel auction?',
        'NFT unlisted from auction',
        () =>
          this.nftCancelAuction({
            user,
            token: {
              id,
            },
          }),
        () => this.loadNft(id)
      )
    },
    doFinishAuction({ id, user }) {
      this.userAction(
        'finishAuction',
        id,
        'Confirm auction finishing?',
        'Auction finished!',
        () =>
          this.nftFinishAuction({
            user,
            token: {
              id,
            },
          }),
        () => this.loadCurrentUserInfo().then(() => this.loadNft(id))
      )
    },
    doTransfer({ id, recipient, user }) {
      this.userAction(
        'transfer',
        id,
        'Confirm transfer?',
        'NFT Transfered',
        () =>
          this.nftTransfer({
            user,
            recipient,
            token: {
              id,
            },
          }),
        () => this.loadNft(id)
      )
    },
    doBurn({ id, user }) {
      this.userAction(
        'burn',
        id,
        'Confirm NFT burning?',
        'NFT eliminated!',
        () =>
          this.nftBurn({
            user,
            token: {
              id,
            },
          }),
        () => this.clearNft(id)
      )
    },
    handleOk(tokenId, msg, r) {
      this.$bvModal.msgBoxOk(msg, { title: 'Great', okVariant: 'success' })
      this.$root.$emit('userActionOk', { tokenId })
    },
    handleErr(tokenId, e) {
      console.log('action fail', tokenId, e)
      if (e && e.message) {
        this.$bvModal.msgBoxOk(e.message, { title: 'Error', okVariant: 'danger' })
      }
      this.$root.$emit('userActionFail', { tokenId })
    },
    checkUser() {
      if (!this.currentUser) {
        this.$bvModal.msgBoxOk('Please login to continue', { title: 'Auth required', okVariant: 'warning' })
        return Promise.reject()
      }
      return Promise.resolve()
    },
    userAction(action, id, msgAction, msgSuccess, fAction, fSuccess = () => {}) {
      return this.checkUser()
        .then(() => this.nftBusyLock({ tokenId: id }))
        .then(() => this.$bvModal.msgBoxConfirm(msgAction))
        .then(confirm => {
          if (confirm) {
            console.log('action', action, id)
            return fAction()
              .then(res => this.waitMarket({ hash: res.result.txhash }))
              .then(tx => {
                console.log('tx mined', tx)
                return fSuccess()
              })
              .then(() => this.handleOk(id, msgSuccess))
              .catch(err => this.handleErr(id, err))
          } else {
            return Promise.resolve()
          }
        })
        .catch(e => {
          // just silence
        })
        .then(() => this.nftBusyUnlock({ tokenId: id }))
    },
  },
}
</script>

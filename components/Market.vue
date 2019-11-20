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
    this.$root.$on('marketCancelAuction', this.doCancelAuction)
    this.$root.$on('marketTransfer', this.doTransfer)
  },
  methods: {
    ...mapActions('market', [
      'queryNft',
      'queryOffer',
      'nftSellFixed',
      'nftCancelFixed',
      'nftBuyFixed',
      'nftTransfer',
      'nftPlaceBid',
      'nftCancelAuction',
      'nftMakeOffer',
      'nftAcceptOffer',
      'nftCancelOffer',
      'nftCheckBusy',
      'nftBusyLock',
      'nftBusyUnlock',
      'waitMarket',
    ]),
    ...mapActions('user', ['loadCurrentUserInfo']),

    doSellFixed({ price, id, user }) {
      this.userAction('sellFixed', id, 'Confirm sell?', 'NFT listed for Fixed Price', () =>
        this.nftSellFixed({
          user,
          token: {
            id,
            price,
          },
        })
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
        () => this.loadCurrentUserInfo()
      )
    },
    doCancelFixed({ id, user }) {
      this.userAction('cancelFixed', id, 'Confirm cancel sell?', 'NFT unlisted', () =>
        this.nftCancelFixed({
          user,
          token: {
            id,
          },
        })
      )
    },
    doMakeOffer({ id, price, user }) {
      this.userAction('makeOffer', id, 'Confirm make offer?', 'Offer committed!', () =>
        this.nftMakeOffer({
          user,
          token: {
            id,
            price,
          },
        })
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
        () => this.loadCurrentUserInfo()
      )
    },
    doCancelOffer({ id, offerId, user }) {
      this.userAction('cancelOffer', id, 'Confirm cancel offer?', 'Offer removed!', () =>
        this.nftCancelOffer({
          user,
          token: {
            id,
            offerId,
          },
        })
      )
    },
    doPlaceBid({ id, price, user }) {
      this.userAction('placeBid', id, 'Confirm bid placing?', 'Your bid placed', () =>
        this.nftPlaceBid({
          user,
          token: {
            id,
            price,
          },
        })
      )
    },
    doCancelAuction({ id, user }) {
      this.userAction('cancelAuction', id, 'Confirm cancel auction?', 'NFT unlisted from auction', () =>
        this.nftCancelAuction({
          user,
          token: {
            id,
          },
        })
      )
    },
    doTransfer({ id, recipient, user }) {
      this.userAction('transfer', id, 'Confirm transfer?', 'NFT Transfered', () =>
        this.nftTransfer({
          user,
          recipient,
          token: {
            id,
          },
        })
      )
    },
    handleOk(tokenId, msg, r) {
      return this.waitMarket({ hash: r.result.txhash }).then(tx => {
        console.log('tx mined', tx)
        this.$bvModal.msgBoxOk(msg, { title: 'Great', okVariant: 'success' })
        this.$root.$emit('userActionOk', { tokenId })
        return this.queryNft({ force: true, params: { tokenId } })
          .then(() => this.queryOffer({ params: { tokenId } }))
          .then(() => this.nftBusyUnlock({ tokenId }))
      })
    },
    handleErr(tokenId, e) {
      this.$bvModal.msgBoxOk(e.message, { title: 'Error', okVariant: 'danger' })
      this.$root.$emit('userActionFail', { tokenId })
      return this.nftBusyUnlock({ tokenId })
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
        .then(() => {
          console.log(action, id)
          this.$bvModal.msgBoxConfirm(msgAction).then(value => {
            if (value) {
              return fAction()
                .then(res => this.handleOk(id, msgSuccess, res))
                .then(() => fSuccess())
                .catch(err => this.handleErr(id, err))
            } else {
              return this.nftBusyUnlock({ tokenId: id })
            }
          })
        })
        .catch(e => {
          // just silence
        })
    },
  },
}
</script>

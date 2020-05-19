<template>
  <main class="market">
    <slot />
  </main>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import {
  ACTION_AUCTION_BID,
  ACTION_AUCTION_BUYOUT,
  ACTION_AUCTION_CANCEL,
  ACTION_AUCTION_FINISH,
  ACTION_AUCTION_START,
  ACTION_FAIL,
  ACTION_FIXED_BUY,
  ACTION_FIXED_CANCEL,
  ACTION_FIXED_SELL,
  ACTION_OFFER_ACCEPT,
  ACTION_OFFER_CANCEL,
  ACTION_OFFER_MAKE,
  ACTION_SUCCESS,
  ACTION_TOKEN_BURN,
  ACTION_TOKEN_TRNSFER,
} from '~/helpers/action-types'

export default {
  name: 'MarketWrapper',
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
    this.$root.$on(ACTION_FIXED_SELL, this.doSellFixed)
    this.$root.$on(ACTION_FIXED_BUY, this.doBuyFixed)
    this.$root.$on(ACTION_FIXED_CANCEL, this.doCancelFixed)
    this.$root.$on(ACTION_OFFER_MAKE, this.doMakeOffer)
    this.$root.$on(ACTION_OFFER_ACCEPT, this.doAcceptOffer)
    this.$root.$on(ACTION_OFFER_CANCEL, this.doCancelOffer)
    this.$root.$on(ACTION_AUCTION_BID, this.doPlaceBid)
    this.$root.$on(ACTION_AUCTION_BUYOUT, this.doBuyout)
    this.$root.$on(ACTION_AUCTION_START, this.doStartAuction)
    this.$root.$on(ACTION_AUCTION_FINISH, this.doFinishAuction)
    this.$root.$on(ACTION_AUCTION_CANCEL, this.doCancelAuction)
    this.$root.$on(ACTION_TOKEN_TRNSFER, this.doTransfer)
    this.$root.$on(ACTION_TOKEN_BURN, this.doBurn)
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
      'coinTransfer'
    ]),
    ...mapActions('user', ['loadCurrentUserInfo']),
    loadNft(tokenId = null) {
      return this.queryNft({ force: true, params: { tokenId } })
        .then(() => this.queryOffer({ params: { tokenId } }))
        .then(() => this.queryBid({ params: { tokenId } }))
    },
    doSellFixed({ price, id, user }) {
      this.userAction(
        ACTION_FIXED_SELL,
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
        ACTION_FIXED_BUY,
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
        ACTION_FIXED_CANCEL,
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
        ACTION_OFFER_MAKE,
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
        ACTION_OFFER_ACCEPT,
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
        ACTION_OFFER_CANCEL,
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
        ACTION_AUCTION_START,
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
        ACTION_AUCTION_BID,
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
        ACTION_AUCTION_BUYOUT,
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
        ACTION_AUCTION_CANCEL,
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
        ACTION_AUCTION_FINISH,
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
    doTransfer({ nft, recipient, user, path = null }) {
      this.userAction(
        ACTION_TOKEN_TRNSFER,
        nft.token_id,
        'Confirm transfer?',
        'NFT Transfered',
        () =>
          this.nftTransfer({
            user,
            recipient,
            path,
            nft,
          }),
        () => this.loadNft(nft.token_id)
      )
    },
    doCoinTransfer({ coin, recipient, user }) {
      this.userAction(
        'coinTransfer',
        null,
        'Confirm coin transfer?',
        'Coin transfered',
        () =>
          this.coinTransfer({
            user,
            recipient,
            coin,
          }),
        () => this.loadCurrentUserInfo()
      )
    },
    doBurn({ id, user }) {
      this.userAction(
        ACTION_TOKEN_BURN,
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
    handleOk(action, tokenId, msg, r) {
      console.log('action ok', action, tokenId, r)
      this.$bvModal.msgBoxOk(msg, { title: 'Great', okVariant: 'success' })
      this.$root.$emit(ACTION_SUCCESS, { action, tokenId })
    },
    handleErr(action, tokenId, e) {
      console.log('action fail', action, tokenId, e)
      if (e && e.message) {
        this.$bvModal.msgBoxOk(e.message, { title: 'Error', okVariant: 'danger' })
      }
      this.$root.$emit(ACTION_FAIL, { action, tokenId })
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
              .then(res => this.waitMarket({ hash: res.txhash }))
              .then(tx => {
                console.log('tx mined', tx)
                return fSuccess()
              })
              .then(() => this.handleOk(action, id, msgSuccess))
              .catch(err => this.handleErr(action, id, err))
              .then(() => this.nftBusyUnlock({ tokenId: id }))
          } else {
            return this.nftBusyUnlock({ tokenId: id })
          }
        })
        .catch(e => {
          // just silence
        })

    },
  },
}
</script>

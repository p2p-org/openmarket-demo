import { MARKET_ALL_NFT, MARKET_DEL_NFT, MARKET_ITEM_BIDS, MARKET_ITEM_OFFERS } from '../mutation-types'
import { txCheck } from '../../helpers'

function tokenId(tokenId) {
  return parseInt(tokenId.substring(6))
}

// function metaProp(meta, trait) {
//   return {
//     ...meta.properties.find(p => p.trait === trait),
//     options: meta.definitions[trait] || null
//   }
// },

export function getAllNft({ state, commit, rootState }, { force = false } = {}) {
  return this.$marketApi
    .getAllNft()
    .then(nfts => {
      return Promise.all(nfts.map(nft => this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id)))).then(metas =>
        nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] }))
      )
    })
    .then(nfts => {
      commit(MARKET_ALL_NFT, { nfts })
    })
}

export function queryNft({ state, commit, rootState }, { force = false, params = {} } = {}) {
  // const nft = state.nfts.find(n => n.token_id === params.tokenId)
  // if (!nft || (state.nfts.length && !force)) return Promise.resolve()
  if (state.nfts.length && !force) return Promise.resolve()
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getNfts(params)
      .then(nfts => {
        return Promise.all(nfts.map(nft => this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id)))).then(metas =>
          nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] }))
        )
      })
      .then(nfts => {
        console.debug('nfts', nfts)
        commit(MARKET_ALL_NFT, { nfts })
        resolve()
      })
      .catch(reject)
  })
}
export function clearNft({ commit }, tokenId) {
  commit(MARKET_DEL_NFT, tokenId)
}

export function queryOffer({ state, commit, rootState }, { params = {} } = {}) {
  // readonly tokenId?: string
  // readonly owner?: string
  // readonly buyer?: string
  // readonly limit?: number
  // readonly offset?: number
  // readonly orderPrice?: SortOrder
  // readonly minPrice?: string
  // readonly maxPrice?: string
  const { tokenId } = params
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getNftOffers(params)
      .then(offers => {
        console.debug('nft offers', offers)
        commit(MARKET_ITEM_OFFERS, { tokenId, offers })
        resolve()
      })
      .catch(reject)
  })
}

export function queryBid({ state, commit, rootState }, { params = {} } = {}) {
  // readonly tokenId?: string
  // readonly owner?: string
  // readonly bidder?: string
  // readonly limit?: number
  // readonly offset?: number
  // readonly orderPrice?: SortOrder
  // readonly minPrice?: string
  // readonly maxPrice?: string
  const { tokenId } = params
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getNftBids(params)
      .then(bids => {
        console.debug('nft bids', bids)
        commit(MARKET_ITEM_BIDS, { tokenId, bids })
        resolve()
      })
      .catch(reject)
  })
}

export function queryUser({ commit, state, getters }, { address }) {
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getUser({ address })
      .then(users => {
        if (users.length) {
          resolve(users.pop())
        }
        reject()
      })
      .catch(reject)
  })
}

export function getOneNft({ state, commit, rootState }, { force = false, id = null, mock = false } = {}) {
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getOneNft(id)
      .then(r => {
        // commit(MARKET_ALL_NFT, r)
        resolve(r)
      })
      .catch(reject)
  })
}

export function nftMint({ state, commit, rootGetters, rootState }, { user, token } = {}) {
  const svcUser = rootGetters['user/serviceUser']
  return this.$txApi.getAccounts(svcUser.address).then(data => {
    // console.log(this.$txApi.getECPairPriv(user.mnemonic))
    const signMsg = this.$txMsgs.NewMessageMintNFT({
      sender: svcUser.address,
      recipient: user.address,
      token_id: token.id,
      denom: rootState.config.denomNft,
      token_uri: token.uri || '',

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    // console.log('sign msg', signMsg)
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(svcUser.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftSellFixed({ state, commit, rootState }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    console.log('user', data)
    const signMsg = this.$txMsgs.NewMessagePutNFTOnMarket({
      owner: user.address,
      beneficiary: rootState.config.beneficiary.seller.address,
      token_id: token.id,
      price: {
        denom: rootState.config.denomToken,
        amount: token.price,
      },

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftMakeOffer({ state, commit, rootState }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    console.log('user', data)
    const signMsg = this.$txMsgs.NewMsgMakeOffer({
      buyer: user.address,
      beneficiary: rootState.config.beneficiary.seller.address,
      beneficiary_commission: rootState.config.beneficiary_commission,

      token_id: token.id,
      price: {
        denom: rootState.config.denomToken,
        amount: token.price,
      },

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftAcceptOffer({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    console.log('user', data)
    const signMsg = this.$txMsgs.NewMsgAcceptOffer({
      seller: user.address,
      beneficiary: rootState.config.beneficiary.seller.address,
      beneficiary_commission: rootState.config.beneficiary_commission,

      token_id: token.id,
      offer_id: token.offerId,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftCancelOffer({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    console.log('user', data)
    const signMsg = this.$txMsgs.NewMsgRemoveOffer({
      buyer: user.address,
      token_id: token.id,
      offer_id: token.offerId,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftBuyFixed({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgBuyNFT({
      token_id: token.id,
      buyer: user.address,
      beneficiary: rootState.config.beneficiary.buyer.address,
      beneficiary_commission: rootState.config.beneficiary_commission,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftCancelFixed({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgRemoveNFTFromMarket({
      owner: user.address,
      token_id: token.id,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftStartAuction({ state, commit, rootState }, { user, token } = {}) {
  console.log(token)
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgPutNFTOnAuction({
      owner: user.address,
      beneficiary: rootState.config.beneficiary.seller.address,
      token_id: token.id,
      price: {
        denom: rootState.config.denomToken,
        amount: token.price,
      },
      buyout: {
        denom: rootState.config.denomToken,
        amount: token.buyout,
      },
      time_to_sell: token.ends,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftCancelAuction({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgRemoveNFTFromAuction({
      owner: user.address,
      token_id: token.id,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftFinishAuction({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgFinishAuction({
      owner: user.address,
      token_id: token.id,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftPlaceBid({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgMakeBidOnAuction({
      price: {
        denom: rootState.config.denomToken,
        amount: token.price,
      },
      bidder: user.address,
      beneficiary: rootState.config.beneficiary.buyer.address,
      commission: rootState.config.beneficiary_commission,
      token_id: token.id,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftBuyout({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgBuyoutOnAuction({
      buyer: user.address,
      beneficiary: rootState.config.beneficiary.buyer.address,
      commission: rootState.config.beneficiary_commission,
      token_id: token.id,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftTransfer({ state, commit, rootState, rootGetters }, { user, token, recipient } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgTransferNFT({
      sender: user.address,
      token_id: token.id,
      recipient,
      denom: rootState.config.denomNft,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftBurn({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMessageBurnNFT({
      sender: user.address,
      token_id: token.id,
      denom: rootState.config.denomNft,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx, signedTx))
  })
}

export function nftCheckBusy({ state }, { tokenId } = {}) {
  const idx = state.nfts.findIndex(n => n.token_id === tokenId)
  if (idx !== -1 && !state.nfts[idx].busy) {
    return Promise.resolve()
  }
  return Promise.reject()
}

export function nftBusyLock({ state, commit }, { tokenId } = {}) {
  const idx = state.nfts.findIndex(n => n.token_id === tokenId)
  if (idx !== -1 && !state.nfts[idx].busy) {
    commit('nftTriggerBusy', { tokenId, busy: true })
    return Promise.resolve()
  }
  return Promise.reject()
}

export function nftBusyUnlock({ state, commit }, { tokenId } = {}) {
  const idx = state.nfts.findIndex(n => n.token_id === tokenId)
  if (idx !== -1) {
    // && state.nfts[idx].busy
    commit('nftTriggerBusy', { tokenId, busy: false })
    return Promise.resolve()
  }
  return Promise.reject()
}

export function waitMarket({ state, commit, rootState }, { hash = null } = {}) {
  const retryLimit = 5
  const timeOut = 500
  let retryCnt = 0

  return new Promise((resolve, reject) => {
    const getTx = () => {
      this.$marketApi
        .getTxMsgs({ hash })
        .then(tx => {
          if (!tx) {
            if (retryCnt > retryLimit) {
              reject(new Error('tx wait timeout: probably the transaction was failing for some reason'))
            } else {
              retryCnt++
              setTimeout(() => {
                getTx()
              }, timeOut)
            }
          } else {
            resolve(tx)
          }
        })
        .catch(reject)
    }

    setTimeout(() => {
      getTx()
    }, timeOut)
  })
}

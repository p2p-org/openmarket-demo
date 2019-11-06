import { MARKET_ALL_NFT, MARKET_MY_NFT } from '../mutation-types'
import { txCheck } from '../../helpers'

const mock = false
function tokenId(token_id) {
  return parseInt(token_id.substring(6))
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
      // todo token_uri
      return Promise.all(nfts.map(nft => this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id)))).then(metas =>
        nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] }))
      )
    })
    .then(nfts => {
      // console.log('!!!', nfts)
      commit(MARKET_ALL_NFT, { nfts })
    })
}

export function queryNft({ state, commit, rootState }, { force = false, my = false, params = {} } = {}) {
  // const nft = state.nfts.find(n => n.token_id === params.tokenId)
  // if (!nft || (state.nfts.length && !force)) return Promise.resolve()
  if (state.nfts.length && !force) return Promise.resolve()
  // if (mock) {
  //   return Promise.all(state.nfts1.map(nft => this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id))))
  //     .then(metas => state.nfts1.map((nft, idx) => ({ ...nft, meta: metas[idx] })))
  //     .then(nfts => {
  //       console.log('!!!', nfts)
  //       commit(my ? MARKET_MY_NFT : MARKET_ALL_NFT, nfts)
  //     })
  // }
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getNfts(params)
      .then(nfts => {
        // todo token_uri
        return Promise.all(nfts.map(nft => this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id)))).then(metas =>
          nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] }))
        )
      })
      .then(nfts => {
        console.log('!!!', nfts)
        commit(my ? MARKET_MY_NFT : MARKET_ALL_NFT, nfts)
        resolve()
      })
      .catch(reject)
  })
}

// export function queryMyNft({ state, commit, rootState }, params = {}) {
//   return new Promise((resolve, reject) => {
//     this.$marketApi
//       .getNfts(params)
//       .then(nfts => {
//         // todo token_uri
//         return Promise.all(nfts.map(nft => this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id)))).then(metas =>
//           nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] }))
//         )
//       })
//       .then(nfts => {
//         console.log('!!!', nfts)
//         commit(MARKET_ALL_NFT, nfts)
//       })
//       .catch(reject)
//   })
// }

export function queryUser({ commit, state, getters }, { address }) {
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getUser({ address })
      .then(users => {
        // console.log(users)
        if (users.length) {
          resolve(users.pop())
        }
        reject()
      })
      .catch(reject)
  })
}

export function getOneNft({ state, commit, rootState }, { force = false, id = null, mock = false } = {}) {
  // if (mock) {
  //   return Promise.all(state.nfts1.map(nft => this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id))))
  //     .then(metas => state.nfts1.map((nft, idx) => ({ ...nft, meta: metas[idx] })))
  //     .then(nfts => {
  //       console.log('!!!', nfts)
  //       commit(my ? MARKET_MY_NFT : MARKET_ALL_NFT, nfts)
  //     })
  // }

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

export function nftMint({ state, commit, rootState }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    // console.log(this.$txApi.getECPairPriv(user.mnemonic))
    const signMsg = this.$txMsgs.NewMessageMintNFT({
      sender: user.address,
      recipient: user.address,
      token_id: token.id,
      denom: 'denom_basic',
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
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    console.log('signed msg', signedTx)
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx))
  })
}

export function nftSellFixed({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    console.log('user', data)
    const signMsg = this.$txMsgs.NewMessagePutNFTOnMarket({
      owner: user.address,
      beneficiary: rootState.config.beneficiary.seller.address,
      token_id: token.id,
      price: {
        denom: 'token',
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
    console.log('!!!!!', signMsg)
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    console.log(signedTx)
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx))
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
    console.log(signMsg)
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx))
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
    console.log(signMsg)
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx))
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
    console.log(signMsg)
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx))
  })
}

export function nftTransfer({ state, commit, rootState, rootGetters }, { user, token, recipient } = {}) {
  return this.$txApi.getAccounts(user.address).then(data => {
    const signMsg = this.$txMsgs.NewMsgTransferNFT({
      sender: user.address,
      token_id: token.id,
      recipient,
      denom: 'denom_basic',

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    console.log(signMsg)
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then(tx => txCheck(tx))
  })
}

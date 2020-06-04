import dayjs from 'dayjs'
import { marshalPubKey } from '@tendermint/amino-js'
import { bytesToBase64 } from '@tendermint/belt'

// import {
//   BroadcastMode,
//   createAddress,
//   createBroadcastTx,
//   createWalletFromMnemonic,
//   SignMeta,
//   signTx,
//   StdTx,
//   Tx,
//   Wallet,
// } from '@tendermint/sig'
import { parseDenom } from '../../helpers'
import { TOKEN_PREFIX } from '../config'
import {
  MARKET_ALL_NFT,
  MARKET_BUSY_NFT,
  MARKET_DEL_NFT,
  MARKET_ITEM_BIDS,
  MARKET_ITEM_OFFERS,
  MARKET_COINS,
} from '~/helpers/mutation-types'
import { txCheck } from '~/helpers'
function tokenId(tokenId) {
  return parseInt(tokenId.substring(TOKEN_PREFIX.length))
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
    .then((nfts) => {
      return Promise.all(nfts.map((nft) => this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id)))).then((metas) =>
        nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] }))
      )
    })
    .then((nfts) => {
      commit(MARKET_ALL_NFT, nfts)
    })
}
export function queryNftMeta({ rootState }, nft) {
  return this.$axios.$get(rootState.config.tokenBaseUrl + tokenId(nft.token_id))
}

export function queryNft({ state, commit, rootState, dispatch }, { force = false, params = {} } = {}) {
  // const nft = state.nfts.find(n => n.token_id === params.tokenId)
  // if (!nft || (state.nfts.length && !force)) return Promise.resolve()
  if (state.nfts.length && !force) return Promise.resolve()
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getNfts(params)
      .then((nfts) => {
        return Promise.all(nfts.map((nft) => dispatch('queryNftMeta', nft))).then((metas) =>
          nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] }))
        )
      })
      .then((nfts) => {
        console.debug('nfts', nfts)
        commit(MARKET_ALL_NFT, nfts)
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
  const { tokenId = null } = params
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getNftOffers(params)
      .then((offers) => {
        console.debug('nft offers', offers)
        if (tokenId) {
          commit(MARKET_ITEM_OFFERS, { tokenId, offers })
        }
        resolve(offers)
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
  const { tokenId = null } = params
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getNftBids(params)
      .then((bids) => {
        console.debug('nft bids', bids)
        if (tokenId) {
          commit(MARKET_ITEM_BIDS, { tokenId, bids })
        }
        resolve(bids)
      })
      .catch(reject)
  })
}

export function queryUser({ commit, state, getters }, { address }) {
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getUser({ address })
      .then((users) => {
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
      .then((r) => {
        // commit(MARKET_ALL_NFT, r)
        resolve(r)
      })
      .catch(reject)
  })
}

export function nftMint({ state, commit, rootGetters, rootState }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
    // console.log(this.$txApi.getECPairPriv(user.mnemonic))
    const signMsg = this.$txMsgs.NewMessageMintNFT({
      sender: user.address,
      recipient: user.address,
      token_id: token.id,
      denom: rootState.config.baseNftDenom,
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftSellFixed({ state, commit, rootState }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
    console.log('user', data)
    const signMsg = this.$txMsgs.NewMessagePutNFTOnMarket({
      owner: user.address,
      beneficiary: rootState.config.beneficiary.seller.address,
      token_id: token.id,
      price: {
        denom: token.price.denom,
        amount: token.price.amount,
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftMakeOffer({ state, commit, rootState }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
    console.log('user', data)
    const signMsg = this.$txMsgs.NewMsgMakeOffer({
      buyer: user.address,
      beneficiary: rootState.config.beneficiary.seller.address,
      beneficiary_commission: rootState.config.beneficiary_commission,

      token_id: token.id,
      price: {
        denom: token.price.denom,
        amount: token.price.amount,
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftAcceptOffer({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftCancelOffer({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftBuyFixed({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftCancelFixed({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftStartAuction({ state, commit, rootState }, { user, token } = {}) {
  console.log(token)
  return this.$txApi.getAccounts(user.address).then((data) => {
    const signMsg = this.$txMsgs.NewMsgPutNFTOnAuction({
      owner: user.address,
      beneficiary: rootState.config.beneficiary.seller.address,
      token_id: token.id,
      price: {
        denom: token.price.denom,
        amount: token.price.amount,
      },
      buyout: {
        denom: token.buyout.denom,
        amount: token.buyout.amount,
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftCancelAuction({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftFinishAuction({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftPlaceBid({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
    const signMsg = this.$txMsgs.NewMsgMakeBidOnAuction({
      price: {
        denom: token.price.denom,
        amount: token.price.amount,
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftBuyout({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
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
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export async function nftTransfer({ state, commit, rootState, rootGetters }, { user, nft, recipient, path } = {}) {
  const resp = await Promise.all([this.$txApi.getAccounts(user.address), this.$txApiDst.getAccounts(user.address)])
  const destHeight = resp[1].height
  const ibcPath = rootGetters[`config/ibcPath`]
  console.log('!!!', nft)
  const fullDenom = parseDenom(nft.denom)
  // return this.$txApi.getAccounts(user.address).then((data) => {
  const signMsg =
    path !== null
      ? this.$txMsgs.NewMsgIBCTransferNFT({
          account_number: resp[0].result.value.account_number,
          chain_id: ibcPath.src.chainId,
          // chain_id: rootState.config.chainId,
          sequence: resp[0].result.value.sequence || '0',

          sender: user.address,
          receiver: recipient,

          denom: fullDenom.channel
            ? `${ibcPath.src.portTxNFT}/${ibcPath.src.channelTxNFT}/${fullDenom.denom}`
            : `${ibcPath.dst.portTxNFT}/${ibcPath.dst.channelTxNFT}/${fullDenom.denom}`,
          // denom: coin.denom,
          id: nft.token_id,
          sourceChannel: fullDenom.channel || ibcPath.src.channelTxNFT,
          destHeight,

          // this part is necessary
          fee: 0,
          gas: '200000',
          memo: '',
        })
      : this.$txMsgs.NewMsgTransferNFT({
          sender: user.address,
          token_id: nft.token_id,
          recipient,
          denom: fullDenom.denom,

          // this part is necessary
          fee: 0,
          gas: '200000',
          memo: '',
          account_number: resp[0].result.value.account_number,
          chain_id: ibcPath.src.chainId,
          // chain_id: rootState.config.chainId,
          sequence: resp[0].result.value.sequence || '0',
        })
  const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
  // console.log(signedTx)
  const tx = await this.$txApi.broadcast(signedTx)
  return await txCheck(tx, signedTx)
  // })
}

export async function coinTransfer({ state, commit, rootState, rootGetters }, { user, coin, recipient, path } = {}) {
  const resp = await Promise.all([this.$txApi.getAccounts(user.address), this.$txApiDst.getAccounts(user.address)])
  const destHeight = resp[1].height
  const ibcPath = rootGetters[`config/ibcPath`]
  const fullDenom = parseDenom(coin.denom)
  // console.log(fullDenom)

  console.log(ibcPath)

  console.log(path, fullDenom.channel, ibcPath.src.channelTx)
  const signMsg =
    path !== null
      ? this.$txMsgs.NewMsgIBCTransferFungibleTokens({
          account_number: resp[0].result.value.account_number,
          chain_id: ibcPath.src.chainId,
          // chain_id: rootState.config.chainId,
          sequence: resp[0].result.value.sequence || '0',
          sender: user.address,
          receiver: recipient,
          denom: fullDenom.channel
            ? `${ibcPath.src.portTx}/${ibcPath.src.channelTx}/${fullDenom.denom}`
            : `${ibcPath.dst.portTx}/${ibcPath.dst.channelTx}/${fullDenom.denom}`,
          // denom: coin.denom,
          amount: coin.amount,
          sourceChannel: fullDenom.channel || ibcPath.src.channelTx,
          destHeight,

          // this part is necessary
          fee: 0,
          gas: '200000',
          memo: '',
        })
      : this.$txMsgs.NewMsgTransferFungibleTokens({
          account_number: resp[0].result.value.account_number,
          chain_id: ibcPath.src.chainId,
          // chain_id: rootState.config.chainId,
          sequence: resp[0].result.value.sequence || '0',

          owner: user.address,
          recipient,
          denom: coin.denom,
          amount: coin.amount,

          // this part is necessary
          fee: 0,
          gas: '200000',
          memo: '',
        })
  console.log('signMsg',signMsg)
  const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
  console.log('signedTx',signedTx)
  const tx = await this.$txApi.broadcast(signedTx)
  return await txCheck(tx, signedTx)
}

export function nftBurn({ state, commit, rootState, rootGetters }, { user, token } = {}) {
  return this.$txApi.getAccounts(user.address).then((data) => {
    const signMsg = this.$txMsgs.NewMessageBurnNFT({
      sender: user.address,
      token_id: token.id,
      denom: rootState.config.baseNftDenom,

      // this part is necessary
      fee: 0,
      gas: '200000',
      memo: '',
      chain_id: rootState.config.chainId,
      account_number: data.result.value.account_number,
      sequence: data.result.value.sequence,
    })
    const signedTx = this.$txApi.sign(signMsg, Buffer.from(user.ecpairPriv))
    return this.$txApi.broadcast(signedTx).then((tx) => txCheck(tx, signedTx))
  })
}

export function nftCheckBusy({ state }, { tokenId } = {}) {
  return state.busy[tokenId] ? Promise.reject() : Promise.resolve()
}

export function nftBusyLock({ state, commit }, { tokenId } = {}) {
  if (!state.busy[tokenId]) {
    console.log('lock', tokenId)
    commit(MARKET_BUSY_NFT, { tokenId, busy: true })
    return Promise.resolve()
  }
  return Promise.reject()
}

export function nftBusyUnlock({ state, commit }, { tokenId } = {}) {
  if (state.busy[tokenId]) {
    console.log('unlock', tokenId)
    commit(MARKET_BUSY_NFT, { tokenId, busy: false })
  }
  return Promise.resolve()
  // return Promise.reject()
}

export function waitMarket({ state, commit, rootState }, { hash = null } = {}) {
  const retryLimit = 10
  const timeOut = 500
  let retryCnt = 0

  return new Promise((resolve, reject) => {
    const getTx = () => {
      this.$marketApi
        .getTxMsgs({ hash })
        .then((tx) => {
          if (!tx) {
            if (retryCnt > retryLimit) {
              reject(new Error('tx wait timeout: probably the transaction was failing for some reason, please refresh the page to check'))
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

export function queryCoins({ rootState, commit }) {
  commit(MARKET_COINS, [rootState.config.baseCoinDenom])
  // console.log('get coins')
  return this.$marketApi.getTokens().then((coins) => {
    console.log('get coins', coins)
    if (coins && coins.length) {
      commit(MARKET_COINS, coins)
    }
  })
}

// function sign(tx, wallet, meta) {
//   const signedTx = signTx(tx, meta, wallet)
//   console.log('123', signedTx)
//   // @ts-ignore
//   // tslint:disable-next-line: no-object-mutation
//   signedTx.signatures = signedTx.signatures.map((s) => ({
//     pub_key: bytesToBase64(marshalPubKey(s.pub_key, false)),
//     signature: s.signature,
//   }))
//   return signedTx
// }

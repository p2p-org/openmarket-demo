import {
  MARKET_ALL_NFT,
  MARKET_BUSY_NFT,
  MARKET_DEL_NFT,
  MARKET_ITEM_BIDS,
  MARKET_ITEM_OFFERS,
  MARKET_COINS,
} from '~/helpers/mutation-types'
import { prepToken, prepOffer, prepBid, prepNft } from '~/helpers'

export default {
  [MARKET_ALL_NFT](state, nfts = []) {
    nfts.forEach(nft => {
      let idx = state.offers.findIndex(n => n.token_id === nft.token_id)
      if (idx !== -1) {
        state.offers.splice(idx, 1, {
          token_id: nft.token_id,
          offers: nft.offers.map(o => prepOffer({ ...o, nft: { token_id: nft.token_id, owner_address: nft.owner.address } })),
        })
      } else {
        state.offers.push({
          token_id: nft.token_id,
          offers: nft.offers.map(o => prepOffer({ ...o, nft: { token_id: nft.token_id, owner_address: nft.owner.address } })),
        })
      }
      idx = state.bids.findIndex(n => n.token_id === nft.token_id)
      if (idx !== -1) {
        state.bids.splice(idx, 1, {
          token_id: nft.token_id,
          bids: nft.bids.map(b => prepBid({ ...b, nft: { token_id: nft.token_id, owner_address: nft.owner.address } })),
        })
      } else {
        state.bids.push({
          token_id: nft.token_id,
          bids: nft.bids.map(b => prepBid({ ...b, nft: { token_id: nft.token_id, owner_address: nft.owner.address } })),
        })
      }
      nft.offer = undefined
      nft.bids = undefined
      idx = state.nfts.findIndex(n => n.token_id === nft.token_id)
      if (idx !== -1) {
        state.nfts.splice(idx, 1, prepNft(nft))
      } else {
        state.nfts.push(prepNft(nft))
      }
    })
    // state.nfts = state.nfts
    //   .filter(n => {
    //     return nfts.findIndex(n1 => n1.token_id === n.token_id) === -1
    //   })
    //   .concat(nfts.map(prepNft))
    //   .sort((a, b) => (a.token_id > b.token_id ? 1 : b.token_id > a.token_id ? -1 : 0))
  },
  [MARKET_DEL_NFT](state, tokenId) {
    console.log('del', tokenId)
    const idx = state.nfts.findIndex(n => n.token_id === tokenId)
    if (idx !== -1) {
      state.nfts.splice(idx, 1)
    }
  },
  [MARKET_ITEM_OFFERS](state, { tokenId, offers = [] }) {
    const idx = state.offers.findIndex(n => n.token_id === tokenId)
    if (idx !== -1) {
      state.offers.splice(idx, 1, { token_id: tokenId, offers: offers.map(prepOffer) })
    } else {
      state.offers.push({ token_id: tokenId, offers: offers.map(prepOffer) })
    }
  },
  [MARKET_ITEM_BIDS](state, { tokenId, bids = [] }) {
    const idx = state.bids.findIndex(n => n.token_id === tokenId)
    if (idx !== -1) {
      state.bids.splice(idx, 1, { token_id: tokenId, bids: bids.map(prepBid) })
    } else {
      state.bids.push({ token_id: tokenId, bids: bids.map(prepBid) })
    }
  },
  [MARKET_BUSY_NFT](state, { tokenId, busy = false }) {
    state.busy = { ...state.busy, [tokenId]: busy }
  },
  [MARKET_COINS](state, coins = []) {
    state.coins = coins
      .map(prepToken)
      .filter(t => !state.coins.includes(t))
      .concat(state.coins)
      .sort()
  },
}

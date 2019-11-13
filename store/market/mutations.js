import dayjs from 'dayjs'
import { MARKET_ALL_NFT, MARKET_BUSY_NFT, MARKET_ITEM_OFFERS, MARKET_MY_NFT } from '../mutation-types'

// todo bignumbers
function priceExt(p) {
  const m = p.match(/([\d.]+)([\w]+)?/i)
  return m ? { value: m[1], currency: m[2] } : { value: p, currency: null }
}

function prepNft(n) {
  return {
    ...n,
    price: n.price ? priceExt(n.price) : { value: 0, currency: null },
    opening_price: n.opening_price ? priceExt(n.opening_price) : { value: 0, currency: null },
    buyout_price: n.buyout_price ? priceExt(n.buyout_price) : { value: 0, currency: null },
    created_at: n.created_at ? dayjs(n.created_at) : null,
    updated_at: n.updated_at ? dayjs(n.updated_at) : null,
    time_to_sell: n.time_to_sell ? dayjs(n.time_to_sell) : null,
    busy: false,
  }
}

function prepOffer(o) {
  return {
    ...o,
    price: o.price ? priceExt(o.price) : { value: 0, currency: null },
    created_at: o.created_at ? dayjs(o.created_at) : null,
    updated_at: o.updated_at ? dayjs(o.updated_at) : null,
  }
}

export default {
  [MARKET_ALL_NFT](state, nfts = []) {
    state.nfts = state.nfts
      .filter(n => {
        return nfts.findIndex(n1 => n1.token_id === n.token_id) === -1
      })
      .concat(nfts.map(prepNft))
      .sort((a, b) => (a.token_id > b.token_id ? 1 : b.token_id > a.token_id ? -1 : 0))
  },
  [MARKET_ITEM_OFFERS](state, { tokenId, offers }) {
    const idx = state.nfts.findIndex(n => n.token_id === tokenId)
    if (idx !== -1) {
      state.nfts.splice(idx, 1, { ...state.nfts[idx], offers: offers.map(prepOffer) })
    }
  },
  nftTriggerBusy(state, { tokenId, busy = false }) {
    const idx = state.nfts.findIndex(n => n.token_id === tokenId)
    if (idx !== -1) {
      state.nfts.splice(idx, 1, { ...state.nfts[idx], busy })
    }
  },
}

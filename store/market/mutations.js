import moment from 'moment'
import { MARKET_ALL_NFT, MARKET_MY_NFT } from '../mutation-types'

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
    created_at: n.created_at ? moment(n.created_at) : null,
    updated_at: n.updated_at ? moment(n.updated_at) : null,
    time_to_sell: n.time_to_sell ? moment(n.time_to_sell) : null,
  }
}
export default {
  [MARKET_ALL_NFT](state, nfts = []) {
    state.nfts = state.nfts
      .filter(n => {
        return nfts.findIndex(n1 => n1.token_id === n.token_id) === -1
      })
      .concat(nfts.map(prepNft))
      .sort((a, b) => (a.token_id > b.token_id ? 1 : a.token_id > b.token_id ? -1 : 0))
  },
  [MARKET_MY_NFT](state, nfts = []) {
    state.myNfts = nfts
    state.myNfts = state.myNfts
      .filter(n => {
        return nfts.findIndex(n1 => n1.token_id === n.token_id) === -1
      })
      .concat(nfts.map(prepNft))
  },
}

import { MARKET_ALL_NFT } from '../mutation-types'

// function prepNft(nft) {
//   const p = parseInt(nft.token_id.substring(6))
//   return {
//     ...nft,
//     token_uri: `/api/token/${p[1]}`,
//   }
// }

//todo config
const tokenBaseUrl = '/api/token/'
export function getAllNft({ state, commit }, { force = false } = {}) {
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getAllNft()
      .then(nfts => {
        // todo token_uri
        return Promise.all(nfts.map(nft => this.$axios.$get(tokenBaseUrl + parseInt(nft.token_id.substring(6)))))
          .then(metas => nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] })))
      })
      .then(nfts => {
        console.log('!!!', nfts)
        commit(MARKET_ALL_NFT, { nfts })
      })
      .catch(reject)
  })
}

// this.$marketApi = undefined

export function queryNft({ state, commit }, params = {}) {
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getNfts(params)
      .then(nfts => {
        // todo token_uri
        return Promise.all(nfts.map(nft => this.$axios.$get(tokenBaseUrl + parseInt(nft.token_id.substring(6)))))
          .then(metas => nfts.map((nft, idx) => ({ ...nft, meta: metas[idx] })))
      })
      .then(nfts => {
        console.log('!!!', nfts)
        commit(MARKET_ALL_NFT, nfts)
      })
      .catch(reject)
  })
}

export function getOneNft({ state, commit }, { force = false, id = null } = {}) {
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

import { MARKET_ALL_NFT } from '../mutation-types'

export function getAllNft({ state, commit }, { force = false } = {}) {
  return new Promise((resolve, reject) => {
    this.$marketApi
      .getAllNft()
      .then(r => {
        commit(MARKET_ALL_NFT, r)
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

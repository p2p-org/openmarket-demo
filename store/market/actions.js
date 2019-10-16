import { MARKET_ALL_NFT, MARKET_MY_NFT } from '../mutation-types'
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

// eslint-disable-next-line camelcase
export function nftMint({ state, commit, rootState }, { user, token } = {}) {
  // curl -XPUT -s http://localhost:1317/marketplace/mint --data-binary '
  // {"base_req":{"from":"'$(mpcli keys show user1 -a)'","chain_id":"mpchain","sequence":"1","account_number":"0"},"token_name":"name","token_id":"'$(uuidgen)'","owner":"user1","name":"user1","password":"12345678","description":"desc","image":"ing","token_uri":"uri"}'
  return new Promise((resolve, reject) => {
    this.$axios
      .$put(rootState.config.lcdUrl + '/marketplace/mint', {
        base_req: { from: user.address, chain_id: rootState.config.chain_id, sequence: user.sequence, account_number: user.account_number },
        token_name: token.name,
        token_id: 'TOKEN_' + token.id,
        owner: user.name,
        name: user.name,
        password: user.password,
        description: token.description,
        image: token.img,
        token_uri: token.url,
      })
      .then(r => {
        console.log(r)
        // commit(MARKET_ALL_NFT, r)
        resolve(r)
      })
      .catch(reject)
  })
}

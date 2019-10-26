import { CONFIG_URLS } from './mutation-types'

export const state = () => ({
  lcdUrl: '/_lcd',
  gqlUrl: '/_gql',
  moniker: 'node0',
  chainId: 'mpchain',
  nodeId: 'e65a518a5bb43acbdfd537234f5dcab48d7a7ba7',
  tokenBaseUrl: '/api/token/',
  rateETH: 123123,
  beneficiary_commission: '0.04',

  urls: {
    // gql: 'http://localhost:3000/_gql',
    // lcd: 'http://localhost:3000/_lcd',
    lcd: '/_lcd',
    gql: '/_gql',
  },
})

export const mutations = {
  [CONFIG_URLS](state, cfg) {
    state.urls = { ...state.urls, ...cfg }
  },
}

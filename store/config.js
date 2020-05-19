import { CONFIG_URLS } from '~/helpers/mutation-types'

export const state = () => ({
  lcdUrl: '/_lcd',
  gqlUrl: '/_gql',
  // moniker: 'node0',
  chainId: process.env.IBC_SRC,
  nodeId: 'e65a518a5bb43acbdfd537234f5dcab48d7a7ba7',
  tokenBaseUrl: '/api/token/',
  hasuraAccessKey: 'q5WNqC6MP6123123',
  rateETH: 1234,
  baseNftDenom: 'denom_basic',
  baseCoinDenom: 'token',
  baseCoinImage: '/images/currency_atom.png',
  stakeCoinDenom: 'stake',
  stakeCoinImage: '/images/currency_stake.png',
  ibc: {
    ibc0: {
      src: {
        lcdUrl: '/_src',
        chainId: 'ibc0',
        channelTx: 'ibconechannel',
        channelTxNFT: 'ibconechannelnft',
        portTx: 'transfer',
        portTxNFT: 'transfernft',
      },
      dst: {
        lcdUrl: '/_dst',
        chainId: 'ibc1',
        channelTx: 'ibczerochannel',
        channelTxNFT: 'ibczerochannelnft',
        portTx: 'transfer',
        portTxNFT: 'transfernft',
      },
    },
    ibc1: {
      src: {
        lcdUrl: '/_src',
        chainId: 'ibc1',
        channelTx: 'ibczerochannel',
        channelTxNFT: 'ibczerochannelnft',
        portTx: 'transfer',
        portTxNFT: 'transfernft',
      },
      dst: {
        lcdUrl: '/_dst',
        chainId: 'ibc0',
        channelTx: 'ibconechannel',
        channelTxNFT: 'ibconechannelnft',
        portTx: 'transfer',
        portTxNFT: 'transfernft',
      },
    },
  },
  coins: {
    token: {
      name: 'TKN',
      image: '/images/currency_atom.png',
      rate: 0.321,
    },
    stake: {
      name: 'STAKE',
      image: '/images/currency_stake.png',
      rate: 0,
    },
    terra: {
      name: 'TRC',
      image: '/images/currency_terra.png',
      rate: 0.123,
    },
    bitcoin: {
      name: 'BTC',
      image: '/images/currency_btc.png',
      rate: 9,
    },
    tugrik: {
      name: 'TGRG',
      image: '/images/currency_tugrik.png',
      rate: 0.01875,
    },
  },
  beneficiary_commission: '0.04',
  beneficiary: {
    seller: {
      address: 'cosmos15ez5r5es7vukue8hqzxpl2ah6h4xqef640fwhp',
      mnemonic:
        'alert slim hard march trust goat coil gossip stay peasant book lottery enable anchor hidden calm churn planet amount concert together topple soft endorse',
    },
    buyer: {
      address: 'cosmos14tpgvfk2fxcqdfcysv3u7knjzryeu3q5f7sqsh',
      mnemonic:
        'onion axis add badge give decline behave cry aim have drop wheat cat annual nerve mobile elite test effort race rebel dragon forget pony',
    },
  },
  mockUsers: [
    {
      name: 'user1',
      mnemonic:
        'hawk above capital clock wage crew now essence typical fish pave pluck garden half isolate swarm pluck subway dignity flight bone capital scrap choose',
    },
    {
      name: 'user2',
      mnemonic:
        'matter learn fall finish reunion result obtain fiscal picture afford arrange dignity air banana ketchup glad option cricket embrace infant album wagon wage razor',
    },
    {
      name: 'user3',
      mnemonic:
        'bachelor crew business silver apology input next price around check banner maximum palace pumpkin select nice oil luggage breeze electric arrange pass example pause',
    },
  ],
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

export const getters = {
  getMockUser(state) {
    return (name) => state.mockUsers.find((x) => x.name === name)
  },

  coinImage(state) {
    return (denom) => {
      return state.coins[denom] ? state.coins[denom].image : state.baseCoinImage
    }
  },
  coinName(state) {
    return (denom) => {
      return state.coins[denom] ? state.coins[denom].name : denom
    }
  },
  coinRate(state) {
    return (denom) => {
      return state.coins[denom] ? state.coins[denom].rate : 0
    }
  },
  ibcPath(state) {
    return state.ibc[state.chainId]
  }
}

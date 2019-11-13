import { CONFIG_URLS } from './mutation-types'

export const state = () => ({
  lcdUrl: '/_lcd',
  gqlUrl: '/_gql',
  moniker: 'node0',
  chainId: 'mpchain',
  nodeId: 'e65a518a5bb43acbdfd537234f5dcab48d7a7ba7',
  tokenBaseUrl: '/api/token/',
  rateETH: 1234,
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
  serviceUser: {
    address: '',
    mnemonic:
      'unfold whale pear cage stand rescue grape sentence fence document fan begin traffic across property sense list dose sock license drink poverty romance bid',
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
      name: 'dgaming',
      mnemonic:
        'unfold whale pear cage stand rescue grape sentence fence document fan begin traffic across property sense list dose sock license drink poverty romance bid',
    },
    // {
    //   name: 'validator1',
    //   mnemonic:
    //     'base figure planet hazard sail easily honey advance tuition grab across unveil random kiss fence connect disagree evil recall latin cause brisk soft lunch',
    // },
    // {
    //   name: 'alice',
    //   mnemonic:
    //     'actor barely wait patrol moral amateur hole clerk misery truly salad wonder artefact orchard grit check abandon drip avoid shaft dirt thought melody drip',
    // },
    // {
    //   name: 'bob',
    //   mnemonic:
    //     'force tone wrist rice ramp inform access idea lend purse verify dial beef right spread forget novel sentence rail script pretty east exchange canoe',
    // },
    // {
    //   name: 'jack',
    //   mnemonic:
    //     'rich decide letter cannon wet sword ill cruise lyrics churn valid shift unknown steel drum gasp ginger fury modify ship vast puppy mountain embark',
    // },
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
    return name => state.mockUsers.find(x => x.name === name)
  },
}

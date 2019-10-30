import { CONFIG_URLS, THEME } from './mutation-types'

const themeKeyName = 'theme'
export const state = () => ({
  theme: 'dark',
  alerts: [],
  access: false,
  users: [
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
  sysUsers: [
    {
      name: 'sellerBeneficiary',
      mnemonic:
        'alert slim hard march trust goat coil gossip stay peasant book lottery enable anchor hidden calm churn planet amount concert together topple soft endorse',
    },
    {
      name: 'buyerBeneficiary',
      mnemonic:
        'onion axis add badge give decline behave cry aim have drop wheat cat annual nerve mobile elite test effort race rebel dragon forget pony',
    },
  ]
})

export const mutations = {
  [THEME](state, theme) {
    state.theme = theme
  },

  setAccess(state, access) {
    state.access = access
  },
}

export const getters = {
  getTheme(state) {
    return state.theme
  },
}

export const actions = {
  // server pre init
  nuxtServerInit({ state, commit, dispatch }, { req, app }) {
    dispatch('setTheme', app.$cookies.get(themeKeyName))

    // if (process.env.GQL_WS_URL) {
    //   commit(`config/${CONFIG_URLS}`, {
    //     gqlWsUrl: process.env.GQL_WS_URL,
    // })
    // }
    // if (process.env.GQL_HTTP_URL) {
    //   commit(`config/${CONFIG_URLS}`, {
    //     gqlHttpUrl: process.env.GQL_HTTP_URL,
    //   })
    // }
  },

  initUsers({ state, dispatch }) {
    // const password = '12345678'
    // state.users.forEach((u, id) => {
    //   dispatch('user/setUser', { ...u, id, password })
    // })
    // dispatch('user/setCurrentUser', 0)
    state.sysUsers.forEach((u, id) => {
      dispatch('user/setSysUser', { ...u, id })
    })
    if (typeof Storage !== 'undefined') {
      // Code for localStorage
      const users = JSON.parse(localStorage.getItem('users'))
      console.log(users)
    } else {
      // No web storage Support.
    }
  },

  setTheme({ commit }, theme) {
    // todo: move themes to config
    switch (theme) {
      case 'light':
      case 'dark':
        break;
      default:
        theme = 'light'
    }
    // saving token in cookie for server rendering
    this.$cookies.set(themeKeyName, theme, { path: '/' })
    commit(THEME, theme)
  },

}

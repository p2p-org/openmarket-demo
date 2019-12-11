import { CONFIG_URLS, FINISH_LOADER, MARKET_COINS, START_LOADER, THEME } from './mutation-types'

const themeKeyName = 'theme'
export const state = () => ({
  loading: true,
  theme: 'light',
  alerts: [],
})

export const mutations = {
  [START_LOADER](state) {
    // ++state.loading
    state.loading = true
  },
  [FINISH_LOADER](state) {
    // if (state.loading > 0) --state.loading
    state.loading = false
  },
  [THEME](state, theme) {
    state.theme = theme
  },
}

export const getters = {
  getTheme(state) {
    return state.theme
  },
}

export const actions = {
  // server pre init
  async nuxtServerInit({ state, commit, dispatch }, { req, app }) {
    await dispatch('setTheme', app.$cookies.get(themeKeyName))
    // await dispatch('market/queryCoins')

    await dispatch('user/initServiceUser')

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

  startLoader({ commit }) {
    commit(START_LOADER)
  },
  stopLoader({ commit }) {
    commit(FINISH_LOADER)
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

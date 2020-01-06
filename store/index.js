import { CONFIG_URLS, FINISH_LOADER, START_LOADER } from '~/helpers/mutation-types'

export const state = () => ({
  loading: true,
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
}

export const getters = {}

export const actions = {
  // server pre init
  async nuxtServerInit({ state, commit, dispatch }, { req, app }) {
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
}

import { THEME } from './mutation-types'

const themeKeyName = 'theme'
export const state = () => ({
  theme: 'dark',
  alerts: [],
  access: false
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
  nuxtServerInit({ commit, dispatch }, { req, app }) {
    dispatch('setTheme', app.$cookies.get(themeKeyName))
  },

  setTheme({ commit }, theme) {
    // todo: move themes to config
    switch (theme) {
      case 'light':
      case 'dark':
        break;
      default:
        theme = 'dark'
    }
    // saving token in cookie for server rendering
    this.$cookies.set(themeKeyName, theme, { path: '/' })
    commit(THEME, theme)
  },

}

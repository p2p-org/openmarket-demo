export function addUser({ state, commit, dispatch }, { name = null, mnemonic = null, address = null, ecpairPriv = null }) {
  try {
    if (mnemonic && (!address || !ecpairPriv)) {
      address = this.$txApi.getAddress(mnemonic)
      ecpairPriv = this.$txApi.getECPairPriv(mnemonic)
    }
    commit('setUser', { name, mnemonic, address, ecpairPriv })
  } catch (e) {
    console.error('addUser', e)
    return Promise.reject(e)
  }
  commit('saveLocalUsers')
  return Promise.resolve(address)
}

// export function setCurrentUser({ commit, dispatch }, id) {
//   commit('setCurrentUser', id)
//   dispatch('saveLocalUsers')
//
//   return Promise.resolve()
//   // return dispatch('loadUserInfo')
// }

export function setCurrentUser({ commit, dispatch }, address) {
  commit('setCurrentUser', address)
  commit('saveLocalUsers')
  // return dispatch('loadUserInfo')
}

export function delCurrentUser({ state, dispatch }) {
  return dispatch('delUser', state.current)
}

export function delUser({ commit, dispatch }, address) {
  commit('delUser', address)
  commit('saveLocalUsers')
}

export function updCurrentUser({ state, dispatch }, { params = {} }) {
  return dispatch('updUser', { address: state.current, params })
}

export function updUser({ commit, dispatch }, { address, params = {} }) {
  commit('setUser', { address, params })
  commit('saveLocalUsers')
}

export function loadCurrentUserInfo({ state, dispatch }) {
  return dispatch('loadUserInfo', { address: state.current })
}

export function loadUserInfo({ commit, state, getters, rootState }, { address }) {
  return this.$txApi.getAccounts(address).then(data => {
    console.log('load user from bc', data)
    commit('setUser', { address, params: { ...data.result.value, address } })
    commit('saveLocalUsers')
  })
}

export function loadLocalUsers({ commit }) {
  commit('loadLocalUsers')
}

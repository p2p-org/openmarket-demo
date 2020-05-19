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

export function setCurrentUser({ commit, dispatch }, address) {
  commit('setCurrentUser', address)
  commit('saveLocalUsers')
  // return dispatch('loadUserInfo')
}

export function delCurrentUser({ state, dispatch }) {
  return dispatch('delUser', state.currentAddress)
}

export function delUser({ commit, dispatch }, address) {
  commit('delUser', address)
  commit('saveLocalUsers')
}

export function updCurrentUser({ state, dispatch }, { params = {} }) {
  return dispatch('updUser', { address: state.currentAddress, params })
}

export function updUser({ commit, dispatch }, { address, params = {} }) {
  commit('setUser', { address, params })
  commit('saveLocalUsers')
}

export function loadCurrentUserInfo({ state, dispatch }) {
  return dispatch('loadUserInfo', { address: state.currentAddress })
}

export async function loadUserInfo({ commit, state, getters, rootState }, { address }) {
  const resp = await Promise.all([
    this.$txApi.getAccounts(address),
    this.$txApi.getBalances(address)
  ])
  console.log('load user from bc', resp)
  commit('setUser', { address, params: { ...resp[0].result.value, coins: resp[1].result } })
  commit('saveLocalUsers')
}

export function loadLocalUsers({ commit }) {
  commit('loadLocalUsers')
}

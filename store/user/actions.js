export function setUser(
  { commit, dispatch },
  { id = null, name = null, mnemonic = null, address = null, password = null, ecpairPriv = null }
) {
  try {
    if (mnemonic) {
      address = this.$txApi.getAddress(mnemonic)
      ecpairPriv = this.$txApi.getECPairPriv(mnemonic)
    }
    commit('setUser', { id, name, mnemonic, password, address, ecpairPriv })
    dispatch('saveLocalUsers')
  } catch (e) {
    return Promise.reject(e)
  }
  return Promise.resolve()
}

export function setSysUser(
  { commit, dispatch },
  { id = null, name = null, mnemonic = null, address = null, ecpairPriv = null }
) {
  try {
    if (mnemonic) {
      address = this.$txApi.getAddress(mnemonic)
      ecpairPriv = this.$txApi.getECPairPriv(mnemonic)
    }
    commit('setSysUser', { id, name, mnemonic, address, ecpairPriv })
  } catch (e) {
    return Promise.reject(e)
  }
  return Promise.resolve()
}

export function setCurrentUser({ commit, dispatch }, id) {
  commit('setCurrentUser', id)
  dispatch('saveLocalUsers')

  return Promise.resolve()
  // return dispatch('loadUserInfo')
}

export function delCurrentUser({ commit, dispatch }) {
  commit('delCurrentUser')
  dispatch('saveLocalUsers')
  return Promise.resolve()
}

export function delUser({ commit }, id) {
  commit('delUser', id)
  return Promise.resolve()
}

export function updCurrentUserBalance({ state, commit }) {
  return this.$txApi.getAccounts(state.users[state.currentId].address).then(data => {
    commit('updateCurrentUser', data.result.value)
  })
}

export function loadUserInfo({ commit, state, getters, rootState }) {
  // return new Promise((resolve, reject) => {
  //   this.$marketApi
  //     .getUser({ address: getters.currentUser.address })
  //     .then(r => {
  //       //
  //       console.log(r)
  //       r.forEach(i => commit('updateCurrentUser', i))
  //       resolve(r)
  //     })
  //     .catch(reject)
  // })

  if (getters.currentUser === null) {
    return Promise.reject()
  }

  return new Promise((resolve, reject) => {
    this.$txApi
      .getAccounts(getters.currentUser.address)
      .then(data => {
        console.log(data)
        //       r.forEach(i => commit('updateCurrentUser', i))
        resolve(data)
      })
      .catch(reject)
  })
}

export function loadLocalUsers({ dispatch, commit }) {
  if (typeof Storage !== 'undefined') {
    const users = JSON.parse(localStorage.getItem('users'))
    const currentId = JSON.parse(localStorage.getItem('currentId'))
    if (users && users.length) {
      for (let id = 0; id < users.length; id++) {
        commit('setUser', { ...users[id], id })
      }
      commit('setCurrentUser', currentId)
    }
  }
}

export function saveLocalUsers({ state }) {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('users', JSON.stringify(state.users))
    localStorage.setItem('currentId', JSON.stringify(state.currentId))
  }
}

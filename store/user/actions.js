export function setUser(
  { commit },
  { id = null, name = null, mnemonic = null, address = null, password = null, ecpairPriv = null }
) {
  if (mnemonic) {
    address = this.$txApi.getAddress(mnemonic)
    ecpairPriv = this.$txApi.getECPairPriv(mnemonic)
  }

  commit('setUser', { id, name, mnemonic, password, address, ecpairPriv })
  return Promise.resolve()
}

export function setCurrentUser({ commit, dispatch }, id) {
  commit('setCurrentUser', id)
  return Promise.resolve()
  // return dispatch('loadUserInfo')
}

export function delCurrentUser({ commit }) {
  commit('delCurrentUser')
  return Promise.resolve()
}

export function delUser({ commit }, id) {
  commit('delUser', id)
  return Promise.resolve()
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
    console
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

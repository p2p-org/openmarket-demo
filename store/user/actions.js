export function setUser(
  { commit },
  // eslint-disable-next-line camelcase
  { id = null, name = null, mnemonic = null, address = null, password = null, sequence = 0, account_number = 0 }
) {
  if (!address && mnemonic) {
    address = this.$cosmos.getAddress(mnemonic)
  }
  // console.log(address, this.users[0].address)
  // const ecpairPriv = cosmos.getECPairPriv(mnemonic)

  commit('setUser', { id, name, mnemonic, password, address, sequence, account_number })
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
  if (getters.currentUser === null) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    return Promise.all([
      this.$axios.$get(rootState.config.apiHub + '/auth/accounts/' + getters.currentUser.address),
      this.$axios.$get(rootState.config.apiHub + '/auth/accounts/' + getters.currentUser.address),
    ])
      .then(responses => {
        console.log(responses)
        commit('userInfo', responses[0].value || responses[0].Account.value)
        commit('userHubInfo', responses[1].value || responses[1].Account.value)
        resolve()
      })
      .catch(e => {
        console.error('loadUserInfo', e)
        reject(e)
      })
  })
}

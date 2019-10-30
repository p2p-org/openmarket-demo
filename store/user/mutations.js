export default {
  setUser(state, { id = null, mnemonic = null, name = null, address = null, password = null, ecpairPriv = null }) {
    if (id !== null && id < state.users.length) {
      state.users.splice(id, 1, { name, address, password, mnemonic, ecpairPriv })
      state.currentId = id
    } else {
      state.currentId = state.users.length
      state.users.push({ name, address, password, mnemonic, ecpairPriv })
    }
  },
  setSysUser(state, { id = null, mnemonic = null, name = null, address = null, ecpairPriv = null }) {
    if (id !== null && id < state.users.length) {
      state.sysUsers.splice(id, 1, { name, address, mnemonic, ecpairPriv })
    } else {
      state.sysUsers.push({ name, address, mnemonic, ecpairPriv })
    }
  },
  setCurrentUser(state, id = 0) {
    if (id < state.users.length) {
      state.currentId = id
    } else {
      state.currentId = state.users.length ? state.users.length - 1 : null
    }
  },
  delCurrentUser(state) {
    state.users.splice(state.currentId, 1)
    state.currentId = state.users.length ? 0 : null
  },
  delUser(state, id = 0) {
    if (id < state.users.length) {
      state.users.splice(id, 1)
    } else {
      state.currentId = state.users.length ? 0 : null
    }
  },

  updateCurrentUser(state, params = {}) {
    console.log(params)
    state.users.splice(state.currentId, 1, { ...state.users[state.currentId], ...params })
  },

  // eslint-disable-next-line camelcase
  incSequenceCurrentUser(state) {
    state.users[state.currentId].sequence++
    // state.users.splice(state.currentId, 1, { ...state.users[state.currentId], account_number })
  },
}

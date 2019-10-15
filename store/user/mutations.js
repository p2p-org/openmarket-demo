export default {
  setUser(state, {
    id = null,
    mnemonic = null,
    name = null,
    address = null,
    password = null
  }) {
    if (id !== null && id < state.accounts.length) {
      state.accounts.splice(id, 1, { name, address, password, mnemonic })
      state.currentId = id
    } else {
      state.currentId = state.accounts.length
      state.accounts.push({ name, address, password, mnemonic })
    }
  },
  setCurrentUser(state, id = 0) {
    if (id < state.accounts.length) {
      state.currentId = id
    } else {
      state.currentId = state.accounts.length ? state.accounts.length - 1 : null
    }
  },
  delCurrentUser(state) {
    state.accounts.splice(state.currentId, 1)
    state.currentId = state.accounts.length ? 0 : null
  },
  delUser(state, id = 0) {
    if (id < state.accounts.length) {
      state.accounts.splice(id, 1)
    } else {
      state.currentId = state.accounts.length ? 0 : null
    }
  },
  userInfo(state, info) {
    state.currentUserInfo = {
      account_number: info.account_number || "0",
      sequence: info.sequence || "0",
    }
  },
}

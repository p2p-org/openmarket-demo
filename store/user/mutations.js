export default {
  setUser(state, { mnemonic = null, name = null, address = null, ecpairPriv = null, params = {} }) {
    if (state.users[address]) {
      console.log('upd user', address, state.users[address], params)
      state.users = { ...state.users, [address]: { ...state.users[address], ...params } }
    } else {
      state.users = { ...state.users, [address]: { name, address, mnemonic, ecpairPriv, ...params } }
    }
    // state.current = address
  },
  setCurrentUser(state, address) {
    if (state.users[address]) {
      state.current = address
    } else {
      state.current = Object.keys(state.users)[0] || null
    }
  },

  delUser(state, address) {
    state.users = Object.keys(state.users).reduce((object, key) => {
      if (key !== address) {
        object[key] = state.users[key]
      }
      return object
    }, {})
    // if (state.users[address]) {
    //   delete state.users[address]
    // }
    if (state.current === address) {
      state.current = Object.keys(state.users)[0] || null
    }
  },

  updateUser(state, { address, params = {} }) {
    if (state.users[address]) {
      const user = { ...state.users[address], ...params }
      state.users = { ...state.users, [address]: user }
    }
  },

  loadLocalUsers(state) {
    if (typeof Storage !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('users'))
      const current = JSON.parse(localStorage.getItem('current'))
      if (users && Object.keys(users).length) {
        state.users = users
        state.current = users[current] ? current : Object.keys(users)[0]
      }
    }
  },

  saveLocalUsers(state) {
    if (typeof Storage !== 'undefined') {
      console.log('save local', state.users)
      localStorage.setItem('users', JSON.stringify(state.users))
      localStorage.setItem('current', JSON.stringify(state.current))
    }
  },

}

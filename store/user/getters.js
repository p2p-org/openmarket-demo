export function currentUser(state) {
  return state.users[state.current] || null
  // return state.users[state.current] ? { ...state.users[state.current] } : null
}

// export function currentUserCoins(state, getters, rootState) {
//   if (state.users[state.current]) {
//     return rootState.config.coins.filter(c => state.users[state.current].coins.findIndex(x => x.denom === c.denom) !== -1)
//   }
//   return []
// }

export function serviceUser(state) {
  return state.service || null
}

export function findUserByName(state) {
  return name => state.users.find(x => x.name === name)
}

export function userIdByAddress(state) {
  return address => state.users.findIndex(x => x.address === address)
}

export function usersList(state) {
  return Object.keys(state.users).map(k => ({ ...state.users[k], active: k === state.current }))
}

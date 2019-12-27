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
export function currentUserCoins(state, getters, rootState) {
  return getters.currentUser && getters.currentUser.coins && getters.currentUser.coins.length
    ? getters.currentUser.coins.filter(x => x.denom !== rootState.config.stakeCoinDenom)
    : []
}

export function currentUserBalance(state, getters) {
  return denom => {
    let val = 0
    if (getters.currentUser && getters.currentUser.coins && getters.currentUser.coins.length) {
      val = getters.currentUser.coins.find(x => x.denom === denom)
      val = val ? val.amount : 0
    }
    return val
  }
}

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

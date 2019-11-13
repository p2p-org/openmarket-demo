export function currentUser(state) {
  return state.users[state.current] || null
  // return state.users[state.current] ? { ...state.users[state.current] } : null
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

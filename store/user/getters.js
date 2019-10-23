export function currentUser(state) {
  return state.users.length
    ? {
        ...state.users[state.currentId],
        // account_number: state.currentUserInfo.account_number,
        // sequence_number: state.currentUserInfo.sequence_number,
      }
    : null
}

export function findUserByName(state) {
  return name => state.users.find(x => x.name === name)
}

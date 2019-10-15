export function currentUser(state) {
  return state.accounts.length
    ? {
        ...state.accounts[state.currentId],
        account_number: state.currentUserInfo.account_number,
        sequence: state.currentUserInfo.sequence,
      }
    : null
}

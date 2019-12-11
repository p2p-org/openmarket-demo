export function findNft(state) {
  return id => state.nfts.find(x => x.token_id === id)
}
export function findOffers(state) {
  return id => state.offers.find(x => x.token_id === id)
}
export function findBids(state) {
  return id => state.bids.find(x => x.token_id === id)
}

export function isBusyNft(state) {
  return id => !!state.busy[id]
}

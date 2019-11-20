// import { constants, utils } from 'ethers'

export function findNft(state) {
  return id => state.nfts.find(x => x.token_id === id)
}
export function findOffers(state) {
  return id => state.offers.find(x => x.token_id === id)
}
export function findMyNft(state) {
  return id => state.myNfts.find(x => x.token_id === id)
}
export function allNft(state) {
  return state.nfts
}
export function myNft(state) {
  return state.myNfts
}

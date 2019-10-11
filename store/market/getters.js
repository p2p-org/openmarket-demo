// import { constants, utils } from 'ethers'

export function findNft(state) {
  return id => state.nfts.find(x => x.id === id)
}

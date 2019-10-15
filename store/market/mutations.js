// import { constants, utils } from 'ethers'
// import moment from 'moment'
import { MARKET_ALL_NFT } from '../mutation-types'

// function prepWallet(w) {
//   return {
//     ...w,
//     balanceFrozen: w.balanceFrozen ? utils.parseEther(w.balanceFrozen) : constants.Zero,
//     balanceMain: w.balanceMain ? utils.parseEther(w.balanceMain) : constants.Zero,
//     balanceOrders: w.balanceOrders ? utils.parseEther(w.balanceOrders) : constants.Zero,
//     balance: w.balance ? utils.parseEther(w.balance) : constants.Zero,
//     history: [],
//   }
// }
// function prepWalletHistory(h) {
//   return {
//     ...h,
//     // "amount": <Decimal>,
//     // "direction": <ENUM('in', 'out')>,
//     // "reason": <ENUM('order', 'exchange'>,
//     // "status": <ENUM('pending', 'frozen', 'success')>,
//     // "dateCreated": <DateTime>,
//     // "dateExecuted": <DateTime | null>,
//     // "bchWalletId": <string>
//     amount: h.amount ? utils.parseEther(h.amount) : constants.Zero,
//     dateCreated: h.dateCreated ? moment(h.dateCreated) : null,
//     dateExecuted: h.dateExecuted ? moment(h.dateExecuted) : null,
//   }
// }
//
// function prepCurrency(c) {
//   return {
//     ...c,
//     // "code": <CurrencyCode>,
//     // "data": <json>,
//     // "withdrawable": <bool>,
//     // "credentialsType": "bchaddr",
//     withdrawFee: c.withdrawFee ? utils.parseEther(c.withdrawFee) : constants.Zero,
//     minimalAmount: c.minimalAmount ? utils.parseEther(c.minimalAmount) : constants.Zero,
//     withdrawStep: c.withdrawStep ? utils.parseEther(c.withdrawStep) : constants.Zero,
//   }
// }
//
export default {
  [MARKET_ALL_NFT](state, nfts = []) {
    state.nfts = nfts // this.wallets.map(prepWallet)
      // .filter(w => {
      //   return wallets.findIndex(w1 => w1.currency === w.currency) === -1
      // })
      // .concat(wallets.map(prepWallet))
  },

}

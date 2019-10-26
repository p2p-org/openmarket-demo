const tx = require('../../cosmos-js')

export default ({ store }, inject) => {
  inject('cosmos', tx.network(store.state.config.lcdUrl, store.state.config.chainId))
  inject('msgs', tx.msgs)
}

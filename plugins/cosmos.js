const cosmos = require('../../cosmos-js')

export default ({ store }, inject) => {
  inject('cosmos', cosmos.network(store.state.config.lcdUrl, store.state.config.chainId))
  inject('msgs', cosmos.msgs)
}

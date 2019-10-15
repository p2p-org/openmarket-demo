const cosmos = require('@cosmostation/cosmosjs')

export default ({ store }, inject) => {
  inject('cosmos', cosmos.network(store.state.config.lcdUrl, store.state.config.chainId))
}

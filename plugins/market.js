import { DGMarketAPI } from '../../dgaming-market-sdk'

export default ({ store }, inject) => {
  const api = new DGMarketAPI({
    fetchPolicy: 'no-cache',
  })
  inject('marketApi', api)
}

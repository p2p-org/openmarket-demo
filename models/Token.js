import Model from './Model'

export default class Token extends Model {
  baseURL() {
    return '/api'
  }
  resource() {
    return 'token'
  }
}

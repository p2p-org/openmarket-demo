import { DGMarketAPI, DGTxAPI, DGTxMsgs } from 'dgaming-market-sdk'
// import { DGMarketAPI, DGTxAPI, DGTxMsgs } from '../../dgaming-market-sdk'

const buildPath = (...args) => {
  return args
    .map((part, i) => {
      if (i === 0) {
        return part.trim().replace(/[/]*$/g, '')
      } else {
        return part.trim().replace(/(^[/]*|[/]*$)/g, '')
      }
    })
    .filter(x => x.length)
    .join('/')
}
export default ({ store, req }, inject) => {
  let host
  let proto
  if (process.server) {
    host = req.headers.host
    // console.log('srv', host)
  } else {
    host = window.location.host
    proto = window.location.protocol
    // console.log('cli', window.location)
  }


  // console.log(hostname)

  inject(
    'marketApi',
    new DGMarketAPI({
      gqlHttpUrl: buildPath(`${proto}//${host}`, store.state.config.urls.gql),
      // gqlWsUrl: build_path(`${proto === 'https:' ? 'wss' : 'ws'}://${host}`, store.state.config.urls.gql),
      fetchPolicy: 'no-cache',
    })
  )
  inject(
    'txApi',
    new DGTxAPI({
      lcdUrl: buildPath(`${proto}//${host}`, store.state.config.urls.lcd),
      chainId: store.state.config.chainId,
    })
  )
  inject('txMsgs', DGTxMsgs)
}

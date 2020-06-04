import dayjs from 'dayjs'

export function txCheck(tx, msg) {
  return new Promise((resolve, reject) => {
    console.log('tx send', tx, msg)
    let log = {}

    if (tx && tx.raw_log && !tx.code) {
      log = JSON.parse(tx.raw_log)
      console.log('tx log1', log)
      if (Array.isArray(log)) {
        if (!log.length) {
          return resolve(tx)
        }
        log = log.pop()
      }
      console.log('tx log', log)
      if (log.success) {
        return resolve(tx)
      }
    }
    console.log('tx log1', log)
    reject(new Error(tx.raw_log || `unknown tx error: ${tx.code}`))
  })
}


export function prepToken(t) {
  return t.denom || t
}

// todo bignumbers
export function priceExt(p) {
  const m = p.match(/([\d.]+)([\w]+)?/i)
  return m ? { amount: parseInt(m[1]), denom: m[2] } : { amount: parseInt(p), denom: null }
}

export function prepOffer(o) {
  return {
    ...o,
    price: o.price ? priceExt(o.price) : { amount: 0, denom: null },
    created_at: o.created_at ? dayjs(o.created_at) : null,
    updated_at: o.updated_at ? dayjs(o.updated_at) : null,
  }
}

export function prepBid(b) {
  return {
    ...b,
    price: b.price ? priceExt(b.price) : { amount: 0, denom: null },
    created_at: b.created_at ? dayjs(b.created_at) : null,
    updated_at: b.updated_at ? dayjs(b.updated_at) : null,
  }
}

export function prepNft(n) {
  return {
    ...n,
    price: n.price ? priceExt(n.price) : { amount: 0, denom: null },
    opening_price: n.opening_price ? priceExt(n.opening_price) : { amount: 0, denom: null },
    buyout_price: n.buyout_price ? priceExt(n.buyout_price) : { amount: 0, denom: null },
    created_at: n.created_at ? dayjs(n.created_at) : null,
    updated_at: n.updated_at ? dayjs(n.updated_at) : null,
    time_to_sell: n.time_to_sell ? dayjs(n.time_to_sell) : null,
    busy: false,
  }
}

export function parseDenom(denom) {
  const regex = /^([a-z]+)\/([a-z]+)\/([a-z\_]+)$/g
  if (regex.test(denom)) {
    const found = denom.split('/')
    return {
      port: found[0],
      channel: found[1],
      denom: found[2]
    }
  } else {
    return {
      port: null,
      channel: null,
      denom
    }
  }
}

export function parseTokenId(tokenId) {
  const match = tokenId.match(/^.+_(\d+)$/)
  return parseInt(match[1] || '0')
}

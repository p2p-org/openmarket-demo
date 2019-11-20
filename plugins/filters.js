import Vue from 'vue'
// import { utils } from 'ethers'
// import BN from 'bn.js'
//
// const tera = new BN(1e12)
// const giga = new BN(1e9)
const tera = 1e12
const giga = 1e9
const mega = 1e6
const kilo = 1e3

const round = v => Math.round((v + Number.EPSILON) * 10) / 10

Vue.mixin({
  filters: {
    mToDate(value, locale = null) {
      if (!value) {
        return ''
      }
      if (locale) {
        value.locale(locale)
      }
      return value.format('D MMM HH:mm')
    },
    // bnToEther(value) {
    //   return value ? utils.formatEther(value) : ''
    // },
    // bnToEtherCca(value) {
    //   if (!value) return '0'
    //   // console.log(typeof value)
    //   value = utils.bigNumberify(value)
    //   if (value.isZero()) return '0'
    //   const s = utils.formatEther(value)
    //   const v = parseFloat(s)
    //   if (v < 0.001) return '<0.001'
    //   return s.split('.')[1].length > 3 ? v.toFixed(3) : v.toString()
    // },
    collapse(s, b = 5, e = 3) {
      return s && s.length > b + e ? s.substring(0, b) + '…' + s.substring(s.length - e) : s
    },
    truncate(s, l = 45, e = true) {
      if (l < 0) {
        return s && s.length > -l ? (e ? '…' : '') + s.substring(s.length + l, s.length) : s
      } else {
        return s && s.length > l ? s.substring(0, l) + (e ? '…' : '') : s
      }
    },
    priceEth(v, r = 1, d = 3) {
      v = parseFloat(v) || 0
      // return +(Math.round(v / r + 'e+'+d) + 'e-'+d) + 'ETH'
      return `${(v / r).toPrecision(d)} ETH`
    },
    priceBig(v, d = 5) {
      if (!v) return v
      v = parseFloat(v) || 0
      //
      // const p = new BN(v)
      // console.log(v, p)
      // if (p.gte(tera)) {
      //   return p.div(tera).toString() + 'T'
      // }
      // if (p.gte(giga)) {
      //   return p.div(giga).toString() + 'G'
      // }
      // if (p.gte(mega)) {
      //   return p.div(mega).toString() + 'M'
      // }
      // return v
      if (v >= tera) {
        return round(v / tera) + 'T'
      }
      if (v >= giga) {
        return round(v / giga) + 'G'
      }
      if (v >= mega) {
        return round(v / mega) + 'M'
      }
      // if (v >= kilo) {
      //   return round(v / kilo) + 'K'
      // }
      return v
    }
  },
})

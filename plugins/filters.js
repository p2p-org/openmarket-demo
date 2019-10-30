import Vue from 'vue'
// import { utils } from 'ethers'

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
    truncate(s, l = 45) {
      return s && s.length > l ? s.substring(0, l) + '…' : s
    },
    priceEth(v, r = 1, d = 5) {
      v = parseFloat(v) || 0
      return `${(v / r).toFixed(d)} ETH`
    },
  },
})

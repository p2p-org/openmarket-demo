import Vue from 'vue'
import moment from 'moment'

Vue.mixin({
  methods: {
    nftMetaPropAll(meta) {
      return meta.properties.map(p => {
        return {
          ...p,
          options: meta.definitions[p.trait] || null,
        }
      })
    },

    nftMetaProp(meta, trait) {
      return {
        ...meta.properties.find(p => p.trait === trait),
        options: meta.definitions[trait] || null
      }
    },
    nftMetaDisplay(meta, display, first = true) {
      const m = meta.properties
        .filter(p => p.display === display)
        .map(m => ({ ...m, options: meta.definitions[m.trait] || null }))
      if (m.length) {
        return first ? m[0] : m
      }
      return first ? [] : null
    },
    sortPrice(nfts, asc = true) {
      const tmpNfts = nfts.sort((a, b) => {
        const valA = parseInt(a.price.value || a.opening_price.value || 0)
        const valB = parseInt(b.price.value || b.opening_price.value || 0)
        // if (a.currency === b.currency) {
        return asc ? valA - valB : valB - valA
      })
      // items without price to the end
      return tmpNfts.filter(x => x.price.value).concat(tmpNfts.filter(x => !x.price.value))
    },
    sortTime(nfts, asc = true) {
      return nfts.sort((a, b) => {
        if (moment.isMoment(a.created_at) && moment.isMoment(b.created_at)) {
          // If both compared fields are moment instance
          return a.created_at.isBefore(b.created_at) ? (asc ? 1 : -1) : a.created_at.isAfter(b.created_at) ? (asc ? -1 : 1) : 0
        }
        return 0
      })
    },
  },
})

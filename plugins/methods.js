import Vue from 'vue'
let cuid = 0

Vue.mixin({
  beforeCreate() {
    this.cuid = cuid.toString()
    cuid++
  },
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
    nftAddMetaProp(meta, { trait, value, count = 1, order = null, display = null }) {
      if (!meta.properties) {
        meta.properties = []
      }
      meta.properties.push({
        trait,
        value,
        display,
        count,
        order,
      })
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
        const valA = parseInt(a.price.amount || a.opening_price.amount || 0)
        const valB = parseInt(b.price.amount || b.opening_price.amount || 0)
        // if (a.currency === b.currency) {
        return asc ? valA - valB : valB - valA
      })
      // items without price to the end
      return tmpNfts.filter(x => x.price.amount).concat(tmpNfts.filter(x => !x.price.amount))
    },
    sortTime(nfts, asc = true) {
      return nfts.sort((a, b) => {
        if (this.$dayjs.isDayjs(a.created_at) && this.$dayjs.isDayjs(b.created_at)) {
          // If both compared fields are dayjs instance
          return a.created_at.isBefore(b.created_at) ? (asc ? -1 : 1) : a.created_at.isAfter(b.created_at) ? (asc ? 1 : -1) : 0
        }
        return 0
      })
    },
    alertError(e) {
      console.log(e)
      this.$root.$emit('error', e)
    },
  },
})

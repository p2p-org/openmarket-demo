import Vue from 'vue'

Vue.mixin({
  methods: {
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
  },
})

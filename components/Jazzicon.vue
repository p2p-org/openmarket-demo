<template>
  <div ref="jazzicon" class="jazzicon"/>
</template>
<script>
import MersenneTwister from 'mersenne-twister'
import Color from 'color'

export default {
  name: 'Jazzicon',
  props: {
    seed: {
      type: Number,
      default: Math.round(Math.random() * 10000),
    },
    diameter: {
      type: Number,
      default: 100,
    },
    address: {
      type: String,
      default: null,
    },
    shapeCount: {
      type: Number,
      default: 4,
    },
    colors: {
      type: Array,
      default: () => [
        '#01888C', // teal
        '#71E2B5',
        '#FC1960', // magenta
        '#C7144C', // raspberry
        '#F3C100', // goldenrod
        '#1598F2', // lightning blue
        '#F87173',
        '#2465E1', // sail blue
        '#FC7500', // bright orange
        '#FDBB69', // gold
      ],
    },
  },
  data() {
    return {
      generator: null,
      svgns: 'http://www.w3.org/2000/svg',
    }
  },
  watch: {
    seed: {
      handler() {
        this.icon()
      },
    },
    address: {
      handler() {
        this.icon()
      },
    },
    diameter: {
      handler() {
        this.icon()
      },
    },
  },
  mounted() {
    this.icon()
  },
  methods: {
    async icon() {
      const seed = this.address ? this.calcHash(this.address) : this.seed
      this.$refs.jazzicon.innerHTML = ''
      const el = await this.generateIdenticon(this.diameter, seed)
      await this.$refs.jazzicon.append(el)
    },
    newPaper(diameter, color) {
      const container = document.createElement('div')
      container.style.borderRadius = `${diameter / 2}px`
      container.style.overflow = 'hidden'
      container.style.padding = '0px'
      container.style.margin = '0px'
      container.style.width = '' + diameter + 'px'
      container.style.height = '' + diameter + 'px'
      container.style.display = 'inline-block'
      container.style.background = color
      return {
        container,
      }
    },
    generateIdenticon(diameter, seed) {
      this.generator = new MersenneTwister(seed)
      const remainingColors = this.hueShift(this.colors.slice(), this.generator)
      const elements = this.newPaper(diameter, this.genColor(remainingColors))
      const container = elements.container
      const svg = document.createElementNS(this.svgns, 'svg')
      svg.setAttributeNS(null, 'x', '0')
      svg.setAttributeNS(null, 'y', '0')
      svg.setAttributeNS(null, 'width', diameter)
      svg.setAttributeNS(null, 'height', diameter)
      container.appendChild(svg)
      for (let i = 0; i < this.shapeCount - 1; i++) {
        this.genShape(remainingColors, diameter, i, this.shapeCount - 1, svg)
      }
      return container
    },
    genShape(remainingColors, diameter, i, total, svg) {
      const center = diameter / 2
      const shape = document.createElementNS(this.svgns, 'rect')
      shape.setAttributeNS(null, 'x', '0')
      shape.setAttributeNS(null, 'y', '0')
      shape.setAttributeNS(null, 'width', diameter)
      shape.setAttributeNS(null, 'height', diameter)
      const firstRot = this.generator.random()
      const angle = Math.PI * 2 * firstRot
      const velocity = (diameter / total) * this.generator.random() + (i * diameter) / total
      const tx = Math.cos(angle) * velocity
      const ty = Math.sin(angle) * velocity
      const translate = 'translate(' + tx + ' ' + ty + ')'
      // Third random is a shape rotation on top of all of that.
      const secondRot = this.generator.random()
      const rot = firstRot * 360 + secondRot * 180
      const rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')'
      const transform = translate + ' ' + rotate
      shape.setAttributeNS(null, 'transform', transform)
      const fill = this.genColor(remainingColors)
      shape.setAttributeNS(null, 'fill', fill)
      svg.appendChild(shape)
    },
    genColor(colors) {
      const idx = Math.floor(colors.length * this.generator.random())
      return colors.splice(idx, 1)[0]
    },
    hueShift(colors, generator) {
      const wobble = 30
      const amount = generator.random() * 30 - wobble / 2
      return colors.map(function(hex) {
        const color = Color(hex)
        color.rotate(amount)
        return color.hex()
      })
    },
    calcHash(text) {
      // return parseInt(text.slice(2, 10), 26)
      return text ? text.match(/\d/g).reduce((a, n) => a + n) : 0
      // return text ? text.split('').reduce((a, n) => a + n.charCodeAt(0), 0) : 0
    },
  },
}
</script>

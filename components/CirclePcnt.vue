<template>
  <svg ref="circle" class="stat-circle" viewBox="1.6 1.6 16.8 16.8">
    <circle class="bg" cx="10" cy="10" r="8" />
    <circle class="progress" cx="10" cy="10" r="8" :data-percentage="percentage" />
    <text x="62%" y="70%">{{ percentage }}%</text>
  </svg>
</template>

<script>
import { TweenMax } from 'gsap/TweenMax'
export default {
  name: 'CirclePcnt',
  props: {
    percentage: {
      type: String,
      default: null,
    },
  },
  // data: () => ({
  //   minmax: new TweenMax(),
  // }),
  mounted() {
    const $statCircle = this.$refs.circle.querySelectorAll('circle')
    console.log($statCircle)
    for (let i = 0; i < $statCircle.length; i++) {
      const p = parseFloat($statCircle[i].dataset.percentage)
      const off = -51 - (51 / 100) * p
      const minmax = new TweenMax()
      minmax.to($statCircle[i], 0.8, {
        strokeDashoffset: off,
      })
    }
  },
}
</script>

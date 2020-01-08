<template>
  <div>
    <page-header v-if="!loading" />
    <b-alert :show="!!errors.length" variant="danger" dismissible @dismissed="hideError">
      Something went wrong! Check your internet connection ant try to reload the page.

      <ul>
        <li v-for="(e, i) in errors" :key="i">
          <small>{{ e }}</small>
        </li>
      </ul>
    </b-alert>
    <nuxt v-if="!loading" />
    <!--    <page-footer />-->
    <pre-loader />
    <div style="display: none">
      <svg id="sort-up" focusable="false" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M36.5714286,0 L475.428571,0 C495.626412,0 512,19.1025173 512,42.6666667 C512,66.230816 495.626412,85.3333333 475.428571,85.3333333 L36.5714286,85.3333333 C16.3735863,85.3333333 0,66.230816 0,42.6666667 C0,19.1025173 16.3735863,0 36.5714286,0 Z M36.5714286,213.333333 L329.142857,213.333333 C349.340699,213.333333 365.714286,232.435851 365.714286,256 C365.714286,279.564149 349.340699,298.666667 329.142857,298.666667 L36.5714286,298.666667 C16.3735863,298.666667 0,279.564149 0,256 C0,232.435851 16.3735863,213.333333 36.5714286,213.333333 Z M36.5714286,426.666667 L182.857143,426.666667 C203.054985,426.666667 219.428571,445.769186 219.428571,469.333333 C219.428571,492.897481 203.054985,512 182.857143,512 L36.5714286,512 C16.3735863,512 0,492.897481 0,469.333333 C0,445.769186 16.3735863,426.666667 36.5714286,426.666667 Z" /></svg>
      <svg id="sort-down" focusable="false" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M36.5714286,0 L475.428571,0 C495.626412,0 512,19.1025173 512,42.6666667 C512,66.230816 495.626412,85.3333333 475.428571,85.3333333 L36.5714286,85.3333333 C16.3735863,85.3333333 0,66.230816 0,42.6666667 C0,19.1025173 16.3735863,0 36.5714286,0 Z M36.5714286,213.333333 L329.142857,213.333333 C349.340699,213.333333 365.714286,232.435851 365.714286,256 C365.714286,279.564149 349.340699,298.666667 329.142857,298.666667 L36.5714286,298.666667 C16.3735863,298.666667 0,279.564149 0,256 C0,232.435851 16.3735863,213.333333 36.5714286,213.333333 Z M36.5714286,426.666667 L182.857143,426.666667 C203.054985,426.666667 219.428571,445.769186 219.428571,469.333333 C219.428571,492.897481 203.054985,512 182.857143,512 L36.5714286,512 C16.3735863,512 0,492.897481 0,469.333333 C0,445.769186 16.3735863,426.666667 36.5714286,426.666667 Z" transform="translate(256.000000, 256.000000) rotate(-180.000000) translate(-256.000000, -256.000000)" /></svg>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PreLoader from '../components/PreLoader'
import PageHeader from '~/components/Header'
// import PageFooter from '~/components/Footer'

export default {
  name: 'Layout',
  components: {
    PreLoader,
    PageHeader,
    // PageFooter,
  },

  data: () => ({
    errors: [],
  }),
  computed: {
    ...mapState({
      loading: state => state.loading,
    }),
  },
  created() {
    this.$root.$on('error', this.showError)
  },
  mounted() {
    this.queryCoins()
      .catch(this.alertError)
      .then(() => {
        this.stopLoader()
      })
  },
  methods: {
    ...mapActions(['initUsers', 'stopLoader']),
    ...mapActions('market', ['queryCoins']),
    showError(e) {
      this.errors.push(e.message)
    },
    hideError() {
      this.errors = []
    },
  },
}
</script>

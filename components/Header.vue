<template>
  <header class="header mb-3">
    <b-navbar toggleable="lg">
      <b-container>
      <b-navbar-brand to="/" exact>
<!--        <b-img src="@/assets/psc_logo_web_2d.png"></b-img>-->
        Open Market
      </b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse id="nav_collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'index' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'market' }">Market</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form class="mr-5" >

            <b-form-radio v-model="theme" name="some-radios" value="light" button button-variant="outline-primary" size="sm" @change="setTheme">
              <fa :icon="['fas', 'sun']" />
            </b-form-radio>
<!--            <b-form-checkbox v-model="theme" switch value="dark" unchecked-value="light"></b-form-checkbox>-->
            <b-form-radio v-model="theme" name="some-radios" value="dark" button button-variant="outline-primary" size="sm" @change="setTheme">
              <fa :icon="['fas', 'moon']" />
            </b-form-radio>

<!--            <b-form-radio-group-->
<!--              id="theme-selector"-->
<!--              v-model="theme"-->
<!--              :options="themes"-->
<!--              buttons-->
<!--              name="theme-selector"-->
<!--            ></b-form-radio-group>-->
          </b-nav-form>
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit" variant="primary">Search</b-button>
          </b-nav-form>
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <fa :icon="['fas', 'user']" />
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
      </b-container>
    </b-navbar>
  </header>
</template>
<!--<style scoped lang="scss">-->
<!--</style>-->

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'PageHeader',
  data() {
    return {
      theme: null,
      isDark: false,
      themes: [
        'light',
        'dark',

      ],
      height: 220,
    }
  },
  computed: {
    // ...mapState({
    //   theme: state => state.theme,
    // }),
    ...mapGetters(['getTheme']),
  },
  created() {
    // this.$root.$on('bv::scrollspy::activate', this.onActivate)
  },

  mounted() {
    this.theme = this.getTheme
  },
  methods: {
    ...mapActions(['setTheme']),
    onActivate(target) {
      console.log('Received event: "bv::scrollspy::activate" for target ', target)
    },

    handleScroll(evt, el, arg) {
      const h = 150
      const c = 'navbar-unshrink'
      if (window.scrollY > h) {
        if (el.classList.contains(c)) {
          el.classList.remove(c);
        }
      } else {
        if (!el.classList.contains(c)) {
          el.classList.add(c);
        }
      }
      return window.scrollY > h * 2
    }
  }}
</script>

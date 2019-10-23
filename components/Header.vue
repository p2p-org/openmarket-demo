<template>
  <header class="header mb-3">
    <b-navbar toggleable="lg">
      <b-container>
        <b-navbar-brand to="/" exact>
          <!--        <b-img src="@/assets/psc_logo_web_2d.png"></b-img>-->
          Open Market
        </b-navbar-brand>
        <b-navbar-toggle target="nav_collapse" />
        <b-collapse id="nav_collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item :to="{ name: 'index' }" exact>
              Home
            </b-nav-item>
            <b-nav-item :to="{ name: 'market' }" exact>
              Market
            </b-nav-item>
            <b-nav-item :to="{ name: 'market', query: { owner: currentUser.address } }" exact>
              My NFT's
            </b-nav-item>
            <b-nav-item :to="{ name: 'nft' }">
              Mint
            </b-nav-item>

            <!--          <b-nav-item href="#" disabled>Disabled</b-nav-item>-->
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form class="mr-5">
              <b-form-radio
                v-model="theme"
                name="some-radios"
                value="light"
                button
                button-variant="outline-primary"
                size="sm"
                @change="setTheme"
              >
                <fa :icon="['fas', 'sun']" />
              </b-form-radio>
              <!--            <b-form-checkbox v-model="theme" switch value="dark" unchecked-value="light"></b-form-checkbox>-->
              <b-form-radio
                v-model="theme"
                name="some-radios"
                value="dark"
                button
                button-variant="outline-primary"
                size="sm"
                @change="setTheme"
              >
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
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search" />
              <b-button size="sm" class="my-2 my-sm-0" type="submit" variant="primary">
                Search
              </b-button>
            </b-nav-form>
<!--            <b-nav-item-dropdown right>-->
<!--              <template v-slot:button-content>-->
<!--                <fa :icon="['fas', 'user']" />-->
<!--              </template>-->
<!--              <b-dropdown-item :to="{ name: 'nft' }">-->
<!--                NFT Manage-->
<!--              </b-dropdown-item>-->
<!--              <b-dropdown-item :to="{ name: 'my' }">-->
<!--                My NFTs-->
<!--              </b-dropdown-item>-->
<!--              &lt;!&ndash;            <b-dropdown-item href="#">Profile</b-druseropdown-item>&ndash;&gt;-->
<!--              <b-dropdown-item href="#" disabled>-->
<!--                Sign Out-->
<!--              </b-dropdown-item>-->
<!--            </b-nav-item-dropdown>-->
            <b-nav-item-dropdown right>
              <template slot="button-content">
<!--                <fa :icon="['fas', 'user']" /> {{ userName | truncate(5) }}-->
                 <client-only>
                <jazzicon :address="userAddress" :diameter="20" />
                 </client-only>
                 {{ userName | truncate(5) }}
              </template>
              <template v-if="users.length">
                <b-dropdown-item-btn v-for="(a, id) in users" :key="id" :active="currentId === id" @click="setCurrentUser(id)">
                  <b>{{ a.name }}</b> <small>({{ a.address | collapse(8, 5) }} )</small>
<!--                  <div class="d-flex flex-row justify-content-between">-->
<!--                  <span><b>{{ a.name }}</b> <small>({{ a.address | collapse(8, 5) }} )</small></span>-->
<!--                  <span>-->
<!--                    <b-btn :to="{ name: 'user-id', params: { id: id } }" variant="outline-info" size="sm">-->
<!--                       <fa :icon="['fas', 'edit']" />-->
<!--                    </b-btn>-->
<!--                    <b-btn variant="outline-danger" size="sm">-->
<!--                       <fa :icon="['fas', 'trash']" />-->
<!--                    </b-btn>-->
<!--                  </span>-->
<!--                  </div>-->
                </b-dropdown-item-btn>
                <b-dropdown-divider />
              </template>
<!--              <b-dropdown-item>-->
<!--                <div class="d-flex flex-row justify-content-between">-->
<!--                  <b-btn :to="{ name: 'user-id' }" variant="success" size="sm">-->
<!--                     <fa :icon="['fas', 'plus']" /> Add new-->
<!--                  </b-btn>-->
<!--                  <b-btn :to="{ name: 'user-id' }" variant="warning" size="sm" :disabled="!currentId">-->
<!--                       <fa :icon="['fas', 'edit']" /> Edit-->
<!--                  </b-btn>-->
<!--                  <b-btn :to="{ name: 'user-id' }" variant="danger" size="sm" :disabled="!currentId" @click="delUser(id)">-->
<!--                       <fa :icon="['fas', 'trash']" /> Delete-->
<!--                  </b-btn>-->
<!--                </div>-->
<!--              </b-dropdown-item>-->
              <b-dropdown-item :to="{ name: 'user-id' }" exact variant="success">
                <fa :icon="['fas', 'plus']" /> add user
              </b-dropdown-item>
              <template v-if="currentId !== null">
                <b-dropdown-divider />
                <b-dropdown-item :to="{ name: 'user-id', params: { id: currentId } }" exact variant="warning">
                  <fa :icon="['fas', 'edit']" /> edit user
                </b-dropdown-item>
                <b-dropdown-item variant="danger" @click="delCurrentUser">
                  <fa :icon="['fas', 'trash']" /> del user
                </b-dropdown-item>
              </template>
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
import Jazzicon from './Jazzicon'

export default {
  name: 'PageHeader',
  components: {
    Jazzicon,
  },
  data() {
    return {
      theme: null,
      isDark: false,
      themes: ['light', 'dark'],
      height: 220,
    }
  },
  computed: {
    ...mapState({
      users: state => state.user.users,
      currentId: state => state.user.currentId,
    }),
    ...mapGetters(['getTheme']),
    ...mapGetters('user', ['currentUser']),
    userName() {
      return this.currentUser ? this.currentUser.name : '<login>'
    },
    userAddress() {
      return this.currentUser ? this.currentUser.address.substring(8) : '<address>'
    },
  },
  created() {
    // this.$root.$on('bv::scrollspy::activate', this.onActivate)
  },

  mounted() {
    this.theme = this.getTheme
  },
  methods: {
    ...mapActions(['setTheme']),
    ...mapActions('user', ['delCurrentUser', 'setCurrentUser']),

    onActivate(target) {
      console.log('Received event: "bv::scrollspy::activate" for target ', target)
    },

    handleScroll(evt, el, arg) {
      const h = 150
      const c = 'navbar-unshrink'
      if (window.scrollY > h) {
        if (el.classList.contains(c)) {
          el.classList.remove(c)
        }
      } else if (!el.classList.contains(c)) {
        el.classList.add(c)
      }
      return window.scrollY > h * 2
    },
  },
}
</script>

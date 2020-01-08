<template>
  <header class="header mb-3">
    <b-navbar toggleable="lg">
      <b-container>
        <b-navbar-brand to="/" exact>
          <!--        <b-img src="~/assets/psc_logo_web_2d.png"></b-img>-->
          Open Market
        </b-navbar-brand>
        <b-navbar-toggle target="nav_collapse" />
        <b-collapse id="nav_collapse" is-nav>
          <b-navbar-nav>
<!--            <b-nav-item :to="localePath({ name: 'index' })" exact>-->
<!--              Home-->
<!--            </b-nav-item>-->
            <b-nav-item :to="localePath({ name: 'market' })" :class="{ active: isMarketRoute && !isMyNftRoute }" exact>
              Market
            </b-nav-item>
            <b-nav-item v-if="currentUser" :to="localePath({ name: 'market', query: { owner: currentUser.address } })" :class="{ active: isMarketRoute && isMyNftRoute }" exact>
              My NFT's
            </b-nav-item>
            <b-nav-item v-if="currentUser" :to="localePath({ name: 'my' })">
              My Account
            </b-nav-item>
            <b-nav-item v-if="currentUser" :to="localePath({ name: 'nft' })">
              Mint
            </b-nav-item>

            <!--          <b-nav-item href="#" disabled>Disabled</b-nav-item>-->
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
<!--            <b-nav-form class="mr-5">-->
<!--              <b-form-radio-->
<!--                v-model="theme"-->
<!--                name="some-radios"-->
<!--                value="light"-->
<!--                button-->
<!--                button-variant="outline-primary"-->
<!--                size="sm"-->
<!--                @change="setTheme"-->
<!--              >-->
<!--                <fa :icon="['fas', 'sun']" />-->
<!--              </b-form-radio>-->
<!--              &lt;!&ndash;            <b-form-checkbox v-model="theme" switch value="dark" unchecked-value="light"></b-form-checkbox>&ndash;&gt;-->
<!--              <b-form-radio-->
<!--                v-model="theme"-->
<!--                name="some-radios"-->
<!--                value="dark"-->
<!--                button-->
<!--                button-variant="outline-primary"-->
<!--                size="sm"-->
<!--                @change="setTheme"-->
<!--              >-->
<!--                <fa :icon="['fas', 'moon']" />-->
<!--              </b-form-radio>-->

<!--              &lt;!&ndash;            <b-form-radio-group&ndash;&gt;-->
<!--              &lt;!&ndash;              id="theme-selector"&ndash;&gt;-->
<!--              &lt;!&ndash;              v-model="theme"&ndash;&gt;-->
<!--              &lt;!&ndash;              :options="themes"&ndash;&gt;-->
<!--              &lt;!&ndash;              buttons&ndash;&gt;-->
<!--              &lt;!&ndash;              name="theme-selector"&ndash;&gt;-->
<!--              &lt;!&ndash;            ></b-form-radio-group>&ndash;&gt;-->
<!--            </b-nav-form>-->
            <b-nav-form @submit.prevent="doSearch">
              <b-form-input v-model="search" size="sm" class="mr-sm-2" placeholder="Search" trim />
              <b-button size="sm" class="my-2 my-sm-0" type="submit" variant="primary">
                Search
              </b-button>
            </b-nav-form>
<!--            <b-nav-item-dropdown right>-->
<!--              <template v-slot:button-content>-->
<!--                <fa :icon="['fas', 'user']" />-->
<!--              </template>-->
<!--              <b-dropdown-item :to="localePath({ name: 'nft' })">-->
<!--                NFT Manage-->
<!--              </b-dropdown-item>-->
<!--              <b-dropdown-item :to="localePath({ name: 'my' })">-->
<!--                My NFTs-->
<!--              </b-dropdown-item>-->
<!--              &lt;!&ndash;            <b-dropdown-item href="#">Profile</b-druseropdown-item>&ndash;&gt;-->
<!--              <b-dropdown-item href="#" disabled>-->
<!--                Sign Out-->
<!--              </b-dropdown-item>-->
<!--            </b-nav-item-dropdown>-->
            <b-nav-item-dropdown right toggle-class="d-flex flex-row align-items-center">
              <template slot="button-content">
<!--                <fa :icon="['fas', 'user']" /> {{ userName | truncate(5) }}-->
                <template v-if="currentAddress">
                  <client-only>
                    <jazzicon :address="currentAddress" :diameter="24" />
                  </client-only>
                  <h6 class="my-0">{{ userName | truncate(10) }} <small>{{ userBalance }} {{ coinName(baseCoinDenom) }}</small></h6>
                </template>
                <template v-else>
                  LOGIN
                </template>
              </template>
              <template v-if="usersList.length">
                <b-dropdown-item-btn
                  v-for="u in usersList"
                  :key="`user_${u.address}`"
                  :active="u.active"
                  @click="setCurrentUser(u.address)"
                >
<!--                  <b>{{ u.name }}</b> <small>({{ u.address | collapse(8, 5) }} )</small>-->
                  <div class="d-flex flex-row justify-content-between">
                  <span><b>{{ u.name }}</b> <small>({{ u.address | collapse(8, 5) }} )</small></span>
                  <span>
                     <b-link v-b-tooltip.hover title="copy address" class="ml-1 text-info" @click.stop.prevent="copyAddress(u.address)">
                      <fa :icon="['fas', 'clone']" />
                    </b-link>
                    <b-link v-b-tooltip.hover title="edit user"  :to="localePath({ name: 'user-address', params: { address: u.address } })" class="ml-1 text-warning">
                       <fa :icon="['fas', 'edit']" />
                    </b-link>
                    <b-link v-b-tooltip.hover title="user logout"  class="ml-1 text-danger" @click.prevent="delUser(u.address)">
                      <fa :icon="['fas', 'sign-out-alt']" />
                    </b-link>
                  </span>
                  </div>
                </b-dropdown-item-btn>
                <b-dropdown-divider />
              </template>
              <template v-if="mockUsers.length">
                <b-dropdown-item disabled>Mock users</b-dropdown-item>
                <b-dropdown-item-btn v-for="(a, id) in mockUsers" :key="`mock_${id}`" @click="addMockUser(id)">
                  <fa :icon="['fas', 'plus']" /> {{ a.name }}
                </b-dropdown-item-btn>
                <b-dropdown-divider />
              </template>

<!--              <b-dropdown-item>-->
<!--                <div class="d-flex flex-row justify-content-between">-->
<!--                  <b-btn :to="localePath({ name: 'user-address' })" variant="success" size="sm">-->
<!--                     <fa :icon="['fas', 'plus']" /> Add new-->
<!--                  </b-btn>-->
<!--                  <b-btn :to="localePath({ name: 'user-address' })" variant="warning" size="sm" :disabled="!currentId">-->
<!--                       <fa :icon="['fas', 'edit']" /> Edit-->
<!--                  </b-btn>-->
<!--                  <b-btn :to="localePath({ name: 'user-address' })" variant="danger" size="sm" :disabled="!currentId" @click="delUser(id)">-->
<!--                       <fa :icon="['fas', 'trash']" /> Delete-->
<!--                  </b-btn>-->
<!--                </div>-->
<!--              </b-dropdown-item>-->
              <b-dropdown-item :to="localePath({ name: 'user-address' })" exact variant="success">
                <fa :icon="['fas', 'sign-in-alt']" /> login
              </b-dropdown-item>
              <template v-if="currentAddress">
                <b-dropdown-divider />
                <b-dropdown-item :to="localePath({ name: 'user-address', params: { address: currentAddress } })" exact variant="warning">
                  <fa :icon="['fas', 'edit']" /> details
                </b-dropdown-item>
                <b-dropdown-item variant="danger" @click="delCurrentUser">
                  <fa :icon="['fas', 'sign-out-alt']" /> log out
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
      // theme: null,
      // isDark: false,
      // themes: ['light', 'dark'],
      search: null
    }
  },
  computed: {
    ...mapState({
      mockUsers: state => state.config.mockUsers,
      baseCoinDenom: state => state.config.baseCoinDenom,
      currentAddress: state => state.user.currentAddress,
    }),
    // ...mapGetters(['getTheme']),
    ...mapGetters('user', ['currentUser', 'usersList']),
    ...mapGetters('config', ['coinImage', 'coinName']),
    userName() {
      return this.currentUser ? this.currentUser.name : ''
    },
    userBalance() {
      let val = 0
      if (this.currentUser && this.currentUser.coins && this.currentUser.coins.length) {
        val = this.currentUser.coins.find(x => x.denom === this.baseCoinDenom)
        val = val ? val.amount : 0
      }
      return val
    },
    isMyNftRoute() {
      return this.currentAddress && this.$route.query.owner && this.$route.query.owner === this.currentAddress
    },
    isMarketRoute() {
      return this.getRouteBaseName() === 'market' || this.getRouteBaseName() === 'market-item'
    },
  },
  // created() {
  //   // this.$root.$on('bv::scrollspy::activate', this.onActivate)
  //
  // },
  watch: {
    currentAddress(address) {
      if (address) {
        this.loadUserInfo({ address }).catch(this.alertError)
      }
    },
  },
  mounted() {
    // this.theme = this.getTheme
    this.loadLocalUsers()
  },
  methods: {
    // ...mapActions(['setTheme']),
    ...mapActions('user', ['delCurrentUser', 'setCurrentUser', 'addUser', 'loadLocalUsers', 'loadUserInfo', 'delUser']),

    addMockUser(id) {
      this.addUser({ ...this.mockUsers[id] })
        .then(address => {
          this.$bvModal.msgBoxOk('User added', { title: 'Success', okVariant: 'success' })
            .then(() => {
              this.setCurrentUser(address)
            })
        })
        .catch(err => {
          this.$bvModal.msgBoxOk(err, { title: 'Error', okVariant: 'danger' })
        })
    },
    // onActivate(target) {
    //   console.log('Received event: "bv::scrollspy::activate" for target ', target)
    // },
    //
    // handleScroll(evt, el, arg) {
    //   const h = 150
    //   const c = 'navbar-unshrink'
    //   if (window.scrollY > h) {
    //     if (el.classList.contains(c)) {
    //       el.classList.remove(c)
    //     }
    //   } else if (!el.classList.contains(c)) {
    //     el.classList.add(c)
    //   }
    //   return window.scrollY > h * 2
    // },
    copyAddress(address) {
      // console.log(evt, address)
      // const container = this.$refs[`fieldset-wallet-receive-${this.modalId}`]
      this.$copyText(address).then(
        e => {
          console.log('copied', e)
        },
        e => {
          alert('can not copy')
          console.log('can not copy', e)
        }
      )
    },
    doSearch() {
      // console.log(f)
      // console.log({ name: 'market', query: { q: this.search } })
      this.$router.push(this.localePath({ name: 'market', query: { q: this.search } }))
    },
  },
}
</script>

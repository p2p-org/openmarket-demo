<template>
  <market>
    <section v-if="currentUser" class="user">
      <b-card no-body class="py-3 mb-1">
        <b-container>
          <b-row>
            <b-col>
              <b-row>
                <b-col>
                  <div class="d-flex flex-row align-items-center">
                    <client-only>
                      <jazzicon :address="currentUser.address" :diameter="70" />
                    </client-only>
                    <h3 class="ml-3">
                      {{ currentUser.name }}
                      <br >
                      <small class="text-muted">
                        {{ currentUser.address }}
                      </small>
                    </h3>
                  </div>
                </b-col>
                <b-col lg="5" class="d-flex flex-column mt-2">
                  <h6 class="text-muted">{{ coinName(stakeCoinDenom) }} Balance</h6>
                  <div class="d-flex align-items-center">
                    <b-img :src="coinImage(stakeCoinDenom)" rounded="circle" width="25px" height="25px" />
                    <h5 class="ml-2 my-0">
                      {{ currentUserBalance(stakeCoinDenom) }}
                      <small>{{ coinName(stakeCoinDenom) }} <span class="text-muted">({{ stakeCoinDenom }})</span></small>
                    </h5>
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </b-card>
      <b-card no-body class="mb-3">
        <b-container>
          <b-navbar toggleable="lg" type="light" class="tool-bar">
            <b-navbar-toggle target="nav-collapse" />

            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-nav-item :to="localePath({ name: 'my' })" exact>
                  Balances
                </b-nav-item>
                <b-nav-item :to="localePath({ name: 'my-offers' })">
                  Offers
                </b-nav-item>
                <b-nav-item :to="localePath({ name: 'my-bids' })">
                  Bids
                </b-nav-item>
                <!--              <b-nav-item :to="localePath({ name: 'my-settings' })">Settings</b-nav-item>-->
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </b-container>
      </b-card>

      <nuxt-child />
    </section>
  </market>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Jazzicon from '~/components/Jazzicon'
import Market from '~/components/Market'
export default {
  name: 'PageMyAccount',
  components: {
    Market,
    Jazzicon,
  },
  data: () => ({
    busy: false,
  }),
  computed: {
    ...mapState({
      baseCoinDenom: state => state.config.baseCoinDenom,
      stakeCoinDenom: state => state.config.stakeCoinDenom,
    }),
    ...mapGetters('user', ['currentUser', 'currentUserBalance']),
    ...mapGetters('config', ['coinImage', 'coinName']),
    address() {
      return this.$route.params.address !== null && typeof this.$route.params.address !== 'undefined' ? this.$route.params.address : null
    },
  },
  methods: {},
}
</script>

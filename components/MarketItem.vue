<template>
  <section class="market">
    <b-container>
      <b-row>
        <b-col md="4">
          <b-card :img-src="meta.image" :img-alt="meta.title" img-top class="mb-3">
            <b-card-body>
            <div class="mb-4">
              <b>BlockRobots</b>
            </div>
              <h5 class="mb-3"><b>{{ meta.title }}</b></h5>
            <p>CryptoKitties is one of the world’s first games to be built on blockchain technology—the same breakthrough that makes things like Bitcoin and Ethereum possible.
            <b-link>Read more</b-link></p>
            <!--              <template v-slot:footer>-->
            <!--              </template>-->
            </b-card-body>
          </b-card>
        </b-col>
        <b-col>
          <b-card class="mb-3 p-2">
            <b-row>
              <b-col md="6" class="d-flex flex-column pr-4">
                <div class="label  mb-1">Listed for</div>
                <h3 class="my-2">{{ priceExt.value }} {{ priceExt.currency }}</h3>
                <h3><small class="text-muted">{{ priceEth }} ETH</small></h3>
                <b-btn variant="primary" class="mt-3 py-3">
                  Buy
                  <!--                    <b-spinner v-if="nft.id === processedId" small type="grow"></b-spinner>-->
                </b-btn>
              </b-col>
              <b-col md="6" class="d-flex flex-column p-2">
                <div class="label mb-1">Owner</div>
                <div class="">
                  <b-img v-bind="mainProps" rounded="circle" alt="Circle image"></b-img>
                  <b>BRfighter </b>
                  <b-link>34 items for sale</b-link>
                </div>
                <div class="label  mb-1 mt-3">Last sold</div>
                <div class="">
                  24 jul 2019 for <b>1804 USD</b>
                </div>
              </b-col>
            </b-row>
          </b-card>
          <h5 class="subtitle mt-3">Properties</h5>
          <b-row>
            <b-col md="6">
              <b-card bg-variant="primary" class="mb-3 px-2">
               <div class="title mb-5">Number of parcel to district</div>
                <div class="mt-5">
                <span class="value">10</span><span class="total">of 100</span>
                </div>
              </b-card>
            </b-col>
            <b-col md="6">
              <b-card bg-variant="success" class="mb-3 px-2">
                <div class="title mb-5">Number of parcel to district</div>
                <div class="mt-5">
                  <span class="value">10</span><span class="total">of 100</span>
                </div>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-card bg-variant="warning" class="mb-3 px-2">
                <div class="title mb-5">Number of parcel to district</div>
                <div class="mt-5">
                  <span class="value">10</span><span class="total">of 100</span>
                </div>
              </b-card>

            </b-col>
            <b-col md="6">
              <b-card bg-variant="secondary" class="mb-3 px-2">
                <div class="title mb-5">&nbsp;</div>
                <div class="mt-5">
                  <span class="value">&nbsp;</span><span class="total"></span>
                </div>
              </b-card>

            </b-col>
          </b-row>
          <h5 class="subtitle mt-3">Properties</h5>
          <b-row>
            <b-col md="6">
              <b-card bg-variant="danger" class="mb-3 px-2">
                <div class="title mb-5">Number of parcel to district</div>
                <div class="mt-5">
                  <span class="value">10</span><span class="total">of 100</span>
                </div>
              </b-card>

            </b-col>
            <b-col md="6">
              <b-card bg-variant="info" class="mb-3 px-2">
                <div class="title mb-5">&nbsp;</div>
                <div class="mt-5">
                  <span class="value">&nbsp;</span><span class="total"></span>
                </div>
              </b-card>

            </b-col>
          </b-row>
          <h5 class="subtitle mt-3">Statistics</h5>
          <b-row>
            <b-col>
              <b-card no-body>
              <b-table striped hover :items="items"></b-table>
              </b-card>

            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'MarketItem',
  props: {
    nft: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      mainProps: { blank: true, blankColor: '#777', width: 50, height: 50, class: 'm1' },
      items: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
    }
  },
  computed: {
    ...mapGetters(['getTheme']),
    meta() {
      return this.nft.meta
    },
    priceExt() {
      const m = this.nft.price.match(/([\d.]+)([\w]+)/i)
      return m ? { value: m[1], currency: m[2] } : { value: this.nft.price, currency: '' }
    },
    priceEth() {
      return (parseFloat(this.priceExt.value) / this.rate).toFixed(5)
    },
  },
  mounted() {
    console.log(this.nft)
  },
  methods: {

  }
}
</script>

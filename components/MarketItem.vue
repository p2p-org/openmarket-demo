<template>
  <section class="market">
    <b-container>
      <b-row v-if="nft">
        <b-col md="4">
          <b-card :img-src="image" :img-alt="title" img-top class="mb-3">
            <b-card-body>
            <div class="mb-4">
              <b>{{ collection }}</b>
            </div>
              <h5 class="mb-3"><b>{{ title }}</b></h5>
            <p>{{ description }}
            <b-link :href="link">Read more</b-link></p>

<!--              <template v-for="stat in stats">-->
<!--                <h5 class="mt-3">{{ stat.trait.toUpperCase() }}</h5>-->
<!--                &lt;!&ndash;              height="0.2rem"&ndash;&gt;-->
<!--                <b-progress :value="stat.value" :max="stat.options.max" :min="stat.options.min" show-progress></b-progress>-->
<!--              </template>-->
              <template v-for="rank in ranks">
                <h5 class="mt-3">{{ rank.trait.toUpperCase() }}</h5>
                <!--              height="0.2rem"-->
                <b-progress :value="rank.value" :max="rank.options.max" :min="rank.options.min" show-progress></b-progress>
              </template>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col>
          <b-card v-if="nft.status === 1" class="mb-3 p-2">
            <b-row>
              <b-col md="6" class="d-flex flex-column pr-4">
                <div class="label mb-1">Fixed price</div>
                <div class="d-flex justify-content-middle align-items-center">
                  <b-img :src="currencyImage" rounded="circle" width="33px" height="33px"></b-img>
                  <h1 class="ml-2 my-0"><b>{{ price.value }}</b> {{ price.currency }}</h1>
                </div>

                <h3><small v-if="price.value"  class="text-muted">{{ priceEth(price.value) }} ETH</small></h3>
                <b-btn variant="primary" class="mt-3 py-3">
                  Buy
                  <!--                    <b-spinner v-if="nft.id === processedId" small type="grow"></b-spinner>-->
                </b-btn>
              </b-col>
              <b-col md="6" class="d-flex flex-column p-2">
                <div class="label mb-1">Owner</div>
                <div class="">
                  <client-only>
                    <jazzicon :address="ownerAddress" :diameter="35" />
                  </client-only>
                  <b>{{ ownerName }}</b>
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
import Jazzicon from './Jazzicon'

export default {
  name: 'MarketItem',
  components: {
    Jazzicon,
  },

  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      rate: 123123,
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
    ...mapState({
      accounts: state => state.user.accounts,
    }),
    ...mapGetters('market', ['findNft']),
    nft() {
      return this.findNft(this.id)
    },

    label1() {
      switch (this.nft.status) {
        case 1:
          return 'Fixed price'
        case 2:
          return 'Auction'
        default:
          return ''
      }
    },
    propLevel() {
      let p  = this.nftMetaProp(this.nft.meta, 'level')
      console.log(p)
      return this.nftMetaProp(this.nft.meta, 'level')
    },
    stats() {
      return this.nftMetaDisplay(this.nft.meta, 'stat', false)
    },
    ranks() {
      return this.nftMetaDisplay(this.nft.meta, 'rank', false)

    },
    title() {
      return this.nftMetaDisplay(this.nft.meta, 'title').value
    },
    image() {
      return this.nftMetaDisplay(this.nft.meta, 'image').value
    },
    link() {
      return this.nftMetaDisplay(this.nft.meta, 'link').value
    },
    description() {
      return this.nftMetaDisplay(this.nft.meta, 'description').value
    },
    collection() {
      console.log(this.propLevel)
      return this.nftMetaDisplay(this.nft.meta, 'collection').value
    },

    price() {
      return this.nft.price
    },
    openinigPrice() {
      return this.nft.opening_price
    },
    status() {
      return this.nft.status
    },
    owned() {
      return this.nft.owner_address === this.buyer
    },
    ownerAddress() {
      return this.nft.owner_address
    },
    ownerName() {
      return this.accounts.find(a => a.address === this.nft.owner_address).name || '<unknown>'
    },

    currencyImage() {
      switch (this.price.currency) {
        case 'btc':
          return '/images/currency_btc.png'
        default:
          return '/images/currency_atom.png'
      }
    },

  },
  mounted() {
    this.queryNft({ forse: true, params: { tokenId: this.id } })
  },
  methods: {
    ...mapActions('market', ['queryNft']),

    priceEth(value) {
      return (parseFloat(value) / this.rate).toFixed(5)
    },
  }
}
</script>

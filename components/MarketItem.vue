<template>
  <section class="market">
    <b-container>
      <b-row v-if="nft">
        <b-col md="4">
          <b-card :img-src="image" :img-alt="title" img-top class="mb-3">
            <b-card-body>
              <div class="mb-4 d-flex justify-content-between">
                <b>{{ collection }}</b>
                <span class="text-muted">#{{ nft.token_id }}</span>
              </div>
              <h5 class="mb-3">
                <b>{{ title }}</b>
              </h5>
              <p>
                {{ description | truncate(100) }}
                <template v-if="description.length > 100">
                  <b-collapse :id="`descr_${nft.token_id}`" v-model="expandDescr" tag="span">
                    {{ description | truncate(-100, false) }}
                  </b-collapse>
                  <!--                  v-b-toggle="`descr_${nft.token_id}`"-->
                  <b-link
                    :class="expandDescr ? 'collapsed' : null"
                    :aria-expanded="expandDescr ? 'true' : 'false'"
                    :aria-controls="`descr_${nft.token_id}`"
                    @click.prevent="expandDescr = !expandDescr"
                  >
                    Read {{ expandDescr ? 'less' : 'more' }}
                  </b-link>
                </template>
              </p>

              <!--              <template v-for="stat in stats">-->
              <!--                <h5 class="mt-3">{{ stat.trait.toUpperCase() }}</h5>-->
              <!--                &lt;!&ndash;              height="0.2rem"&ndash;&gt;-->
              <!--                <b-progress :value="stat.value" :max="stat.options.max" :min="stat.options.min" show-progress></b-progress>-->
              <!--              </template>-->
              <template v-for="s in stats">
                <h5 class="mt-3">
                  {{ s.trait.toUpperCase() }}
                </h5>
                <!--              height="0.2rem"-->
                <b-progress :value="s.value" :max="s.options.max" :min="s.options.min" show-progress />
              </template>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col>
          <b-card class="mb-3 p-2 market-action">
            <!--            <b-row>-->
            <template v-if="owned">
              <template v-if="status === 1">
                <!--                  <b-row>-->
                <!--                  <b-col md="6" class="d-flex flex-column pr-4">-->
                <!--                    <div class="label mb-1">-->
                <!--                      Fixed price-->
                <!--                    </div>-->
                <!--                    <div class="d-flex justify-content-middle align-items-center">-->
                <!--                      <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />-->
                <!--                      <h1 class="ml-2 my-0">-->
                <!--                        <b>{{ price.value }}</b> {{ price.currency }}-->
                <!--                      </h1>-->
                <!--                    </div>-->
                <!--                    <h4 class="mt-1">-->
                <!--                      <small class="text-muted">{{ priceEth(price.value) }} ETH</small>-->
                <!--                    </h4>-->

                <!--                  </b-col>-->
                <!--                  <b-col md="6" class="d-flex flex-column p-2">-->
                <!--                    <b-btn variant="danger" size="lg" :disabled="busy" class="py-3" @click="doCancelFixed">-->
                <!--                      Cancel sell-->
                <!--                      <b-spinner v-if="busy" type="grow" />-->
                <!--                    </b-btn>-->

                <!--                    &lt;!&ndash;                    <div class="label  mb-1 mt-3">Last sold</div>&ndash;&gt;-->
                <!--                    &lt;!&ndash;                    <div class="">&ndash;&gt;-->
                <!--                    &lt;!&ndash;                      24 jul 2019 for <b>1804 USD</b>&ndash;&gt;-->
                <!--                    &lt;!&ndash;                    </div>&ndash;&gt;-->
                <!--                  </b-col>-->
                <!--                  </b-row>-->
                <form-item-cancel-sell :currency-image="currencyImage" :busy="busy" :rate="rate" :price="price" @submit="doCancelFixed" />
              </template>
              <template v-else-if="status === 2">
                <form-item-cancel-auction
                  :currency-image="currencyImage"
                  :busy="busy"
                  :rate="rate"
                  :price="openinigPrice"
                  @submit="doCancelAuction"
                />
              </template>
              <template v-else>
                <form-item-sell :currency-image="currencyImage" :busy="busy" :rate="rate" @submit="doSellFixed" />
              </template>
            </template>
            <template v-else>
              <template v-if="status === 1">
                <form-item-buy :currency-image="currencyImage" :busy="busy" :rate="rate" :price="price" @submit="doBuyFixed" />
                <form-item-owner :owner="owner" />
              </template>
              <template v-else-if="status === 2">
                <b-btn variant="info">
                  Place bid
                  <b-spinner v-if="busy" type="grow" />
                </b-btn>
              </template>
              <template v-else>
                <form-item-offer :currency-image="currencyImage" :rate="rate" :busy="busy" />
                <form-item-owner :owner="owner" />
              </template>
            </template>
            <!--            </b-row>-->
          </b-card>
          <b-card v-if="owned && status === 0" class="mb-3 p-2 market-action">
            <b-row>
              <b-col md="6" class="d-flex flex-column pr-4">
                <b-form-group class="my-0" label="Enter recipient address" label-class="pb-0">
                  <!--                  <b-form-select v-model="recipient" :options="usersList" size="lg"></b-form-select>-->
                  <b-form-input v-model="recipient" size="lg" />
                </b-form-group>
              </b-col>
              <b-col md="6" class="d-flex flex-column p-2">
                <b-btn variant="info" size="lg" :disabled="busy" class="py-3" @click="doTransfer">
                  Gift token
                  <b-spinner v-if="busy" type="grow" />
                </b-btn>
              </b-col>
            </b-row>
          </b-card>

          <h5 class="subtitle mt-3">
            Ranks
          </h5>
          <b-row>
            <b-col v-for="(r, i) in ranks" :key="i" md="6">
              <b-card :bg-variant="bgVar(i)" class="mb-3 px-2">
                <div class="title">
                  {{ mkTitle(r.trait) }}
                </div>
                <div class="mt-4">
                  <span class="value">{{ r.value }}</span
                  ><span class="total"> of max {{ r.options.max }}</span>
                </div>
              </b-card>
            </b-col>
          </b-row>
          <h5 class="subtitle mt-3">
            Properties
          </h5>
          <b-row>
            <b-col v-for="(p, i) in props" :key="i" md="6">
              <b-card :bg-variant="bgVar(i + 1)" class="mb-3 px-2">
                <div class="title">
                  {{ mkTitle(p.trait) }}
                </div>
                <div class="mt-4">
                  <span class="value">{{ p.value }}</span>
                </div>
              </b-card>
            </b-col>
          </b-row>
          <h5 class="subtitle mt-3">
            Sell history
          </h5>
          <b-row>
            <b-col>
              <b-card no-body>
                <b-table striped hover :items="items" />
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
import FormItemOffer from './form/ItemOffer'
import FormItemSell from './form/ItemSell'
import FormItemOwner from './form/ItemOwner'
import FormItemCancelSell from './form/ItemCancelSell'
import FormItemBuy from './form/ItemBuy'
import FormItemCancelAuction from './form/ItemCancelAuction'

export default {
  name: 'MarketItem',
  components: {
    FormItemCancelAuction,
    FormItemBuy,
    FormItemCancelSell,
    FormItemOwner,
    FormItemSell,
    FormItemOffer,
  },

  props: {
    // id: {
    //   type: String,
    //   default: null,
    // },
    nft: {
      type: Object,
      default: null,
    },
    rate: {
      type: Number,
      default: 1,
    },
    // busy: {
    //   type: Boolean,
    //   default: false,
    // },
    // buyer: {
    //   type: String,
    //   default: null,
    // },
  },
  data() {
    return {
      items: [
        { date: '2019-09-01', user: 'user1', price: '10token' },
        { date: '2019-09-02', user: 'user2', price: '20token' },
        { date: '2019-09-03', user: 'user3', price: '30token' },
        { date: '2019-09-04', user: 'user4', price: '40token' },
        { date: '2019-09-05', user: 'user5', price: '50token' },
      ],
      sellPrice: '1',
      offerPrice: '1',
      recipient: null,
      currency: 'token',
      busy: false,
      owner: null,
      expandDescr: false,
    }
  },
  computed: {
    ...mapState({
      users: state => state.user.users,
      // nfts: state => state.market.nfts,
    }),
    ...mapGetters('user', ['currentUser']),

    // nft() {
    //   return this.findNft(this.id)
    // },

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
      // const p = this.nftMetaProp(this.nft.meta, 'level')
      // console.log(p)
      return this.nftMetaProp(this.nft.meta, 'level')
    },
    props() {
      // const p = this.nftMetaProp(this.nft.meta, 'level')
      // console.log(p)
      return this.nftMetaDisplay(this.nft.meta, null, false)
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
      return this.nft.owner.address === this.buyer
    },
    currencyImage() {
      switch (this.currency) {
        case 'btc':
          return '/images/currency_btc.png'
        default:
          return '/images/currency_atom.png'
      }
    },

    usersList() {
      return [{ value: null, text: '- select -', disabled: true }].concat(
        this.users.filter(u => u.address !== this.buyer).map(u => ({ value: u.address, text: u.name }))
      )
    },
    buyer() {
      return this.currentUser ? this.currentUser.address : null
    },
  },
  watch: {
    nft(nft) {
      if (nft) {
        this.queryUser({ address: nft.owner.address }).then(user => {
          this.owner = user
        })
      }
    },
  },
  mounted() {
    if (this.nft) {
      this.queryUser({ address: this.nft.owner.address }).then(user => {
        this.owner = user
      })
    }
  },
  methods: {
    ...mapActions('market', ['queryNft', 'nftSellFixed', 'nftCancelFixed', 'nftBuyFixed', 'nftTransfer', 'queryUser', 'nftCancelAuction']),
    ...mapActions('user', ['loadCurrentUserInfo']),

    bgVar(i) {
      switch (i % 4) {
        case 0:
          return 'primary'
        case 1:
          return 'success'
        case 2:
          return 'warning'
        case 3:
          return 'danger'
        default:
          return 'info'
      }
    },
    mkTitle(str) {
      str = str.toLowerCase().split('_')
      const final = []
      for (const word of str) {
        final.push(word.charAt(0).toUpperCase() + word.slice(1))
      }
      return final.join(' ')
    },
    priceEth(value) {
      const v = parseFloat(value)
      return v ? (v / this.rate).toFixed(5) : '0.00000'
    },
    doSellFixed({ price }) {
      this.busy = true
      this.$bvModal.msgBoxConfirm('Confirm sell?').then(value => {
        if (value) {
          this.nftSellFixed({
            user: this.currentUser,
            token: {
              id: this.nft.token_id,
              price,
            },
          })
            .then(r => {
              this.handleOk(this.nft.token_id, 'NFT Listed for Fixed Price', r)
            })
            .catch(this.handleErr)
        } else {
          this.busy = false
        }
      })
    },
    doBuyFixed() {
      // this.$emit('buyFixed')

      this.busy = true

      this.$bvModal.msgBoxConfirm('Confirm buy?').then(value => {
        if (value) {
          this.nftBuyFixed({
            user: this.currentUser,
            token: {
              id: this.nft.token_id,
              price: this.sellPrice,
            },
          })
            .then(r => {
              this.handleOk(this.nft.token_id, 'Yep, you bought it!', r).then(() => {
                this.loadCurrentUserInfo()
              })
            })
            .catch(this.handleErr)
        } else {
          this.busy = false
        }
      })
    },
    doCancelFixed() {
      this.$emit('cancelFixed')
      this.busy = true
      this.$bvModal.msgBoxConfirm('Confirm cancel sell?').then(value => {
        if (value) {
          this.nftCancelFixed({
            user: this.currentUser,
            token: {
              id: this.nft.token_id,
            },
          })
            .then(r => {
              this.handleOk(this.nft.token_id, 'NFT Unlisted', r)
            })
            .catch(this.handleErr)
        } else {
          this.busy = false
        }
      })
    },
    doCancelAuction() {
      this.$emit('cancelAuction')
      this.busy = true
      this.$bvModal.msgBoxConfirm('Confirm cancel auction?').then(value => {
        if (value) {
          this.nftCancelAuction({
            user: this.currentUser,
            token: {
              id: this.nft.token_id,
            },
          })
            .then(r => {
              this.handleOk(this.nft.token_id, 'NFT Unlisted', r)
            })
            .catch(this.handleErr)
        } else {
          this.busy = false
        }
      })
    },
    doTransfer() {
      this.busy = true
      this.$bvModal.msgBoxConfirm('Confirm transfer?').then(value => {
        if (value) {
          this.nftTransfer({
            user: this.currentUser,
            recipient: this.recipient,
            token: {
              id: this.nft.token_id,
            },
          })
            .then(r => {
              this.handleOk(this.nft.token_id, 'NFT Transfered', r)
            })
            .catch(this.handleErr)
        } else {
          this.busy = false
        }
      })
    },
    handleOk(tokenId, msg, r) {
      return new Promise(resolve => {
        console.log(r)
        // todo tx await
        setTimeout(() => {
          this.queryNft({ force: true, params: { tokenId } }).then(r => {
            this.busy = false
            resolve()
          })
          this.$bvModal.msgBoxOk(msg, { okVariant: 'success' })
        }, 2000)
      })
    },
    handleErr(e) {
      this.busy = false
      this.$bvModal.msgBoxOk(e.message, { title: 'Error', okVariant: 'danger' })
    },
  },
}
</script>

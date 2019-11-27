<template>
  <b-form novalidate @submit.prevent="submit" @reset.stop.prevent="reset">
    <b-row>
      <b-col md="6" class="d-flex flex-column pr-2">
        <b-form-group class="my-0" label="Opening price" label-class="pb-0">
          <div class="d-flex align-items-center">
            <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
            <h1 class="ml-2 my-0">
              <b>{{ openingPrice.value }}</b> {{ openingPrice.currency }}
            </h1>
          </div>
          <h4 class="mt-1">
            <small class="text-muted">{{ openingPrice.value | priceEth(rate) }}</small>
          </h4>
        </b-form-group>
      </b-col>
      <b-col md="6" class="d-flex flex-column pl-2">
        <b-form-group class="my-0" label="Ends" label-class="pb-0">
          <div class="d-flex align-items-end ">
            <h1 class="ml-2 my-0">
              {{ $dayjs().to(ends) }}
            </h1>
          </div>
          <h4 class="mt-1">
            <small class="text-muted">{{ ends.format('D MMM YYYY HH:mm:ss UTC') }}</small>
          </h4>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col md="6" class="d-flex flex-column pr-2">
        <b-form-group class="my-0" label="Highest bid / bids count" label-class="pb-0">
          <div class="d-flex align-items-center">
            <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
            <h1 class="ml-2 my-0">
              <b>{{ highestBid.value }}</b> {{ highestBid.currency }} <small>/ {{ bidsCnt }}</small>
            </h1>
          </div>
          <h4 class="mt-1">
            <small class="text-muted">{{ highestBid.value | priceEth(rate) }}</small>
          </h4>
        </b-form-group>
      </b-col>
      <b-col md="6" class="d-flex flex-column pl-2">
        <b-form-group class="my-0" label="Buyout price" label-class="pb-0">
          <div class="d-flex align-items-center">
            <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />
            <h1 class="ml-2 my-0">
              <b>{{ buyoutPrice.value }}</b> {{ buyoutPrice.currency }}
            </h1>
          </div>
          <h4 class="mt-1">
            <small class="text-muted">{{ buyoutPrice.value | priceEth(rate) }}</small>
          </h4>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col md="6" class="d-flex flex-column pr-2">
<!--        <b-form-group class="my-0" label="Auction opening price" label-class="pb-0">-->
<!--          <div class="d-flex justify-content-middle align-items-center">-->
<!--            <b-img :src="currencyImage" rounded="circle" width="33px" height="33px" />-->
<!--            <h1 class="ml-2 my-0">-->
<!--              <b>{{ price.value }}</b> {{ price.currency }}-->
<!--            </h1>-->
<!--          </div>-->
<!--          <h4 class="mt-1">-->
<!--            <small class="text-muted">{{ price.value | priceEth(rate) }}</small>-->
<!--          </h4>-->
<!--        </b-form-group>-->
        <b-btn variant="primary" size="lg" :disabled="busy" type="submit">
          Finish auction
          <b-spinner v-if="busy" type="grow" small/>
        </b-btn>
      </b-col>
      <b-col md="6" class="d-flex flex-column pl-2">
        <b-btn variant="danger" size="lg" :disabled="busy" type="reset">
          Cancel auction
          <b-spinner v-if="busy" type="grow" small/>
        </b-btn>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
export default {
  name: 'FormItemCancelAuction',
  props: {
    currencyImage: {
      type: String,
      default: null,
    },
    rate: {
      type: Number,
      default: 1,
    },
    busy: {
      type: Boolean,
      default: false,
    },
    openingPrice: {
      type: Object,
      default: null,
    },
    highestBid: {
      type: Object,
      default: null,
    },
    bidsCnt: {
      type: Number,
      default: 0,
    },
    buyoutPrice: {
      type: Object,
      default: null,
    },
    ends: {
      type: Object,
      default: null,
    },

  },
  methods: {
    submit() {
      this.$emit('submit')
    },
    reset() {
      this.$emit('reset')
    },
  },
}
</script>

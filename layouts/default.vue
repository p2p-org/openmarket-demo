<template>
  <div :class="getTheme">
    <page-header />
    <nuxt />
    <!--    <page-footer />-->
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import PageHeader from '~/components/Header'
// import PageFooter from '~/components/Footer'

export default {
  name: 'Layout',
  components: {
    PageHeader,
    // PageFooter,
  },

  data: () => ({

  }),
  computed: {
    ...mapGetters(['getTheme']),
  },
  mounted() {
    // const cosmos = this.$cosmos.network(this.lcdUrl, this.chainId)

    // const mnemonic = this.users[0].mnemonic
    // cosmos.setPath("m/44'/118'/0'/0/0")
    // const address = cosmos.getAddress(mnemonic)
    // console.log(address, this.users[0].address)
    // const ecpairPriv = cosmos.getECPairPriv(mnemonic)
    // console.log(ecpairPriv)

    // cosmos.getAccounts(address).then(data => {
    //   console.log(data)
      // let stdSignMsg = cosmos.NewStdMsg({
      //   type: "cosmos-sdk/MsgSend",
      //   from_address: address,
      //   to_address: "cosmos18vhdczjut44gpsy804crfhnd5nq003nz0nf20v",
      //   amountDenom: "uatom",
      //   amount: 100000,
      //   feeDenom: "uatom",
      //   fee: 5000,
      //   gas: 200000,
      //   memo: "",
      //   account_number: data.value.account_number,
      //   sequence: data.value.sequence
      // });
      // console.log('t',stdSignMsg)
      // const signedTx = cosmos.sign(stdSignMsg, ecpairPriv);
      // console.log('s1',signedTx)
      // let s = sign(stdSignMsg, this.wallet, data.value)
      // console.log(s)
      // this.buyTx = createSignedTx(this.buyTx, s)
      // ...
    // })


  },
  methods: {
  },
}
</script>

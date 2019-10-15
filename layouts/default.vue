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
    users: [
      {
        name: 'user1',
        address: 'cosmos1amq4re3e3frxwkxvzakvlcwxqvks8z82lfj5cz',
        pubkey: 'cosmospub1addwnpepq04z3lzdn0lvwkpj8vns0errx84lmuq62xwqhar6d4crtjqxhgwrzm6zzlw',
        mnemonic:
          'vessel gown accident found sunny tag purity few ivory raccoon outdoor syrup split sail confirm photo match image craft van easy catalog ritual deal',
      },
      {
        name: 'user2',
        address: 'cosmos17m233h609gmqmfupd3rh6tarynp3vlw0yew04c',
        pubkey: 'cosmospub1addwnpepqdc4s2rfeyydy5hyaetc6hxw78rcvpddhh5sun9rrhus483vqvc2vcszr7p',
        mnemonic:
          'around law congress language tomorrow rabbit slot latin situate you true noodle visit advance midnight give rapid garlic frozen misery meadow choice nest federal',
      },
      {
        name: 'sellerBeneficiary',
        address: 'cosmos1y7n4zxqlcemp3a3v9ng9xw8v63qc4qhxgs6jju',
        pubkey: 'cosmospub1addwnpepqfk2t6u5mgradqckyuqw6uzu4zuwch8j0nva49p9emyrfprv4w86vevjeg2',
        mnemonic:
          'summer left spot salad motion snack hover repeat grunt general learn rigid dust own easy toilet list impulse carry approve rookie erode piece zero',
      },
      {
        name: 'buyerBeneficiary',
        address: 'cosmos1numt3hqj5flqep2qwsr8ca2d7fc4f44wu8p2fz',
        pubkey: 'cosmospub1addwnpepqf7ljd7nd4q3cnt2fc4wtyuzpszk3gz9u5z55n8kq32xsjdsv7kk7axex4w',
        mnemonic:
          'kid walnut income volume frozen woman put artist visual lounge august choose park love door pistol myth author sweet valve letter flavor visit surprise',
      },
      {
        name: 'dgaming',
        address: 'cosmos1v7n3cq45cugchcdd4g45gasfj04m32kfgsn27a',
        pubkey: 'cosmospub1addwnpepqfqq6spq9zcd9f9klz7jk4ul2sezvdyumw5gang43a9k489wsjad2hjrc09',
        mnemonic:
          'trouble outside casino sock holiday upon paddle way typical gather ladder depth skirt mistake attack host brother ahead solution pig spot zero convince rocket',
      },
    ],
  }),
  computed: {
    // ...mapState({
    //   user: (state) => state.user.user,
    // }),
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
    // ...mapActions('user', ['logout']),
  },
}
</script>

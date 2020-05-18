const { createBroadcastTx } = require('@tendermint/sig')
const Amino = require('@tendermint/amino-js');
const { bytesToBase64 } = require('@tendermint/belt');
const util = require('util')
const { marshalTx, unmarshalTx } = require('@tendermint/amino-js')
const { OpenMarketAPI, OpenMarketTxAPI, OpenMarketTxMsgs } = require('../openmarket-sdk')

const a = {
  type: 'cosmos-sdk/StdTx',
  value: {
    msg: [
      {
        type: 'ibc/transfer/MsgTransfer',
        value: {
          source_port: 'transfer',
          source_channel: 'ibconexfer',
          destination_height: '557',
          amount: [
            {
              denom: 'transfer/ibczeroxfer/n0token',
              amount: '10000',
            },
          ],
          sender: 'cosmos13k6327pgnh6kwjxv5vckm27t5w2u29y276u4ld',
          receiver: 'cosmos1qmax0l9gft28chz2hgahsxc36nqgwlp3un604q',
        },
      },
    ],
    fee: {
      amount: [{ denom: 'stake', amount: '5000' }],
      gas: '200000',
    },
    signatures: null,
    memo: '',
  },
}

const b = {
  type: 'cosmos-sdk/StdTx',
  value: {
    msg: [
      {
        type: 'marketplace/transfer/MsgTransfer',
        value: {
          source_port: 'transfernft',
          source_channel: 'ibconexfernft',
          destination_height: '250',
          id: 'token',
          denom: 'transfernft/ibczeroxfernft/denom',
          sender: 'cosmos1nguf2yzhmvndl8f5vdsujfndpvj6rrj9wnvw5z',
          receiver: 'cosmos1gnuckg7urh83wwhkr3l52ekl4786t0y6y4wpy3',
        },
      },
    ],
    fee: {
      amount: [{ denom: 'stake', amount: '5000' }],
      gas: '200000',
    },
    signatures: null,
    memo: '',
  },
}

let users = [
  {
    name: 'user1',
    mnemonic:
      'hawk above capital clock wage crew now essence typical fish pave pluck garden half isolate swarm pluck subway dignity flight bone capital scrap choose',
  },
  {
    name: 'user2',
    mnemonic:
      'matter learn fall finish reunion result obtain fiscal picture afford arrange dignity air banana ketchup glad option cricket embrace infant album wagon wage razor',
  },
]

const tx0 = new OpenMarketTxAPI({
  lcdUrl: 'http://localhost:1317',
  chainId: 'ibc0',
  useStdTxs: true,
})

const tx1 = new OpenMarketTxAPI({
  lcdUrl: 'http://localhost:1318',
  chainId: 'ibc1',
})

const msgs = OpenMarketTxMsgs

users = users.map((u) => ({
  ...u,
  wallet: tx0.getWallet(u.mnemonic),
}))

// console.log(users[0])

const u1 = users[0]
const u2 = users[1]

const main = async () => {
  const a = await tx0.getAccounts(u1.wallet.address)
  const height = a.height
  const signMeta = {
    account_number: a.result.value.account_number,
    chain_id: 'ibc0',
    sequence: a.result.value.sequence
  }
  console.log(signMeta)
  let b1 = await tx0.getBalances(u1.wallet.address)
  // let b2 = await tx0.getBalances(u2.address)
  console.log(a)
  console.log(b1)
  // console.log(b2)

  // const signMsg = msgs.NewMsgTransferFungibleTokens({
  //   owner: u1.wallet.address,
  //   recipient: u2.wallet.address,
  //   denom: 'token',
  //   amount: "22222",
  //
  //   // this part is necessary
  //   fee: 0,
  //   gas: '200000',
  //   memo: '',
  // })

  // const signMsg = msgs.NewMessageMintNFT({
  //   sender: u1.wallet.address,
  //   recipient: u1.wallet.address,
  //   token_id: 'TOKEN_123',
  //   denom: 'denom1',
  //   token_uri: 'someURI',
  //
  //   // this part is necessary
  //   fee: 0,
  //   gas: '200000',
  //   memo: '',
  //   // chain_id: 'ibc0',
  //   // account_number: a.account_number,
  //   // sequence: a.sequence,
  // })

  const signMsg = msgs.NewMsgIBCTransferFungibleTokens({
    sender: u1.wallet.address,
    receiver: u2.wallet.address,
    denom: 'transfer/ibczeroxfer/token',
    amount: "22222",

    sourceChannel: 'ibconexfer',
    destHeight: height,

    // this part is necessary
    fee: 0,
    gas: '200000',
    memo: '',
  })

  // const signMsg = msgs.NewMsgIBCTransferNFT({
  //   sender: u1.wallet.address,
  //   receiver: u1.wallet.address,
  //   denom: 'transfernft/ibczeroxfernft/denom1',
  //   id: 'TKN_1',
  //   sourceChannel: 'ibconexfernft',
  //   destHeight: height,
  //
  //   // this part is necessary
  //   fee: 0,
  //   gas: '200000',
  //   memo: '',
  // })

  const signedTx = tx0.sign(signMsg, u1.wallet, signMeta)

  console.dir(signedTx, { depth: null })

  // console.log(JSON.stringify(signedTx))
  const t = createBroadcastTx(signedTx)
  // console.dir(t, { depth: null })
  console.log(JSON.stringify(t, null, 4))

  // console.log(Amino.marshalTx(tx))
  // const k = Amino.marshalPubKey({
  //   'type':  'tendermint/PubKeySecp256k1',
  //   'value': 'AtQaCqFnshaZQp6rIkvAPyzThvCvXSDO+9AzbxVErqJP'
  // })
  // console.log(bytesToBase64(k))
  // const t2 = {
  //   // "mode": modeType,
  //   type: 'cosmos-sdk/StdTx',
  //   value: signedTx,
  // }
  // console.log(signedTx.signatures[0].pub_key)

  // const r = Amino.encodePubKey(signedTx.signatures[0].pub_key.value)
  // console.dir(r, { depth: null })
  const tx1 = await tx0.broadcast(signedTx)
  console.log(tx1)

  // b1 = await tx0.getBalances(u1.address)
  // b2 = await tx0.getBalances(u2.address)
  // console.log(b1, b2)
}
main().then(() => {
  process.exit(0)
})

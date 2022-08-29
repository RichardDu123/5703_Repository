<template>
  <div v-if="!isETHLoaded">Wrong Network!</div>
  <div v-else>
    Your current account:
    {{ accounts ? accounts[0] : 'no account' }}
    <br />
    item name:
    <input type="text" v-model="itemName" />
    item price:
    <input type="text" v-model="itemPrice" />
    <button @click="handleSubmit">submit</button>
    <br />
    Please send {{ itemPrice }} Wei to "{{ itemName }}" Item Address:
    {{ itemAddress }}
  </div>
</template>

<script lang="ts" setup>
import { useETHStore } from '@/store'
import { onUnmounted, ref } from 'vue'
const store = useETHStore()
const accounts = store.accounts
const contract = store.contract
const itemName = ref('name')
const itemPrice = ref(0)
const itemAddress = ref('unknown')
const handleSubmit = async () => {
  console.log(itemPrice.value)
  if (contract && accounts) {
    //sell
    let result = await contract.methods
      .createItem(itemName.value, itemPrice.value)
      .send({ from: accounts[0] })
    itemAddress.value = result.events.SupplyChainStep.returnValues._address
  }
}

//处理网络切换逻辑
const isETHLoaded = store.isWeb3Load

//buy
let subscribe: any
if (contract) {
  subscribe = contract.events.SupplyChainStep().on('data', (e: any) => {
    if (e.returnValues._step === '1') {
      contract.methods
        .items(e.returnValues._itemIndex)
        .call()
        .then((result: any) => {
          subscribe = result
        })
      alert('Item ' + ' was paid, deliver it now!')
    }
  })
}
onUnmounted(() => {
  subscribe?.unsubscribe()
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

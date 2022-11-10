<template>
  <div class="buyContainer">
    <h2>My Portfolio</h2>
    <CurrentPanel class="panel" />
    <PlusBtn type="buy" />
    <p>Real Time Unit Price for Buy Posts: {{ Math.round(+price) }} Wei</p>
    <el-button
      type="primary"
      :icon="RefreshLeft"
      class="refresh"
      @click="refresh"
      :loading="isLoading"
    />
    <h3>Buyer List</h3>
    <BuyerList />
  </div>
</template>

<script setup lang="ts">
import CurrentPanel from '@/components/currentPanel.vue'
import BuyerList from './components/buyerList.vue'
import PlusBtn from '../../components/plusBtn.vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import { useETHStore } from '@/store'
import { Contract } from 'web3-eth-contract'
import { getBuyPrice, updateBuyPrice } from '@/api/mainSys'
import { ref } from 'vue'
const ETHStore = useETHStore()
const contract = ETHStore.contract as Contract
const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
const price = ref('')
const isLoading = ref(false)
getBuyPrice(contract, address).then((val) => {
  price.value = val
})
const refresh = () => {
  isLoading.value = true
  updateBuyPrice(contract, address)
    .then(() => {
      getBuyPrice(contract, address).then((val) => {
        price.value = val
        isLoading.value = false
      })
    })
    .catch(() => {
      isLoading.value = false
    })
}
</script>

<style scoped lang="less">
.buyContainer {
  text-align: left;
  padding: 0 42px;
  position: relative;
  h2 {
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 31px;
  }
  .panel {
    margin: auto;
    width: 631px;
    height: 146px;
    margin-top: 46px;
  }
  h3 {
    margin-top: 40px;
  }
  p {
    position: absolute;
    top: 280px;
    font-family: 'Abel';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
  }
  .refresh {
    position: absolute;
    top: 250px;
  }
}
</style>

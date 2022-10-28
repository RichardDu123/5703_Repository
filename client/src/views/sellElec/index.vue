<template>
  <div class="sellContainer">
    <h2>My Portfolio</h2>
    <CurrentPanel cur-elec="2700" class="panel" />
    <PlusBtn type="sell" />
    <p>Real Time Unit Price for Sell Posts: {{ Math.round(+price) }} Wei</p>
    <el-button
      type="primary"
      :icon="RefreshLeft"
      class="refresh"
      @click="refresh"
    />
    <h3>Seller List</h3>
    <SellerList />
  </div>
</template>

<script setup lang="ts">
import SellerList from './components/sellerList.vue'
import PlusBtn from '../../components/plusBtn.vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import { useETHStore } from '@/store'
import { Contract } from 'web3-eth-contract'
import { getSellPrice, updateSellPrice } from '@/api/mainSys'
import { ref } from 'vue'
const ETHStore = useETHStore()
const contract = ETHStore.contract as Contract
const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
const price = ref('')
getSellPrice(contract, address).then((val) => {
  price.value = val
})
const refresh = () => {
  updateSellPrice(contract, address).then(() => {
    // getSellPrice(contract, address).then((val) => {
    //   price.value = val
    // })
  })
}
</script>

<style scoped lang="less">
.sellContainer {
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

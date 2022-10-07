<template>
  <div class="portfolioContainer">
    <h2>My Portfolio</h2>
    <section class="main">
      <CurrentPanel :cur-elec="UserStore.currElec" />
      <BottomPanel :total-buy="totalBuy" :total-sell="totalSell" />
    </section>
  </div>
</template>

<script setup lang="ts">
import CurrentPanel from '../../../components/currentPanel.vue'
import BottomPanel from '@/components/bottomPanel.vue'
import { useETHStore, useUserStore } from '@/store'
import {
  returnTotalBuyByAddress,
  returnTotalSellByAddress,
} from '@/api/mainSys'
import { Contract } from 'web3-eth-contract'
import { ref } from 'vue'
const UserStore = useUserStore()
const ETHStore = useETHStore()
const contract = ETHStore.contract as Contract
const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
const totalBuy = ref('')
const totalSell = ref('')
returnTotalBuyByAddress(contract, address).then((value) => {
  totalBuy.value = value
})
returnTotalSellByAddress(contract, address).then((value) => {
  totalSell.value = value
})
</script>

<style scoped lang="less">
.portfolioContainer {
  text-align: left;
  width: 800px;
  margin: auto;
  margin-top: 55px;
  padding: 0 50px;
  h2 {
    font-family: 'Abel';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 31px;
  }
  .main {
    width: 635px;
    margin: auto;
  }
}
</style>

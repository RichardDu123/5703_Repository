<template>
  <div class="accountsContainer">
    <el-tooltip
      :content="`Address: ${ETHStore.accounts ? ETHStore.accounts[0] : ''}`"
      placement="bottom"
    >
      <h3>Accounts</h3>
    </el-tooltip>
    <section>
      <el-tooltip :content="`In Wei: ${balanceInWei}`" placement="top">
        <span>{{ slicedBalanced }} ETH</span>
      </el-tooltip>
    </section>
  </div>
</template>

<script setup lang="ts">
import { toEther } from '@/api/basic'
import { useETHStore, useUserStore } from '@/store'
import { computed } from '@vue/reactivity'
import { ref, toRef, watchEffect } from 'vue'
import Web3 from 'web3'
//get current balance
const ETHStore = useETHStore()
const userStore = useUserStore()
const web3 = ETHStore.web3 as Web3
const balanceInWei = toRef(userStore, 'currWei')
const currBalance = ref('0')
const toE = () => {
  currBalance.value = toEther(web3, balanceInWei.value)
}
userStore.setWei()
const slicedBalanced = computed(() => {
  return parseFloat(currBalance.value).toFixed(2).toString()
})
//watchEffect会在加载时先调用一次toE
watchEffect(toE)
</script>

<style scoped lang="less">
.accountsContainer {
  margin-left: 24px;
  h3 {
    text-align: left;
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 31px;
  }
  section {
    width: 274px;
    height: 155px;
    border-radius: 24px;
    background-color: #4062ff;
    background-image: url('../../../assets/images/Maskgroup.png');
    span {
      line-height: 155px;
      font-style: normal;
      font-weight: 400;
      font-size: 24px;
      color: white;
    }
  }
}
</style>

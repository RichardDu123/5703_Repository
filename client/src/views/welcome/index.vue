<template>
  <div class="welcomeContainer">
    <TransactionPanel class="transacPanel" />
    <Portfolio />
  </div>
</template>

<script setup lang="ts">
import TransactionPanel from './components/transactionPanel.vue'
import Portfolio from './components/portfolio.vue'
</script>

<style scoped lang="less">
.welcomeContainer {
  overflow: hidden;
  background-color: #fcfdff;
  height: 968px;
  .transacPanel {
    margin-top: 112px;
    height: 244px;
  }
}
</style>

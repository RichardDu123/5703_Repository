<template>
  <div class="buyContainer">
    <h2>My Portfolio</h2>
    <CurrentPanel class="panel" />
    <PlusBtn type="buy" />
    <h3>Buyer List</h3>
    <BuyerList />
  </div>
</template>

<script setup lang="ts">
import CurrentPanel from '@/components/currentPanel.vue'
import BuyerList from './components/buyerList.vue'
import PlusBtn from '../../components/plusBtn.vue'
</script>

<style scoped lang="less">
.buyContainer {
  text-align: left;
  padding: 0 42px;
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
}
</style>

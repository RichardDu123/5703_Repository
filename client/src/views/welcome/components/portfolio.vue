<template>
  <div class="portfolioContainer">
    <h2>My Portfolio</h2>
    <section class="main">
      <CurrentPanel :cur-elec="UserStore.currElec" />
      <BottomPanel total-buy="0" total-sell="1700" />
    </section>
  </div>
</template>

<script setup lang="ts">
import CurrentPanel from '../../../components/currentPanel.vue'
import BottomPanel from '@/components/bottomPanel.vue'
import { useUserStore } from '@/store'
const UserStore = useUserStore()
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

<template>
  <div class="sellContainer">
    <h2>My Portfolio</h2>
    <CurrentPanel cur-elec="2700" class="panel" />
    <h3>Seller List</h3>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.sellContainer {
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
    margin-top: 83px;
  }
}
</style>

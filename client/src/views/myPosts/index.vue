<template>
  <div class="myPostsContainer">
    <h2>My Posts</h2>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="Buy" name="buy" class="panel">
        <MyBuyPosts
      /></el-tab-pane>
      <el-tab-pane label="Sell" name="sell" class="panel"
        ><MySellPosts
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MyBuyPosts from './myBuy/myBuyPosts.vue'
import MySellPosts from './mySell/mySellPosts.vue'

const activeName = ref('buy')
</script>

<style scoped lang="less">
.myPostsContainer {
  width: 900px;
  margin: auto;
  padding: 0 40px;
  h2 {
    margin-top: 41px;
    text-align: left;
    font-family: 'Abel';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 31px;
  }
  .demo-tabs {
    margin-top: 47px;
    :deep(.el-tabs__item) {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 21px;
    }
  }
  .panel {
    margin-top: 39px;
    height: 550px;
  }
}
</style>

<template>
  <div class="welcomeContainer">
    <section>
      <span>Buy and Sell Electricity Instant</span>
      <button class="buyBtn" @click="dialogFormVisible = true">Buy</button>
      <button class="sellBtn" @click="sellPostVisible = true">Sell</button>
    </section>
    <CreatePost v-model="dialogFormVisible" />
    <CreateSellPost v-model="sellPostVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import CreatePost from './createPost.vue'
import CreateSellPost from './createSellPost.vue'
const dialogFormVisible = ref(false)
const sellPostVisible = ref(false)
</script>

<style scoped lang="less">
.welcomeContainer {
  section {
    margin: auto;
    width: 719px;
    height: 244px;
    background: url('../../../assets/images/chargeLogo.png') no-repeat right
      center #4062ff;
    border-radius: 24px;
    text-align: left;
    overflow: hidden;
    box-shadow: 0px 0px 40px rgba(48, 73, 191, 0.04);
    span {
      display: block;
      width: 400px;
      font-weight: 400;
      font-size: 36px;
      color: white;
      margin-left: 40px;
      margin-top: 40px;
    }
    .buyBtn {
      .hoverShadow();
      width: 76px;
      height: 57px;
      background-color: #40baff;
      color: white;
      border-radius: 16px;
      margin-left: 40px;
      margin-top: 35px;
      cursor: pointer;
      &:hover {
        background-color: #72cbff;
      }
    }
    .sellBtn {
      .hoverShadow();
      width: 76px;
      height: 57px;
      background-color: #fff;
      color: black;
      border-radius: 16px;
      margin-left: 24px;
      margin-top: 35px;
      cursor: pointer;
      &:hover {
        background-color: #f6f6f6;
      }
    }
  }
}
</style>

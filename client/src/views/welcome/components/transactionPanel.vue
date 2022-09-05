<template>
  <div class="welcomeContainer">
    <section>
      <span>Buy and Sell Electricity Instant</span>
      <button class="buyBtn">Buy</button>
      <button class="sellBtn">Sell</button>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

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

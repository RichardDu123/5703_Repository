<template>
  <div class="accountsContainer">
    <h3>Accounts</h3>
    <section>
      <span>25000 ETH</span>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

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

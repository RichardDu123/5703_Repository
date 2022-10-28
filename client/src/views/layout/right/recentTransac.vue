<template>
  <section class="recentContainer">
    <h3>Recent Transactions</h3>
    <ul>
      <li v-for="(item, index) in recenTrsac" :key="index">
        <item-sell :type="item.type" :amount="item.amount" :time="item.time" />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
import { toRef } from 'vue'
import ItemSell from './itemSell.vue'
const UserStore = useUserStore()
const recenTrsac = toRef(UserStore, 'recentTransaction')
UserStore.setRecnetTransaction()
</script>

<style scoped lang="less">
.recentContainer {
  text-align: left;
  margin: 77px 14px 0 24px;

  h3 {
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 31px;
  }
  ul {
    height: 500px;
    overflow-y: scroll;
    padding: 0;
    li {
      padding: 7px 0;
    }
  }
}
</style>

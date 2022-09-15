<template>
  <section class="recentContainer">
    <h3>Recent Transactions</h3>
    <ul>
      <li>
        <item-sell type="sell" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
      <li>
        <item-sell type="buy" amount="2.00" />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import ItemSell from './itemSell.vue'
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
    height: 58vh;
    overflow-y: scroll;
    padding: 0;
    li {
      padding: 7px 0;
    }
  }
}
</style>

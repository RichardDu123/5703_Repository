<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script></script>
<script lang="ts" setup>
import { useETHStore } from '../store'
const store = useETHStore()
console.log('开始初始web3')
await store.initWeb3()
console.log('开始监听web3变化')
store.watchWeb3Account()
</script>

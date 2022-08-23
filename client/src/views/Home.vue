<template>
  <div class="Home">
    <Suspense>
      <template #default>
        <InitWeb3 />
      </template>
      <template #fallback> Please login to your metamask and connect </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import InitWeb3 from './InitWeb3.vue'
</script>

<template>
  <div class="Home">
    <Suspense>
      <template #default>
        <InitWeb3 />
      </template>
      <template #fallback><start /></template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import InitWeb3 from './InitWeb3.vue'
import start from '../components/start_page.vue'
</script>

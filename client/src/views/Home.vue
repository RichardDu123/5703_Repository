<template>
  <div class="Home">
    <Suspense>
      <template #default>
        <InitWeb3 />
      </template>
      <template #fallback> <Start_page></Start_page></template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import InitWeb3 from './InitWeb3.vue'
import Start_page from '../components/start_page.vue'
</script>

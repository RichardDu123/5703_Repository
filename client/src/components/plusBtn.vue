<template>
  <button class="postBtn" @click="sendPost">
    <Plus />
    <span>POST</span>
  </button>
  <CreatePost v-model="dialogFormVisible" v-if="props.type === 'buy'" />
  <CreateSellPost v-model="dialogFormVisible" v-if="props.type === 'sell'" />
</template>

<script setup lang="ts">
import Plus from '@/components/svgs/plus.vue'
import CreatePost from '@/views/welcome/components/createPost.vue'
import { ref } from 'vue'
import CreateSellPost from '@/views/welcome/components/createSellPost.vue'
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})
const dialogFormVisible = ref(false)
const sendPost = () => {
  dialogFormVisible.value = true
}
</script>

<style scoped lang="less">
.postBtn {
  margin-top: 14px;
  margin-left: 70%;
  color: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 112px;
  height: 48px;
  background: #2d68fe;
  border-radius: 8px;
  cursor: pointer;
  .hoverShadow();
  span {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
}
</style>

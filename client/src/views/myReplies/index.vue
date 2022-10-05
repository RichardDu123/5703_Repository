<template>
  <div class="myRepliesContainer">
    <h2>My Replies</h2>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="Buy" name="buy" class="panel">
        <ReplyTable :tableData="buy" type="buy" />
      </el-tab-pane>
      <el-tab-pane label="Sell" name="sell" class="panel">
        <ReplyTable :tableData="sell" type="sell" @updateTable="handleUpdate" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
import { ref } from 'vue'
import { useRepliesTable } from '@/hooks/responseMessage'
import ReplyTable from './components/replyTable.vue'
import { responseMessage } from '@/types/index'
const UserStore = useUserStore()
const buy = ref<responseMessage[]>([])
const sell = ref<responseMessage[]>([])
const update = () => {
  UserStore.setReplies().then(async () => {
    const [buyTable, sellTable] = await useRepliesTable()
    buy.value = buyTable
    sell.value = sellTable
  })
}
update()
const activeName = ref('buy')
const handleUpdate = () => {
  update()
}
</script>

<style scoped lang="less">
.myRepliesContainer {
  width: 900px;
  margin: auto;
  h2 {
    margin-top: 41px;
    text-align: left;
    font-family: 'Abel';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 31px;
  }
  .demo-tabs {
    margin-top: 47px;
    :deep(.el-tabs__item) {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 21px;
    }
  }
  .panel {
    margin-top: 39px;
    height: 550px;
  }
}
</style>

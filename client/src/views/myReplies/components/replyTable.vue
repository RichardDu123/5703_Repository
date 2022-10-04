<template>
  <div class="Container">
    <div class="sellerListContainer">
      <el-table
        :data="showFormData"
        style="width: 100%"
        :header-cell-style="{ background: '#FAFAFA', color: '#606266' }"
      >
        <el-table-column type="expand">
          <template #default>
            <div m="4">
              <h2>Seller:</h2>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Time" width="100">
          <template #default="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Expected Unit Price" width="160">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>Price in Wei: {{ scope.row.priceInWei }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.priceInEther }} Ether</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="Expected Units" width="130">
          <template #default="scope">
            <span style="margin-left: 10px">{{ scope.row.amount }} kW.h</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSize"
          :page-size="3"
          :current-page="curPage"
          @update:current-page="pageChanged"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import { responseMessage } from '@/types/index'
//tableData
const props = defineProps<{
  tableData: responseMessage[]
}>()

//Pagination
const showFormData = computed(() => {
  return props.tableData
    .slice((curPage.value - 1) * 3, (curPage.value - 1) * 3 + 3)
    .sort((a, b) => {
      return Number(b.createdAt) - Number(a.createdAt)
    })
})
const totalSize = computed(() => {
  return props.tableData.length
})
const curPage = ref(1)

const pageChanged = (value: any) => {
  curPage.value = value
}
</script>

<style scoped lang="less">
.Container {
  width: 700px;
  height: 500px;
  overflow-y: scroll;
  margin: auto;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 12px 26px rgba(16, 30, 115, 0.06);
  border-radius: 8px;
  .sellerListContainer {
    margin: auto;
    width: 676px;
    height: 400px;
    overflow-y: scroll;
    .numReply {
      margin-left: 3px;
      font-family: 'Lato';
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 0.1px;
      color: rgba(0, 0, 0, 0.5);
    }
    .innerTable {
      width: 676px;
    }
  }
  .pagination {
    margin-top: 40px;
    position: absolute;
    right: 0;
    bottom: 10px;
  }
}
</style>

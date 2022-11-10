<template>
  <div class="Container">
    <div class="sellerListContainer">
      <el-table
        :data="showFormData"
        style="width: 100%"
        :header-cell-style="{ background: '#FAFAFA', color: '#606266' }"
      >
        <el-table-column label="Time" width="150">
          <template #default="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Expected Unit Price" width="170">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>Price in Wei: {{ scope.row.quotationInWei }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.priceInEther }} Ether</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="Expected Units" width="210">
          <template #default="scope">
            <span style="margin-left: 10px">{{ scope.row.amount }} kW.h</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" width="140">
          <template #default="scope">
            <el-tag
              class="ml-2"
              :type="`${
                scope.row.isAccepted
                  ? `${scope.row.isPaid ? 'success' : ''}`
                  : 'info'
              }`"
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="Action" width="100" v-if="type === 'sell'">
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              @click="buyElec(scope.row)"
              :disabled="
                scope.row.isAccepted ? (scope.row.isPaid ? true : false) : true
              "
              :lading="isBuyLoading"
              >Buy</el-button
            >
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
import { useETHStore, useUserStore } from '@/store'
import Web3 from 'web3'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
//tableData
const props = defineProps<{
  tableData: responseMessage[]
  type: string
}>()
const emit = defineEmits(['updateTable'])
//Pagination
const showFormData = computed(() => {
  return props.tableData
    .concat([])
    .sort((a, b) => {
      return Number(b.timestamp) - Number(a.timestamp)
    })
    .slice((curPage.value - 1) * 3, (curPage.value - 1) * 3 + 3)
})
const totalSize = computed(() => {
  return props.tableData.length
})
const curPage = ref(1)

const pageChanged = (value: any) => {
  curPage.value = value
}
//buy elec if sell repliy has been approved
const isBuyLoading = ref(false)
const buyElec = async (row: any) => {
  isBuyLoading.value = true
  if (row.isAccepted && !row.isPaid && props.type === 'sell') {
    const ETHStore = useETHStore()
    const UserSotre = useUserStore()
    const web3 = ETHStore.web3 as Web3
    const address: string = ETHStore.accounts ? ETHStore.accounts[0] : ''
    const msg = {
      from: address,
      to: row.msgAddress,
      value: row.quotationInWei * row.amount,
      gas: 2000000,
      gasPrice: 2000000000,
    }
    try {
      await web3.eth.sendTransaction(msg)
      await UserSotre.setWei()
      await UserSotre.setElec()
      ElMessage({
        message: 'Success. The transaction is complete.',
        type: 'success',
      })
      await UserSotre.setRecnetTransaction()
      emit('updateTable')
    } catch (error) {
      ElMessage({
        message: 'Warning. Your transaction is reverted.',
        type: 'warning',
      })
    } finally {
      isBuyLoading.value = false
    }
  }
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
  }
  .pagination {
    margin-top: 40px;
    position: absolute;
    right: 0;
    bottom: 10px;
  }
}
</style>

<template>
  <div class="Container">
    <div class="buyerListContainer">
      <el-table
        :data="showFormData"
        style="width: 100%"
        :header-cell-style="{ background: '#FAFAFA', color: '#606266' }"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <h2>Seller List:</h2>
              <el-table :data="props.row.children">
                <el-table-column label="Seller" width="110">
                  <template #default="scope">
                    <el-popover
                      effect="light"
                      trigger="hover"
                      placement="top"
                      width="auto"
                    >
                      <template #default>
                        <div>name: {{ scope.row.name }}</div>
                        <div>address: {{ scope.row.messageSender }}</div>
                      </template>
                      <template #reference>
                        <el-tag type="success">{{ scope.row.name }}</el-tag>
                      </template>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="Quotation Price" width="140">
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
                        <el-tag type="success"
                          >{{ scope.row.priceInEther }} Ether</el-tag
                        >
                      </template>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="Sell Units" width="130">
                  <template #default="scope">
                    <span style="margin-left: 10px"
                      >{{ scope.row.amount }} kW.h</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Time" width="100">
                  <template #default="scope">
                    <span>{{ scope.row.date }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Action" width="100">
                  <template #default="scope">
                    <el-button
                      size="small"
                      type="success"
                      @click="handleApprove(scope.row.contract)"
                      :disabled="scope.row.isAccepted"
                      :loading="isApproveLoading"
                      >Approve</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Buy" width="100">
                  <template #default="scope">
                    <el-button
                      size="small"
                      type="success"
                      :loading="isBuyLoading"
                      @click="sendTransaction(scope.row)"
                      :disabled="
                        scope.row.isAccepted
                          ? scope.row.isPaid
                            ? true
                            : false
                          : true
                      "
                      >Buy</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
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
                <el-tag>{{ scope.row.priceToBuy }} Ether</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="Expected Units" width="130">
          <template #default="scope">
            <span style="margin-left: 10px"
              >{{ scope.row.initialAmountToBuy }} kW.h</span
            >
          </template>
        </el-table-column>
        <el-table-column label="Availability" width="130">
          <template #default="scope" style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.fromNow }}</span>
          </template>
        </el-table-column>
        <el-table-column label="No.Reply" width="100">
          <template #default="scope">
            <svg
              width="24"
              height="22"
              viewBox="0 0 24 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.696 0.245972C5.388 0.245972 0.296001 4.99597 0.296001 10.886C0.296001 12.786 0.828001 14.534 1.74 16.092C1.854 16.282 1.892 16.51 1.816 16.7L0.752001 20.082C0.562001 20.69 1.132 21.222 1.74 21.032L5.084 19.854C5.312 19.778 5.54 19.816 5.73 19.93C7.478 20.956 9.53 21.526 11.734 21.526C18.042 21.526 23.134 16.776 23.134 10.886C23.058 4.99597 17.966 0.245972 11.696 0.245972Z"
                fill="#B8BED9"
              />
            </svg>

            <span class="numReply">{{ scope.row.children.length }}</span>
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
import { useETHStore, useUserStore } from '@/store'
import { fromNow, format } from '@/utils/day'
import { toEther } from '@/api/basic'
import Web3 from 'web3'
import { computed, ref, toRef, watchEffect } from 'vue'
import { Post } from '@/types/index'
import { useResponseMessage } from '@/hooks/responseMessage'
import { Contract } from 'web3-eth-contract'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
//get buyerlist size
const UserSotre = useUserStore()
const ETHStore = useETHStore()
const isApproveLoading = ref(false)
const isBuyLoading = ref(false)
UserSotre.setPurchasePosts()
const postListRef = toRef(UserSotre, 'purchasePosts')
let tableData = ref<Post[]>([])
const updateTable = () => {
  tableData.value = []
  postListRef.value.forEach((item) => {
    console.log(item)
    tableData.value.push({
      postIdx: item.postIdx,
      timestamp: item.createdAt,
      date: format(Number(item.createdAt)),
      fromNow: fromNow(Number(item.createdAt)),
      name: 'Anonymous',
      address: item.buyer,
      priceInWei: item.priceToBuy,
      amountToBuy: item.amountToBuy,
      initialAmountToBuy: item.initialAmountToBuy,
      priceToBuy: ETHStore.web3
        ? Number(toEther(ETHStore.web3 as Web3, item.priceToBuy))
            .toFixed(4)
            .toString()
        : '0',
    })
  })
  tableData.value = useResponseMessage(tableData.value, 'buy')
  tableData.value = tableData.value.sort((a, b) => {
    return Number(b.timestamp) - Number(a.timestamp)
  })
}
watchEffect(updateTable)
//Pagination
const showFormData = computed(() => {
  return tableData.value
    .slice((curPage.value - 1) * 3, (curPage.value - 1) * 3 + 3)
    .sort((a, b) => {
      return Number(b.timestamp) - Number(a.timestamp)
    })
})
const totalSize = computed(() => {
  return tableData.value.length
})
const curPage = ref(1)
const pageChanged = (value: any) => {
  curPage.value = value
}

//handleApprove
const handleApprove = async (contract: Contract) => {
  isApproveLoading.value = true
  const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
  try {
    await contract.methods.setIsAccepted(true).send({
      from: address,
    })
    UserSotre.setPurchasePosts()
    ElMessage({
      message: 'Success. The reply has been approved.',
      type: 'success',
    })
  } finally {
    isApproveLoading.value = false
  }
}

//send
const sendTransaction = async (row: any) => {
  isBuyLoading.value = true
  const ETHStore = useETHStore()
  const web3 = ETHStore.web3 as Web3
  const address: string = ETHStore.accounts ? ETHStore.accounts[0] : ''
  const msg = {
    from: address,
    to: row.msgAddress,
    value: row.quotationInWei * row.amount,
    gas: 20000000,
    gasPrice: 2000000000,
  }
  console.log(msg)
  try {
    await web3.eth.sendTransaction(msg)
    ElMessage({
      message: 'Success. The transaction is completed.',
      type: 'success',
    })
    await UserSotre.setRecnetTransaction()
  } catch (error) {
    ElMessage({
      message: 'Warning. Your transaction is reverted.',
      type: 'warning',
    })
    console.log(error)
  } finally {
    updateTable()
    UserSotre.setWei()
    isBuyLoading.value = false
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
  .buyerListContainer {
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
  }
  .pagination {
    margin-top: 40px;
    position: absolute;
    right: 0;
    bottom: 10px;
  }
}
</style>

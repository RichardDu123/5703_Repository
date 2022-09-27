<template>
  <div class="profileContainer">
    <div class="buyerListContainer">
      <el-table
        :data="showFormData"
        style="width: 100%"
        :header-cell-style="{ background: '#FAFAFA', color: '#606266' }"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <h2>Replies:</h2>
              <el-table :data="props.row.children">
                <el-table-column label="Seller" width="130">
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
                <el-table-column label="Quotation Price" width="160">
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
                <el-table-column label="Availability" width="130">
                  <template
                    #default="scope"
                    style="display: flex; align-items: center"
                  >
                    <el-icon><timer /></el-icon>
                    <span style="margin-left: 10px">{{
                      scope.row.fromNow
                    }}</span>
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
                      >Approve</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Buyer" width="130">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>name: {{ scope.row.name }}</div>
                <div>address: {{ scope.row.address }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.name }}</el-tag>
              </template>
            </el-popover>
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
              >{{ scope.row.amountToBuy }} kW.h</span
            >
          </template>
        </el-table-column>
        <el-table-column label="Availability" width="130">
          <template #default="scope" style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.fromNow }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Time" width="100">
          <template #default="scope">
            <span>{{ scope.row.date }}</span>
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
//get buyerlist size
const UserSotre = useUserStore()
const ETHStore = useETHStore()
UserSotre.setPurchasePosts()
const postListRef = toRef(UserSotre, 'purchasePosts')
let tableData = ref<Post[]>([])
const updateTable = () => {
  tableData.value = []
  postListRef.value.forEach((item) => {
    tableData.value.push({
      postIdx: item.postIdx,
      timestamp: item.createdAt,
      date: format(Number(item.createdAt)),
      fromNow: fromNow(Number(item.createdAt)),
      name: 'Anonymous',
      address: item.buyer,
      priceInWei: item.priceToBuy,
      amountToBuy: item.amountToBuy,
      priceToBuy: ETHStore.web3
        ? Number(toEther(ETHStore.web3 as Web3, item.priceToBuy))
            .toFixed(4)
            .toString()
        : '0',
    })
  })
  tableData.value = useResponseMessage(tableData.value)
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
  const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
  await contract.methods.setIsAccepted(true).send({
    from: address,
  })
  UserSotre.setPurchasePosts()
}
</script>

<style scoped lang="less">
.profileContainer {
  width: 800px;
  height: 500px;
  overflow-y: scroll;
  margin: auto;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 12px 26px rgba(16, 30, 115, 0.06);
  border-radius: 8px;
  .buyerListContainer {
    margin: auto;
    width: 708px;
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

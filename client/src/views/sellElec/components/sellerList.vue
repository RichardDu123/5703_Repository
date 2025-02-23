<template>
  <el-select
    v-model="units"
    class="select"
    placeholder="Sort by: Units"
    size="large"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <div class="sellerListContainer">
    <el-table
      :data="showFormData"
      style="width: 100%"
      :header-cell-style="{ background: '#FAFAFA', color: '#606266' }"
    >
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
              <div>address: {{ scope.row.address }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.name }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Unit Price" width="160">
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
              <el-tag>{{ scope.row.priceToSell }} Ether</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Units" width="130">
        <template #default="scope">
          <span style="margin-left: 10px"
            >{{ scope.row.amountToSell }} kW.h</span
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
      <el-table-column label="Trade" width="100">
        <template #default="scope">
          <el-button size="small" type="success" @click="handleReply(scope.row)"
            >Reply</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="6"
        :current-page="curPage"
        @update:current-page="pageChanged"
      />
    </div>
  </div>
  <ResponseMessage
    v-model="isShow"
    :post-id="postIdx"
    type="sell"
    :amount="amount"
  />
</template>

<script setup lang="ts">
import { useSellerStore, useETHStore } from '@/store'
import { fromNow, format } from '@/utils/day'
import { toEther } from '@/api/basic'
import Web3 from 'web3'
import { computed, ref, toRef, watchEffect } from 'vue'
import ResponseMessage from '@/components/responseMessage.vue'
interface Post {
  postIdx: number
  date: string
  name: string
  address: string
  priceToSell: string
  amountToSell: string
  priceInWei: string
  fromNow: string
  timestamp: string
}

//get buyerlist size
const SellerStore = useSellerStore()
const ETHStore = useETHStore()
SellerStore.setSellerList()
const selllerListRef = toRef(SellerStore, 'sellerList')
let tableData = ref<Post[]>([])
const updateTable = () => {
  tableData.value = []
  selllerListRef.value.forEach((item) => {
    tableData.value.push({
      postIdx: item.postIdx,
      timestamp: item.createdAt,
      date: format(Number(item.createdAt)),
      fromNow: fromNow(Number(item.createdAt)),
      name: item.name,
      address: item.seller,
      priceInWei: item.priceToSell,
      amountToSell: item.amountToSell,
      priceToSell: ETHStore.web3
        ? Number(toEther(ETHStore.web3 as Web3, item.priceToSell))
            .toFixed(4)
            .toString()
        : '0',
    })
  })
  tableData.value.sort((a, b) => {
    return Number(b.timestamp) - Number(a.timestamp)
  })
}
watchEffect(updateTable)
//Pagination
const showFormData = computed(() => {
  const tempTable = tableData.value
    .concat([])
    .sort((a, b) => {
      return Number(b.timestamp) - Number(a.timestamp)
    })
    .filter((item) => {
      return item.amountToSell != '0'
    })
    .slice((curPage.value - 1) * 6, (curPage.value - 1) * 6 + 6)

  if (units.value === '-1' || units.value === '') {
    return tempTable
  } else {
    switch (units.value) {
      case '0':
        return tempTable.filter((item) => {
          return Number(item.amountToSell) <= 50
        })
      case '1':
        return tempTable.filter((item) => {
          return (
            Number(item.amountToSell) <= 100 && Number(item.amountToSell) > 50
          )
        })
      case '2':
        return tempTable.filter((item) => {
          return (
            Number(item.amountToSell) <= 150 && Number(item.amountToSell) > 100
          )
        })
      case '3':
        return tempTable.filter((item) => {
          return (
            Number(item.amountToSell) <= 200 && Number(item.amountToSell) > 150
          )
        })
      case '4':
        return tempTable.filter((item) => {
          return (
            Number(item.amountToSell) <= 250 && Number(item.amountToSell) > 200
          )
        })
      default:
        return tempTable.filter((item) => {
          return Number(item.amountToSell) > 250
        })
    }
  }
})
const totalSize = computed(() => {
  return tableData.value.length
})
const curPage = ref(1)
const pageChanged = (value: any) => {
  curPage.value = value
  console.log('page 切换了', value)
}

//dialogue
const isShow = ref(false)
const postIdx = ref('')
const amount = ref('')
const handleReply = (row: Post) => {
  isShow.value = true
  postIdx.value = row.postIdx.toString()
  amount.value = row.amountToSell.toString()
}

//options

const units = ref('')
const options = [
  {
    value: '-1',
    label: 'All',
  },
  {
    value: '0',
    label: '0-50 kWh',
  },
  {
    value: '1',
    label: '50-100 kWh',
  },
  {
    value: '2',
    label: '100-150 kWh',
  },
  {
    value: '3',
    label: '150-200 kWh',
  },
  {
    value: '4',
    label: '200-250 kWh',
  },
  {
    value: '5',
    label: '>250 kWh',
  },
]
</script>

<style scoped lang="less">
.select {
  width: 145px;
  margin-left: 70%;
  margin-bottom: 11px;
}
.sellerListContainer {
  width: 750px;
  height: 500px;
  margin: auto;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 12px 26px rgba(16, 30, 115, 0.06);
  border-radius: 8px;
  .pagination {
    margin-top: 40px;
    position: absolute;
    right: 0;
    bottom: 10px;
  }
}
</style>

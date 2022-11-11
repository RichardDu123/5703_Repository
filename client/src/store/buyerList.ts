import { defineStore } from 'pinia'
import { useETHStore } from './eth'
import { Contract } from 'web3-eth-contract'
import {
  getPurchasePostSize,
  getPurchasePostByKey,
  getUsernameByAddress,
} from '@/api/mainSys'
interface purchasePost {
  postIdx: number
  priceToBuy: string
  amountToBuy: string
  buyer: string
  enabled: boolean
  createdAt: string
  responseMessages: string[]
  name: string
  initialAmountToBuy: string
}
export const useBuyerStore = defineStore('Buyer', {
  state: () => ({
    buyerList: <purchasePost[]>[],
  }),
  actions: {
    async setBuyerList() {
      const ETHStore = useETHStore()
      const contract = ETHStore.contract as Contract
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      const buyerListSize = await getPurchasePostSize(contract, address)
      const tempList: purchasePost[] = []
      for (let i = 0; i < buyerListSize; i++) {
        const item = await getPurchasePostByKey(contract, address, i)
        let userName = await getUsernameByAddress(contract, item.buyer)
        if (userName === '') {
          userName = 'Anonymous'
        }
        tempList.push({ postIdx: i, name: userName, ...item })
      }
      this.buyerList = tempList
    },
  },
})

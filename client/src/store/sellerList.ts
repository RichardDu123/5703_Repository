import { defineStore } from 'pinia'
import { useETHStore } from './eth'
import { Contract } from 'web3-eth-contract'
import {
  getSellPostSize,
  getSellPostByKey,
  getUsernameByAddress,
} from '@/api/mainSys'
interface sellPost {
  postIdx: number
  priceToSell: string
  amountToSell: string
  seller: string
  enabled: boolean
  createdAt: string
  responseMessages: string[]
  name: string
}
export const useSellerStore = defineStore('Seller', {
  state: () => ({
    sellerList: <sellPost[]>[],
  }),
  actions: {
    async setSellerList() {
      const ETHStore = useETHStore()
      const contract = ETHStore.contract as Contract
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      const buyerListSize = await getSellPostSize(contract, address)
      const tempList: sellPost[] = []
      for (let i = 0; i < buyerListSize; i++) {
        const item = await getSellPostByKey(contract, address, i)
        let userName = await getUsernameByAddress(contract, item.seller)
        if (userName === '') {
          userName = 'Anonymous'
        }
        tempList.push({ postIdx: i, name: userName, ...item })
      }
      this.sellerList = tempList
    },
  },
})

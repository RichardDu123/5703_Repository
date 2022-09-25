import { defineStore } from 'pinia'
import { useETHStore } from './eth'
import { getBalance } from '@/api/basic'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import {
  getElecByAddress,
  returnAllPurchasePostsByAddress,
  returnPurchasePostResponseMessagesByKey,
} from '@/api/mainSys'
interface purchasePost {
  postIdx: number
  priceToBuy: string
  amountToBuy: string
  buyer: string
  enabled: boolean
  createdAt: string
  responseMessages: string[]
}
export const useUserStore = defineStore('User', {
  state: () => ({
    currElec: '0',
    currWei: '0',
    purchasePosts: <purchasePost[]>[],
  }),
  actions: {
    async setWei() {
      const ETHStore = useETHStore()
      const web3 = ETHStore.web3 as Web3
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      this.currWei = await getBalance(web3, address)
    },
    async setElec() {
      const ETHStore = useETHStore()
      const contract = ETHStore.contract as Contract
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      this.currElec = await getElecByAddress(contract, address)
    },
    async setPurchasePosts() {
      const ETHStore = useETHStore()
      const contract = ETHStore.contract as Contract
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      const res = await returnAllPurchasePostsByAddress(contract, address)

      res.forEach((item: purchasePost) => {
        this.purchasePosts.push({
          postIdx: item.postIdx,
          priceToBuy: item.priceToBuy,
          amountToBuy: item.amountToBuy,
          buyer: item.buyer,
          enabled: item.enabled,
          createdAt: item.createdAt,
          responseMessages: item.responseMessages,
        })
      })

      const res1 = await returnPurchasePostResponseMessagesByKey(
        contract,
        address,
        0
      )
      console.log(this.purchasePosts)
    },
  },
})

import { defineStore } from 'pinia'
import { useETHStore } from './eth'
import { getBalance } from '@/api/basic'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import {
  getElecByAddress,
  getPurchasePostKeys,
  getPurchasePostByKey,
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
      this.purchasePosts = []
      const ETHStore = useETHStore()
      const contract = ETHStore.contract as Contract
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      const idxArr = await getPurchasePostKeys(contract, address)
      idxArr.forEach(async (id: string) => {
        const item: purchasePost = await getPurchasePostByKey(
          contract,
          address,
          Number(id)
        )
        this.purchasePosts.push({
          postIdx: Number(id),
          priceToBuy: item.priceToBuy,
          amountToBuy: item.amountToBuy,
          buyer: item.buyer,
          enabled: item.enabled,
          createdAt: item.createdAt,
          responseMessages: item.responseMessages,
        })
      })
    },
  },
})

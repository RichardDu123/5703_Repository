import { defineStore } from 'pinia'
import { useETHStore } from './eth'
import { getBalance } from '@/api/basic'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import {
  getElecByAddress,
  getPurchasePostKeys,
  getPurchasePostByKey,
  getSellingPostKeys,
  getSellPostByKey,
  returnAllResponses,
  returnRecentTransactions,
} from '@/api/mainSys'
import { PurchasePost, SellingPost, transacItem } from '@/types/index'
export const useUserStore = defineStore('User', {
  state: () => ({
    currElec: '0',
    currWei: '0',
    purchasePosts: <PurchasePost[]>[],
    sellingPosts: <SellingPost[]>[],
    relies: <string[]>[],
    recentTransaction: <transacItem[]>[],
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
      const keys = await getPurchasePostKeys(contract, address)
      keys.forEach(async (key: string) => {
        const post = await getPurchasePostByKey(contract, address, Number(key))
        this.purchasePosts.push({
          postIdx: Number(key),
          priceToBuy: post.priceToBuy,
          amountToBuy: post.amountToBuy,
          buyer: post.buyer,
          enabled: post.enabled,
          createdAt: post.createdAt,
          responseMessages: post.responseMessages,
        })
      })
    },
    async setSellingPosts() {
      this.sellingPosts = []
      const ETHStore = useETHStore()
      const contract = ETHStore.contract as Contract
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      const keys = await getSellingPostKeys(contract, address)
      keys.forEach(async (key: string) => {
        const post = await getSellPostByKey(contract, address, Number(key))
        this.sellingPosts.push({
          postIdx: Number(key),
          priceToSell: post.priceToSell,
          amountToSell: post.amountToSell,
          seller: post.buyer,
          enabled: post.enabled,
          createdAt: post.createdAt,
          responseMessages: post.responseMessages,
        })
      })
    },
    async setReplies() {
      this.relies = []
      const ETHStore = useETHStore()
      const contract = ETHStore.contract as Contract
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      const keys = await returnAllResponses(contract, address)
      this.relies = keys
    },
    async setRecnetTransaction() {
      console.log('123')
      this.recentTransaction = []
      const ETHStore = useETHStore()
      const contract = ETHStore.contract as Contract
      const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
      const res = await returnRecentTransactions(contract, address)
      res.forEach((item: any) => {
        this.recentTransaction.push({
          time: item.createdAt,
          type: item.transactionType,
          amount: item.transactionValue,
        })
      })
      console.log('456')
    },
  },
})

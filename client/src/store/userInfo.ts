import { defineStore } from 'pinia'
import { useETHStore } from './eth'
import { getBalance } from '@/api/basic'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { getElecByAddress } from '@/api/mainSys'

export const useUserStore = defineStore('User', {
  state: () => ({
    currElec: '0',
    currWei: '0',
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
  },
})

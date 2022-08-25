/* eslint-disable */
import { defineStore } from 'pinia'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import ARTIFACT from '../contracts/ItemManager.json'
import detectEthereumProvider from '@metamask/detect-provider'

interface ETH {
  artifact: any
  web3: Web3 | null
  accounts: string[] | null
  networkID: number | null
  contract: Contract | null
  isWeb3Load: boolean
}
export const useETHStore = defineStore('ETH', {
  state: (): ETH => ({
    artifact: ARTIFACT,
    web3: null,
    accounts: null,
    networkID: null,
    contract: null,
    isWeb3Load: false,
  }),
  getters: {
    getAccounts: (state) =>
      state.accounts ? `The account is "${state.accounts[0]}".` : 'no account',
  },
  actions: {
    async initWeb3() {
      const provider = await detectEthereumProvider()
      if (provider) {
        try {
          console.log('begin web3init')
          this.web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
          this.accounts = await this.web3.eth.requestAccounts()
          this.networkID = await this.web3.eth.net.getId()
          const abi: any = ARTIFACT.abi
          if ((window as any).ethereum.chainId !== '0x539') {
            throw Error('wrong network!')
          }
          const address: any = ARTIFACT.networks[this.networkID].address
          this.contract = new this.web3.eth.Contract(abi, address)
          this.isWeb3Load = true
        } catch (err) {
          console.error(err)
        }
      } else {
        console.log('Please install MetaMask!')
      }
    },
    watchWeb3Account() {
      console.log('begin watch')
      const handleAccountChange = () => {
        // if (this.web3) {
        //   const accounts = await this.web3.eth.getAccounts()
        //   const activeAccount = accounts[0]
        //   if (this.accounts && activeAccount !== this.accounts[0]) {
        //     this.accounts = accounts
        //   }
        //   this.initWeb3()
        // }
        // this.initWeb3()
        window.location.reload()
      }
      const handleChainChange = () => {
        if ((window as any).ethereum.chainId !== '0x539') {
          window.location.reload()
        } else {
          window.location.reload()
        }
      }
      ;(window as any).ethereum.on('accountsChanged', handleAccountChange)
      ;(window as any).ethereum.on('chainChanged', handleChainChange)
    },
  },
})

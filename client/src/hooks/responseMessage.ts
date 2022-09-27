import ARTIFACT from '@/contracts/PostResponseMessage.json'
import { useETHStore, useUserStore } from '@/store'
import { Contract } from 'web3-eth-contract'
import Web3 from 'web3'
import { Post } from '@/types/index'
import { fromNow, format } from '@/utils/day'
import { toEther } from '@/api/basic'
import { PurchasePost, SellingPost } from '@/types/index'
export const useResponseMessage = (tableData: Post[], type: string): Post[] => {
  const ETHStore = useETHStore()
  const UserStore = useUserStore()
  const abi: any = ARTIFACT.abi
  const web3 = ETHStore.web3 as Web3
  tableData.forEach((item) => {
    item.children = []
    const posts =
      type === 'buy' ? UserStore.purchasePosts : UserStore.sellingPosts
    posts.forEach((post: PurchasePost | SellingPost) => {
      if (post.postIdx === item.postIdx) {
        post.responseMessages.forEach(async (msgAddress: string) => {
          const contract: Contract = new web3.eth.Contract(abi, msgAddress)
          const address: string = ETHStore.accounts ? ETHStore.accounts[0] : ''
          const res = await contract.methods
            .returnPostResponseMessageBean()
            .call({ from: address })
          item.children!.push({
            name: 'Anonymous',
            amount: res.amount,
            timestamp: res.createdAt,
            date: format(Number(res.createdAt)),
            fromNow: fromNow(Number(res.createdAt)),
            isAccepted: res.isAccepted,
            isPaid: res.isPaid,
            msgIdx: res.messageIndex,
            messageSender: res.messageSender,
            postKey: res.postKey,
            quotationInWei: res.quotationInWei,
            responseMessageType: res.responseMessageType,
            contract: contract,
            priceInEther: ETHStore.web3
              ? Number(toEther(ETHStore.web3 as Web3, res.quotationInWei))
                  .toFixed(4)
                  .toString()
              : '0',
          })
        })
      }
    })
  })
  return tableData
}

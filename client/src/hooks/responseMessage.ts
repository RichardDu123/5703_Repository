import ARTIFACT from '@/contracts/PostResponseMessage.json'
import { useETHStore, useUserStore } from '@/store'
import { Contract } from 'web3-eth-contract'
import Web3 from 'web3'
import { Post, responseMessage } from '@/types/index'
import { fromNow, format } from '@/utils/day'
import { toEther } from '@/api/basic'
import { PurchasePost, SellingPost } from '@/types/index'
import { ref } from 'vue'
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
            msgAddress: msgAddress,
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
export const useRepliesTable = async (): Promise<
  [responseMessage[], responseMessage[]]
> => {
  const buyReply = ref<responseMessage[]>([])
  const sellReply = ref<responseMessage[]>([])
  const ETHStore = useETHStore()
  const UserStore = useUserStore()
  const abi: any = ARTIFACT.abi
  const web3 = ETHStore.web3 as Web3
  const address: string = ETHStore.accounts ? ETHStore.accounts[0] : ''
  const replies = UserStore.relies
  for (const reply of replies) {
    const contract: Contract = new web3.eth.Contract(abi, reply)
    const res = await contract.methods
      .returnPostResponseMessageBean()
      .call({ from: address })
    if (res.responseMessageType === '0') {
      buyReply.value.push({
        name: 'Anonymous',
        amount: res.amount,
        timestamp: res.createdAt,
        isAccepted: res.isAccepted,
        isPaid: res.isPaid,
        msgIdx: res.messageIndex,
        postKey: res.postKey,
        quotationInWei: res.quotationInWei,
        date: format(Number(res.createdAt)),
        responseMessageType: res.responseMessageType,
        priceInEther: ETHStore.web3
          ? Number(toEther(ETHStore.web3 as Web3, res.quotationInWei))
              .toFixed(4)
              .toString()
          : '0',
        msgAddress: reply,
        status: `${
          res.isAccepted
            ? `${res.isPaid ? 'Finish' : 'Approved'}`
            : 'No Response'
        }`,
        contract: contract,
      })
    } else {
      sellReply.value.push({
        name: 'Anonymous',
        amount: res.amount,
        timestamp: res.createdAt,
        isAccepted: res.isAccepted,
        isPaid: res.isPaid,
        msgIdx: res.messageIndex,
        postKey: res.postKey,
        quotationInWei: res.quotationInWei,
        date: format(Number(res.createdAt)),
        responseMessageType: res.responseMessageType,
        priceInEther: ETHStore.web3
          ? Number(toEther(ETHStore.web3 as Web3, res.quotationInWei))
              .toFixed(4)
              .toString()
          : '0',
        msgAddress: reply,
        status: `${
          res.isAccepted
            ? `${res.isPaid ? 'Finish' : 'Approved'}`
            : 'No Response'
        }`,
        contract: contract,
      })
    }
  }
  return [buyReply.value, sellReply.value]
}

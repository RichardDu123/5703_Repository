export interface Post {
  postIdx: number
  date: string
  name: string
  address: string
  priceToBuy: string
  amountToBuy: string
  initialAmountToBuy: string
  priceInWei: string
  fromNow: string
  timestamp: string
  children?: any[]
}
export interface PurchasePost {
  postIdx: number
  priceToBuy: string
  amountToBuy: string
  initialAmountToBuy: string
  buyer: string
  enabled: boolean
  createdAt: string
  responseMessages: string[]
}
export interface SellingPost {
  postIdx: number
  priceToSell: string
  amountToSell: string
  initialAmountToSell: string
  seller: string
  enabled: boolean
  createdAt: string
  responseMessages: string[]
}
export interface responseMessage {
  name: string
  amount: string
  timestamp: string
  date: string
  isAccepted: boolean
  isPaid: boolean
  msgIdx: string
  postKey: string
  quotationInWei: string
  responseMessageType: string
  priceInEther: string
  msgAddress: string
  status: string
  contract: any
}
export interface transacItem {
  time: string
  type: string
  amount: string
}

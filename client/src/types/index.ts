export interface Post {
  postIdx: number
  date: string
  name: string
  address: string
  priceToBuy: string
  amountToBuy: string
  priceInWei: string
  fromNow: string
  timestamp: string
  children?: any[]
}
export interface PurchasePost {
  postIdx: number
  priceToBuy: string
  amountToBuy: string
  buyer: string
  enabled: boolean
  createdAt: string
  responseMessages: string[]
}
export interface SellingPost {
  postIdx: number
  priceToSell: string
  amountToSell: string
  seller: string
  enabled: boolean
  createdAt: string
  responseMessages: string[]
}

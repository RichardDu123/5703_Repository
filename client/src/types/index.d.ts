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

/* eslint-disable */
import { Contract } from 'web3-eth-contract'
export const getElecByAddress = (
  contract: Contract,
  address: string
): Promise<string> => {
  return contract.methods.getAvailableElecUnitsByAccountAddress(address).call({
    from: address,
  })
}

export const createPurchasePost = (
  contract: Contract,
  address: string,
  price: string,
  amount: string
): Promise<any> => {
  return contract.methods
    .createPurchasePost(price, amount)
    .send({ from: address })
}

export const getPurchasePostSize = (
  contract: Contract,
  address: string
): Promise<number> => {
  return contract.methods.returnPurchasePostMapSize().call({
    from: address,
  })
}

export const getPurchasePostByKey = (
  contract: Contract,
  address: string,
  postKey: number
): Promise<any> => {
  return contract.methods.getPurchasePostByKey(postKey).call({
    from: address,
  })
}

export const createPurchasePostRes = (
  contract: Contract,
  address: string,
  price: number,
  amount: number,
  postId: number
): Promise<any> => {
  return contract.methods
    .createResponseMessageToPurchasePost(amount, price, postId)
    .send({ from: address })
}

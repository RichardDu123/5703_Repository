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

export const createPurchasePostRes = (
  contract: Contract,
  address: string,
  price: string,
  amount: string,
  postId: number
): Promise<any> => {
  return contract.methods
    .createResponseMessageToPurchasePost(amount, price, postId)
    .send({ from: address })
}

export const createSellPost = (
  contract: Contract,
  address: string,
  price: string,
  amount: string
): Promise<any> => {
  return contract.methods
    .createSellingPost(price, amount)
    .send({ from: address })
}
export const getSellPostSize = (
  contract: Contract,
  address: string
): Promise<number> => {
  return contract.methods.returnSellPostMapSize().call({
    from: address,
  })
}

export const createSellPostRes = (
  contract: Contract,
  address: string,
  price: string,
  amount: string,
  postId: number
): Promise<any> => {
  return contract.methods
    .createResponseMessageToSellingPost(amount, price, postId)
    .send({ from: address })
}

export const returnAllPurchasePostsByAddress = (
  contract: Contract,
  address: string
): Promise<any> => {
  return contract.methods.returnAllPurchasePostsByAddress(address).call({
    from: address,
  })
}

export const returnPurchasePostResponseMessagesByKey = (
  contract: Contract,
  address: string,
  postId: number
): Promise<any> => {
  return contract.methods.returnPurchasePostResponseMessagesByKey(postId).call({
    from: address,
  })
}

export const getSellPostByKey = (
  contract: Contract,
  address: string,
  postKey: number
): Promise<any> => {
  return contract.methods.getSellingPostByKey(postKey).call({
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
export const getPurchasePostKeys = (
  contract: Contract,
  address: string
): Promise<any> => {
  return contract.methods.getPurchasePostKeys(address).call({
    from: address,
  })
}

export const getSellingPostKeys = (
  contract: Contract,
  address: string
): Promise<any> => {
  return contract.methods.getSellingPostKeys(address).call({
    from: address,
  })
}

export const returnAllResponses = (
  contract: Contract,
  address: string
): Promise<any> => {
  return contract.methods.returnAllResponses(address).call({
    from: address,
  })
}

export const getUsernameByAddress = (
  contract:Contract,
  address:string
):Promise<any> => {
  return contract.methods.getUsernameByAddress(address).call({
    from:address
  })
}

export const setUsername = (
  contract:Contract,
  address:string,
  memory:string
):Promise<any>=>{
  return contract.methods.setUsername(address,memory).send({
    from:address
  })
}

export const addAvailableElecUnits=(
  contract:Contract,
  address:string,
  addressAd: string,
  amount:string
):Promise<any>=>{
  return contract.methods.setUsername(address,amount).call({
    from:addressAd
  })
}
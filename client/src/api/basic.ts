import Web3 from 'web3'
export const getBalance = (
  instance: Web3,
  address: string
): Promise<string> => {
  return instance?.eth.getBalance(address)
}
export const toEther = (instance: Web3, numWei: string): string => {
  return instance.utils.fromWei(numWei)
}

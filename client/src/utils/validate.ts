/* eslint-disable */
export const validatePrice = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input how much you want to pay for each unit.'))
  } else {
    if (value <= 0) {
      callback(new Error('The price must be greater than 0.'))
    } else if (!Number.isInteger(Number(value))) {
      callback(new Error('The price must be an integer.'))
    }
    callback()
  }
}
export const validateAmount = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(
      new Error('Please input how many electricity units you want to buy.')
    )
  } else {
    if (value <= 0) {
      callback(new Error('The amount must be greater than 0.'))
    } else if (!Number.isInteger(Number(value))) {
      callback(new Error('The amount must be an integer.'))
    }
    callback()
  }
}

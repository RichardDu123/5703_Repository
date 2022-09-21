import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
export const fromNow = (timestamp: number): string => {
  return dayjs.unix(timestamp).fromNow(true)
}
export const format = (timestamp: number): string => {
  return dayjs.unix(timestamp).format('YYYY.MM.DD HH:mm a')
}

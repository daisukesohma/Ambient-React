// Convert unixtime to milliseconds
import isNaN from 'lodash/isNaN'

export default function unixToMs(
  number: string | number | undefined,
): milliseconds {
  if (number === null) return null
  let ms = Number(number) * 1000
  if (isNaN(ms) || ms === 0) ms = Date.now()
  return Math.floor(ms)
}

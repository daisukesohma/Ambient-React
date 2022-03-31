// Convert milliseconds to unix time (https://www.epochconverter.com/)
import isNaN from 'lodash/isNaN'

export default function msToUnix(
  milliseconds: string | number | undefined,
): number {
  let ms = Number(milliseconds)
  if (isNaN(ms) || ms === 0) ms = Date.now()
  return Math.floor(ms / 1000)
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-spread */

export function debounce(func: any, wait: any): (e: any) => void {
  let timeout: any
  const returnFunction = (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(null, args)
    }, wait)
  }
  return returnFunction
}

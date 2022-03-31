import useInterval from './useInterval'
import { msToUnix } from 'utils'

export default function useBandWidth(callback, delay = 1000) {
  useInterval(() => {
    const imageAddr = 'https://ambient.ai/imgs/logo_new.png'
    const downloadSize = 16931
    const download = new Image()

    const startTime = new Date().getTime()
    download.onload = () => {
      const endTime = new Date().getTime()
      const duration = msToUnix(endTime - startTime)
      const bitsLoaded = downloadSize * 8
      const speedBps = (bitsLoaded / duration).toFixed(2)
      const speedKbps = Math.floor((speedBps / 1024).toFixed(2))
      callback(speedKbps)
    }
    download.onerror = e => {
      callback(0)
    }
    download.src = imageAddr
  }, delay)
}

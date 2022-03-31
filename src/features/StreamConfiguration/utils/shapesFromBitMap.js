import times from 'lodash/times'

import { STREAM_HEIGHT, STREAM_WIDTH } from '../constants'

import Bitmap from './bitmap'

function hexToRGB(h) {
  let r
  let g
  let b
  const a = 1

  r = `0x${h[1]}${h[2]}`
  g = `0x${h[3]}${h[4]}`
  b = `0x${h[5]}${h[6]}`

  r = +((r / 255) * 100).toFixed(1)
  g = +((g / 255) * 100).toFixed(1)
  b = +((b / 255) * 100).toFixed(1)

  return [r / 100, g / 100, b / 100, a]
}

export default (bitMap, zoneColors) => {
  const bmp = new Bitmap(STREAM_WIDTH, STREAM_HEIGHT)
  times(STREAM_HEIGHT, y => {
    times(STREAM_WIDTH, x => {
      const zoneId = bitMap[y][x]
      if (zoneId !== 0 && zoneId !== -1) {
        if (zoneColors[zoneId]) {
          bmp.pixel[x][y] = hexToRGB(zoneColors[zoneId])
        }
      }
    })
  })
  return bmp
}

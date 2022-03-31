import get from 'lodash/get'
import isNumber from 'lodash/isNumber'

import brushFromPointer from './brushFromPointer'

export default (bitMap, x, y, brushSize, zoneId) => {
  const resultBitMap = bitMap
  const brush = brushFromPointer(x, y, brushSize, 1)
  for (let _y = brush.top; _y < brush.top + brush.height; _y++) {
    for (let _x = brush.left; _x < brush.left + brush.width; _x++) {
      if (isNumber(get(resultBitMap, `[${_y}][${_x}]`)))
        resultBitMap[_y][_x] = zoneId
    }
  }
  return resultBitMap
}

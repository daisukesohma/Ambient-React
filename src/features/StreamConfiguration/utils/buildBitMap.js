import times from 'lodash/times'
import set from 'lodash/set'

import { STREAM_HEIGHT, STREAM_WIDTH } from '../constants'

export default ({ erased }) => {
  const bitMap = []
  times(STREAM_HEIGHT, y => {
    times(STREAM_WIDTH, x => {
      set(bitMap, `[${y}][${x}]`, erased ? 0 : -1)
    })
  })
  return bitMap
}

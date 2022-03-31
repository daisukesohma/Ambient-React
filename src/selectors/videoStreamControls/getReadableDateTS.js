import { createSelector } from '@reduxjs/toolkit'

import { getCurrUnixTimestamp } from '../../utils'
import formatUnixTimeToReadable from '../../components/VideoStreamControls/utils/formatUnixTimeToReadable'

export default ({ videoStreamKey, timezone }) => {
  return createSelector([state => state.videoStreamControls], streams => {
    let dateTS
    if (
      videoStreamKey &&
      streams[videoStreamKey] &&
      streams[videoStreamKey].dateTS
    ) {
      dateTS = streams[videoStreamKey].dateTS
    } else {
      dateTS = getCurrUnixTimestamp()
    }
    return formatUnixTimeToReadable(dateTS, true, false)
  })
}

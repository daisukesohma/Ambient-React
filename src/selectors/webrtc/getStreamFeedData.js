import { createSelector } from '@reduxjs/toolkit'

export default ({ videoStreamKey, property }) => {
  return createSelector(
    [state => state.webrtc.streams],
    streams => {
      if (streams[videoStreamKey]) {
        if (property) {
          return streams[videoStreamKey][property] === undefined
            ? null
            : streams[videoStreamKey][property]
        }
        return streams[videoStreamKey]
      }
      return null
    },
  )
}

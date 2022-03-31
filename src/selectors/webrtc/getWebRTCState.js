import { createSelector } from '@reduxjs/toolkit'

export default ({ videoStreamKey, property, defaultValue }) => {
  return createSelector([state => state.webrtc], streams => {
    if (videoStreamKey && streams[videoStreamKey]) {
      if (property) {
        return streams[videoStreamKey][property]
      }
      return streams[videoStreamKey]
    }
    return defaultValue
  })
}

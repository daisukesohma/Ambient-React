import { createSelector } from '@reduxjs/toolkit'

// FUTURE IndicatorStatus enum exists - should probably use it.
// DISCONNECTED: 'disconnected',
// LIVE: 'live',
// RECORDED: 'recorded',

export default ({ videoStreamKey, mode }) => {
  return createSelector(
    [state => state.webrtc.streams],
    streams => {
      if (streams[videoStreamKey]) {
        const { status } = streams[videoStreamKey]
        if (status === 'PLAYING') {
          if (Number(mode) === 0 || Number(mode) === 1) {
            return 'Live'
          }
          if (Number(mode) === 3) {
            return 'Recorded'
          }
        }
        if (status === 'LOADING') {
          return 'Loading'
        }
        if (status === 'STOPPED') {
          return 'Paused'
        }
        return 'Disconnected'
      }

      return null
    },
  )
}

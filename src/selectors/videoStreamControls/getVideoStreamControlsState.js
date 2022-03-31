import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

export default ({ videoStreamKey, property, defaultValue }) => {
  return createSelector(
    [state => state.videoStreamControls],
    streams => {
      return get(streams, `[${videoStreamKey}].${property}`, defaultValue)
    },
  )
}

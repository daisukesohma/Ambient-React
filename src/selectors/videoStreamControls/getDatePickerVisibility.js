import { createSelector } from '@reduxjs/toolkit'
import isUndefined from 'lodash/isUndefined'

export default ({ videoStreamKey }) => {
  return createSelector(
    [state => state.videoStreamControls],
    streams => {
      if (videoStreamKey && streams[videoStreamKey]) {
        return isUndefined(streams[videoStreamKey].isDatePickerVisible)
          ? false
          : streams[videoStreamKey].isDatePickerVisible
      }
      return false
    },
  )
}

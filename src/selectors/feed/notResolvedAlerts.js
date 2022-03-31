import { createSelector } from '@reduxjs/toolkit'
import filter from 'lodash/filter'

export default createSelector(
  [state => state.feed.alertEvents],
  alertEvents => {
    return filter(alertEvents, alertEvent => alertEvent && !alertEvent.resolved)
  },
)

import { createSelector } from '@reduxjs/toolkit'

export default createSelector(
  [state => state.contextGraph.alerts],
  alerts => {
    return alerts
      .filter(a => a.incompatibleStreams.length > 0)
      .map(a => ({
        id: a.id,
        incompatibleStreams: a.incompatibleStreams,
      }))
  },
)

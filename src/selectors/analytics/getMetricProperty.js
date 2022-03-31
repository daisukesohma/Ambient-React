import { createSelector } from '@reduxjs/toolkit'

export default ({ metric, property }) => {
  return createSelector([state => state.analytics.metrics], metrics => {
    return metrics[metric.id][property]
  })
}

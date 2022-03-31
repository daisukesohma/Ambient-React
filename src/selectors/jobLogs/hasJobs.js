import { createSelector } from '@reduxjs/toolkit'

export default createSelector(
  [state => state.jobLog.jobs],
  jobs => jobs && jobs.length > 0,
)

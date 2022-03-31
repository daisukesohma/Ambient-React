import { createSelector } from '@reduxjs/toolkit'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import moment from 'moment'

// TODO @Eric, remove moment from here when createdTs is not a datetime, but a unix ts
// Tracker: https://ambient-ai.atlassian.net/browse/ENG-2518
export default createSelector([state => state.jobLog.jobs], jobs =>
  sortBy(jobs, [job => -moment(get(job, 'createdTs'))]),
)

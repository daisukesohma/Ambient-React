import { createSelector } from '@reduxjs/toolkit'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'

export default createSelector([state => state.feed.activities], activities =>
  sortBy(activities, [activity => -get(activity, 'ts')]),
)

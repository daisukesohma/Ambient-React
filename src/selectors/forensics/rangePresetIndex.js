import { createSelector } from '@reduxjs/toolkit'

export default createSelector(
  [state => state.forensics.searchRangePresetIndex],
  index => index,
)

import { createSelector } from '@reduxjs/toolkit'

export default createSelector(
  [state => state.forensics.isReIdSearchVisible],
  isVisible => isVisible,
)

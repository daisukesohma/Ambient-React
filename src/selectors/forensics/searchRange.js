import { createSelector } from '@reduxjs/toolkit'

export default createSelector(
  [state => state.forensics.searchTsRange],
  range => range,
)

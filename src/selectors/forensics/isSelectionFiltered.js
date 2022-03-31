import { createSelector } from '@reduxjs/toolkit'

export default createSelector(
  [
    state => state.forensics.searchTsRange,
    state => state.forensics.selectionTsRange,
  ],
  (searchRange, selectionRange) => {
    return (
      searchRange[0] !== selectionRange[0] ||
      searchRange[1] !== selectionRange[1]
    )
  },
)

import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

export default createSelector(
  [state => state.alertModal.dispatchStatus],
  dispatchStatus => {
    return get(dispatchStatus, 'responders', [])
  },
)

import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

export default createSelector(
  [state => state.alertModal.dispatchStatus],
  dispatchStatus => get(dispatchStatus, 'alertEvent.resolved', false),
)

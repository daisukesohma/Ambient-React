import { createSelector } from '@reduxjs/toolkit'
import orderBy from 'lodash/orderBy'

export default createSelector(
  [state => state.verification.alertInstances],
  alertInstances => orderBy(alertInstances, 'tsIdentifier'),
)

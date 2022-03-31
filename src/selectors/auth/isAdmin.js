import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

export default createSelector(
  [state => state.auth.profile],
  profile => get(profile, 'role.role', null) === 'Administrator',
)

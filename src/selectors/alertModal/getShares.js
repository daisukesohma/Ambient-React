import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import map from 'lodash/map'

export default createSelector(
  [state => state.alertModal.dispatchStatus],
  dispatchStatus =>
    map(get(dispatchStatus, 'shares', []), share => ({
      id: share.id,
      name: get(share, 'token.externalProfile.name'),
      tsExpiry: get(share, 'token.tsExpiry'),
      token: get(share, 'token.token'),
      shareLink: share.shareLink,
    })),
)

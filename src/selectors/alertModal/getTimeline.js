import { createSelector } from '@reduxjs/toolkit'
import moment from 'moment'
import get from 'lodash/get'
import reject from 'lodash/reject'
import sortBy from 'lodash/sortBy'

export default createSelector(
  [state => state.alertModal.dispatchStatus],
  dispatchStatus => {
    const timeline = sortBy(
      get(dispatchStatus, 'alertEvent.timeline', [
        {
          status: 'raised',
          ts: moment().unix(),
          __typename: 'AlertEventStatusType',
        },
      ]),
      [tl => -tl.ts],
    )

    return reject(timeline, { status: 'acked' })
  },
)

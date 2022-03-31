import { AlertEventStatusEnum } from '../../../enums'
import { PANEL_ITEMS_LIMIT } from '../constants'

import { fetchAlertEventsRequested, fetchAlertEventsFetchFailed } from './index'

describe('actions', () => {
  it('alertEventsRequested Action', () => {
    const accountSlug = 'acme'
    const status = AlertEventStatusEnum.RAISED
    const severities = ['sev0']
    const limit = PANEL_ITEMS_LIMIT

    const payload = { accountSlug, status, limit, severities }
    const actual = fetchAlertEventsRequested(payload)
    expect(actual).toEqual({
      type: fetchAlertEventsRequested.type,
      payload,
    })
  })

  it('alertEventsFetchFailed Action', () => {
    const message = 'message'
    const payload = { message }
    const actual = fetchAlertEventsFetchFailed(payload)
    expect(actual).toEqual({
      type: fetchAlertEventsFetchFailed.type,
      payload,
    })
  })
})

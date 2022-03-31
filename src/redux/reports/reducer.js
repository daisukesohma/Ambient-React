/* eslint-disable import/no-cycle */
/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'
import get from 'lodash/get'

import tsAtMidnight from '../../utils/dateTime/tsAtMidnight'

import {
  CHANGE_DATE_FILTER,
  CHANGE_ALERT_EVENTS,
  DISPLAY_ALERT_EVENTS,
  FETCH_SITES_REQUESTED,
  FETCH_SITES_SUCCEEDED,
  FETCH_SITES_FAILED,
} from './actionTypes'

const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone
export const initialState = {
  loading: true,
  sites: [],
  startTs: tsAtMidnight(0, LOCAL_TIMEZONE),
  endTs: tsAtMidnight(1, LOCAL_TIMEZONE),
  alertEvents: {
    acknowledgement: {
      key: 'acknowledgement',
      title: '',
      instances: [],
    },
    time_to_act: {
      key: 'time_to_act',
      title: '',
      instances: [],
    },
    filtered_dispatches: {
      key: 'filtered_dispatches',
      title: '',
      instances: [],
    },
    dispatches: {
      key: 'filtered_dispatches',
      title: '',
      instances: [],
    },
    unresolved_dispatches: {
      key: 'filtered_dispatches',
      title: '',
      instances: [],
    },
  },
  alertEventsSelected: [],
  alertEventsSelectedKey: null,
  alertEventsSelectedTitle: '',
}

const reportsReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    // FETCH
    case CHANGE_DATE_FILTER:
      draft.startTs = get(action, 'payload.startTs')
      draft.endTs = get(action, 'payload.endTs')
      return draft

    case CHANGE_ALERT_EVENTS:
      draft.alertEvents[get(action, 'payload.key')] = get(action, 'payload')
      return draft

    case DISPLAY_ALERT_EVENTS:
      draft.alertEventsSelectedKey = get(action, 'payload')
      draft.alertEventsSelected =
        draft.alertEvents[get(action, 'payload')].instances
      draft.alertEventsSelectedTitle =
        draft.alertEvents[get(action, 'payload')].title
      return draft

    case FETCH_SITES_REQUESTED:
      draft.loading = true
      draft.payload = get(action, 'payload')
      return draft

    case FETCH_SITES_SUCCEEDED:
      draft.loading = false
      draft.sites = get(action, 'payload')
      return draft

    case FETCH_SITES_FAILED:
      draft.loading = false
      return draft

    default:
      return draft
  }
})

export default reportsReducer

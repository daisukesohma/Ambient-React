/* eslint-disable @typescript-eslint/ban-ts-comment */
import { call, put, takeLatest } from 'redux-saga/effects'
import { get, each, map, find } from 'lodash'
import {
  createQueryV2 as createQuery,
  createMutationV2 as createMutation,
} from 'providers/apollo'
import {
  fetchSitesRequested,
  fetchSitesSucceeded,
  fetchSitesFailed,
  fetchAlertEventsRequested,
  fetchAlertEventsSucceeded,
  fetchAlertEventsFailed,
  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,
  fetchStreamsRequested,
  fetchStreamsSucceeded,
  fetchStreamsFailed,
  resolveAlertRequested,
  resolveAlertSucceeded,
  resolveAlertFailed,
} from 'pages/HistoryV3/alertHistorySlice'
import { createNotification } from 'redux/slices/notifications'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'

import dummyAlerts from './dummyAlerts'
import {
  GET_ACCOUNT_SITES,
  GET_ALERT_EVENTS_PAGINATED,
  GET_ALERTS,
  GET_STREAMS,
  RESOLVE_ALERT_EVENT,
} from './gql'

function* fetchSites(action: { payload: { accountSlug: string } }) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_ACCOUNT_SITES, {
      accountSlug,
    })
    yield put(fetchSitesSucceeded({ allSites: response.data.allSites }))
  } catch (error) {
    const { message } = error
    yield put(fetchSitesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

const DUMMY_DATA = false

function* fetchAlertEvents(action: { payload: { accountSlug: string, page: number } }) {
  try {
    if (DUMMY_DATA) {
      const { data } = dummyAlerts
      yield put(
        fetchAlertEventsSucceeded({
          alertEvents: get(data, 'alertEventsPaginated.alertEvents'),
          pages: get(data, 'alertEventsPaginated.pages'),
          page: get(data, 'alertEventsPaginated.currentPage'),
        }),
      )
    } else {
      const { accountSlug, page } = action.payload
      const { data } = yield call(
        createQuery,
        GET_ALERT_EVENTS_PAGINATED,
        {
          accountSlug,
          page,
        },
      )
      yield put(
        fetchAlertEventsSucceeded({
          alertEvents: get(data, 'alertEventsPaginated.alertEvents'),
          pages: get(data, 'alertEventsPaginated.pages'),
          page: get(data, 'alertEventsPaginated.currentPage'),
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(fetchAlertEventsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchThreatSignatures(action: {
  payload: { accountSlug: string; siteSlug: string }
}) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const { data } = yield call(createQuery, GET_ALERTS, {
      accountSlug,
      siteSlug,
    })
    const threatSignatures: { label: string; value: string }[] = []
    each(data.alerts, alert => {
      const existing = find(threatSignatures, {
        value: alert.threatSignature.id,
      })
      if (!existing) {
        threatSignatures.push({
          label: alert.threatSignature.name,
          value: alert.threatSignature.id,
        })
      }
    })
    yield put(fetchThreatSignaturesSucceeded({ threatSignatures }))
  } catch (error) {
    const { message } = error
    yield put(fetchThreatSignaturesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchStreams(action: {
  payload: { accountSlug: string; siteSlug: string }
}) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const { data } = yield call(createQuery, GET_STREAMS, {
      accountSlug,
      siteSlug,
    })
    const streams = map(data.streams, ({ name, id }) => ({
      label: name,
      value: id,
    }))
    yield put(fetchStreamsSucceeded({ streams }))
  } catch (error) {
    const { message } = error
    yield put(fetchStreamsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* resolveAlert(action: { payload: { alertEvent: { id: number, eventHash: string } } }) {
  try {
    const { alertEvent } = action.payload
    yield call(trackEventToMixpanel, MixPanelEventEnum.ALERT_RESOLVED)
    yield call(createMutation, RESOLVE_ALERT_EVENT, {
      alertEventId: alertEvent.id,
      alertEventHash: alertEvent.eventHash,
    })
    yield put(resolveAlertSucceeded({ resolvedAlertEvent: alertEvent }))
    yield put(createNotification({ message: 'Alert Resolved' }))
  } catch (error) {
    const { message } = error
    yield put(resolveAlertFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

export default function* alertHistorySaga(): Generator {
  // @ts-ignore
  yield takeLatest(fetchSitesRequested, fetchSites)
  // @ts-ignore
  yield takeLatest(fetchAlertEventsRequested, fetchAlertEvents)
  // @ts-ignore
  yield takeLatest(fetchThreatSignaturesRequested, fetchThreatSignatures)
  // @ts-ignore
  yield takeLatest(fetchStreamsRequested, fetchStreams)
  // @ts-ignore
  yield takeLatest(resolveAlertRequested, resolveAlert)
}

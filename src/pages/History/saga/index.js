/* eslint-disable no-throw-literal */
import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
// src
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
  fetchDownloadLinkRequested,
  fetchDownloadLinkSucceeded,
  fetchDownloadLinkFailed,
} from 'pages/History/alertHistorySlice'
import { createNotification } from 'redux/slices/notifications'

import {
  GET_ACCOUNT_SITES,
  GET_ALERT_EVENTS_PAGINATED,
  GET_ALERTS,
  GET_STREAMS,
  RESOLVE_ALERT_EVENT,
} from './gql'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'

function* fetchSites(action) {
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

function* fetchAlertEvents(action) {
  try {
    const { variables } = action.payload
    const { data } = yield call(
      createQuery,
      GET_ALERT_EVENTS_PAGINATED,
      variables,
    )

    yield put(
      fetchAlertEventsSucceeded({
        alertEvents: get(data, 'alertEventsPaginated.alertEvents'),
        pages: get(data, 'alertEventsPaginated.pages'),
        page: get(data, 'alertEventsPaginated.currentPage'),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchAlertEventsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchThreatSignatures(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const { data } = yield call(createQuery, GET_ALERTS, {
      accountSlug,
      siteSlug,
    })
    const threatSignatures = []
    data.alerts.forEach(alert => {
      const existing = threatSignatures.find(
        a => a.value === alert.threatSignature.id,
      )
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

function* fetchStreams(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const { data } = yield call(createQuery, GET_STREAMS, {
      accountSlug,
      siteSlug,
    })
    const streams = data.streams.map(stream => ({
      label: stream.name,
      value: stream.id,
    }))
    yield put(fetchStreamsSucceeded({ streams }))
  } catch (error) {
    const { message } = error
    yield put(fetchStreamsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* resolveAlert(action) {
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

function* fetchDownloadLink(action) {
  const variables = {
    ...action.payload,
    download: true,
    status: null, // download all tabs
  }

  try {
    const { data } = yield call(
      createQuery,
      GET_ALERT_EVENTS_PAGINATED,
      variables,
    )

    const downloadLink = data.alertEventsPaginated.link
    if (downloadLink) {
      yield put(fetchDownloadLinkSucceeded({ link: downloadLink }))
    } else {
      throw {
        message: 'Failed to download data. Please try again later.',
      }
    }
  } catch (error) {
    const { message } = error
    yield put(fetchDownloadLinkFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* alertHistorySaga() {
  yield takeLatest(fetchSitesRequested, fetchSites)
  yield takeLatest(fetchAlertEventsRequested, fetchAlertEvents)
  yield takeLatest(fetchThreatSignaturesRequested, fetchThreatSignatures)
  yield takeLatest(fetchStreamsRequested, fetchStreams)
  yield takeLatest(resolveAlertRequested, resolveAlert)
  yield takeLatest(fetchDownloadLinkRequested, fetchDownloadLink)
}

export default alertHistorySaga

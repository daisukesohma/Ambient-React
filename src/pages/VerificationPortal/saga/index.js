import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
import get from 'lodash/get'
// src
import {
  createNotification,
  NOTIFICATION_TYPES,
} from 'redux/slices/notifications'
import { createQuery, createQueryV2, createMutation } from 'providers/apollo'

import { FETCH_LIMIT, USE_DUMMY_DATA } from '../constants'
import {
  alertHistoryFetchRequested,
  alertHistoryFetchSucceeded,
  alertHistoryFetchFailed,
  alertClipFetchRequested,
  alertClipFetchSucceeded,
  alertClipFetchFailed,
  sitesFetchRequested,
  sitesFetchSucceeded,
  sitesFetchFailed,
  verifyAlertRequested,
  verifyAlertSucceeded,
  verifyAlertFailed,
  getAlertInstanceRequested,
  getAlertInstanceSucceeded,
  getAlertInstanceFailed,
  allStreamsRequested,
  allStreamsSucceeded,
  allThreatSignaturesRequested,
  allThreatSignaturesSucceeded,
} from '../redux/verificationSlice'

import {
  GET_ALERT_INSTANCES,
  GET_ACTIVE_SITES,
  VERIFY_ALERT_INSTANCE,
  GET_ALERT_INSTANCE,
  GET_ALERT_CLIP_BY_HASH,
  ALL_STREAMS,
  ALL_THREAT_SIGNATURES,
} from './gql'

import fakeResponse from './dummy'

function* fetchHistoryInstances(action) {
  try {
    let alertInstances
    if (USE_DUMMY_DATA) {
      alertInstances = get(fakeResponse, 'data.getAlertInstancesPaginated', [])
    } else {
      const { page } = action.payload
      const filter = yield select(state => state.verification.historicalFilter)
      const params = {
        threatSignatureIds: filter.threatSignatures,
        streamIds: filter.streams,
        siteIds: filter.sites,
        tsStart: Math.floor(filter.tsStart),
        tsEnd: Math.floor(filter.tsEnd),
        limit: FETCH_LIMIT,
        status: filter.status,
        page,
      }

      const response = yield call(createQueryV2, GET_ALERT_INSTANCES, params)
      alertInstances = get(response, 'data.getAlertInstancesPaginated', {})
    }
    yield put(alertHistoryFetchSucceeded(alertInstances))
  } catch (error) {
    const { message } = error
    yield put(alertHistoryFetchFailed({ message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* fetchAlertClip(action) {
  const { alertInstanceId, alertInstanceHash } = action.payload
  try {
    const response = yield call(createQueryV2, GET_ALERT_CLIP_BY_HASH, {
      alertInstanceId,
      alertInstanceHash,
    })
    yield put(
      alertClipFetchSucceeded({ alert: response.data.alertInstanceByHash }),
    )
  } catch (error) {
    const { message } = error
    yield put(alertClipFetchFailed({ alertInstanceId, message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* fetchSites() {
  try {
    const response = yield call(createQueryV2, GET_ACTIVE_SITES)
    const sites = get(response, 'data.getActiveSites', [])
    yield put(sitesFetchSucceeded({ sites }))
  } catch (error) {
    const { message } = error
    yield put(sitesFetchFailed({ message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* verifyAlert(action) {
  const { alertInstanceId, alertHash, status } = action.payload
  try {
    const response = yield call(createMutation, VERIFY_ALERT_INSTANCE, {
      alertInstanceId,
      alertHash,
      status,
    })
    const { message } = response.data.verifyAlertInstance
    yield put(verifyAlertSucceeded({ id: alertInstanceId }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.SUCCESS }))
  } catch (error) {
    const { message } = error
    yield put(verifyAlertFailed({ alertInstanceId, message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* fetchAllStreams() {
  try {
    const response = yield call(createQuery, ALL_STREAMS, {
      query: '',
      limit: 10000000,
    })
    const streams = response.data.searchStreamsV2
    yield put(allStreamsSucceeded({ streams }))
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* fetchAllThreatSignatures() {
  try {
    const response = yield call(createQuery, ALL_THREAT_SIGNATURES)
    const threatSignatures = response.data.allThreatSignatures
    yield put(allThreatSignaturesSucceeded({ threatSignatures }))
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getAlert(action) {
  try {
    const response = yield call(
      createQueryV2,
      GET_ALERT_INSTANCE,
      action.payload,
    )
    yield put(
      getAlertInstanceSucceeded({ alert: response.data.getAlertInstance }),
    )
  } catch (error) {
    const { message } = error
    yield put(getAlertInstanceFailed({ message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* verificationSaga() {
  // Fetch History Alert Instances
  yield takeLatest(alertHistoryFetchRequested, fetchHistoryInstances)
  // Fetch Sites
  yield takeLatest(sitesFetchRequested, fetchSites)
  // Search Alert By ID
  yield takeLatest(getAlertInstanceRequested, getAlert)
  // Streams
  yield takeLatest(allStreamsRequested, fetchAllStreams)
  yield takeLatest(allThreatSignaturesRequested, fetchAllThreatSignatures)

  // Make verify action
  yield takeEvery(verifyAlertRequested, verifyAlert)
  // Fetch Clips for Alerts (EvidenceGif)
  yield takeEvery(alertClipFetchRequested, fetchAlertClip)
}

export default verificationSaga

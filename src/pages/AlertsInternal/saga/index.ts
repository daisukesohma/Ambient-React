import { call, put, takeLatest } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import map from 'lodash/map'

import {
  fetchAllAlertsPaginatedRequested,
  fetchAllAlertsPaginatedSucceeded,
  fetchAllAlertsPaginatedFailed,
  fetchVerificationTypesRequested,
  fetchVerificationTypesSucceeded,
  fetchVerificationTypesFailed,
  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,
  recallAlertToSOCRequested,
  recallAlertToSOCSucceeded,
  recallAlertToSOCFailed,
  setRecallModalClose,
} from '../redux/alertsInternalSlice'

import {
  ALL_ALERTS_PAGINATED,
  GET_VERIFICATION_TYPES,
  GET_ALL_THREAT_SIGNATURES,
  RECALL_ALERT_TO_SOC,
} from './gql'

interface ActionType {
  payload: {
    accountSlug: string
    siteSlugs: [string] | null
    threatSignatureIds: [number] | null
    verificationType: string | null
    severities: [string]
    statuses: [string] | null
    searchQuery: string
    tsStart: number
    tsEnd: number
  }
}

function* fetchAllAlertsPaginated(action: ActionType): SagaIterator {
  try {
    const { data } = yield call(
      createQuery,
      ALL_ALERTS_PAGINATED,
      action.payload,
    )
    yield put(fetchAllAlertsPaginatedSucceeded(data.allAlertsPaginated))
  } catch (error) {
    const { message } = error
    yield put(fetchAllAlertsPaginatedFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchVerificationTypes(): SagaIterator {
  try {
    const { data } = yield call(createQuery, GET_VERIFICATION_TYPES)
    const vt = map(data.verificationTypes, sev => {
      return {
        label: sev.name,
        value: sev.key,
      }
    })
    yield put(
      fetchVerificationTypesSucceeded({
        verificationTypes: vt,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchVerificationTypesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchThreatSignatures() {
  try {
    const { data } = yield call(createQuery, GET_ALL_THREAT_SIGNATURES)
    const allThreatSignatures = map(
      data.allThreatSignatures,
      ({ name, id }) => ({ label: name, value: id }),
    )
    yield put(fetchThreatSignaturesSucceeded({ allThreatSignatures }))
  } catch (error) {
    const { message } = error
    yield put(fetchThreatSignaturesFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* recallAlertToSOC(action: {
  payload: {
    alertId: number
    durationSecs: number
    tsStart: number
    tsEnd: number
  }
}) {
  try {
    const { alertId, durationSecs, tsStart, tsEnd } = action.payload
    const { data } = yield call(createMutation, RECALL_ALERT_TO_SOC, {
      alertId,
      durationSecs,
      tsStart,
      tsEnd,
    })
    const { alert } = data.recallAlertToSoc
    yield put(recallAlertToSOCSucceeded({ alert }))
    yield put(setRecallModalClose())
  } catch (error) {
    const { message } = error
    yield put(recallAlertToSOCFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* internalSaga(): SagaIterator {
  yield takeLatest(fetchAllAlertsPaginatedRequested, fetchAllAlertsPaginated)
  yield takeLatest(fetchVerificationTypesRequested, fetchVerificationTypes)
  yield takeLatest(fetchThreatSignaturesRequested, fetchThreatSignatures)
  yield takeLatest(recallAlertToSOCRequested, recallAlertToSOC)
}

export default internalSaga

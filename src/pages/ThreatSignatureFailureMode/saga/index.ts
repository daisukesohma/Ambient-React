import { call, put, takeLatest } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'

import {
  fetchFailureModesRequested,
  fetchFailureModesSucceeded,
  fetchFailureModesFailed,
  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,
  addFailureModeRequested,
  addFailureModeSucceeded,
  addFailureModeFailed,
  deleteFailureModeRequested,
  deleteFailureModeSucceeded,
  deleteFailureModeFailed,
} from '../redux/threatSignatureFailureModeSlice'

import {
  GET_ALL_THREAT_SIGNATURES,
  GET_FAILURE_MODES,
  ADD_FAILURE_MODE,
  DELETE_FAILURE_MODE,
} from './gql'

interface ActionType {
  payload: {
    input: {
      threatSignatureId: number
      failureModeId: number
    }
    tsStart: number
    tsEnd: number
  }
}

function* fetchFailureModes(): SagaIterator {
  try {
    const { data } = yield call(createQuery, GET_FAILURE_MODES)
    yield put(fetchFailureModesSucceeded({ failureModes: data.failureModes }))
  } catch (error) {
    const { message } = error
    yield put(fetchFailureModesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchThreatSignatures(action: {
  payload: {
    tsStart: number
    tsEnd: number
  }
}): SagaIterator {
  try {
    const { tsStart, tsEnd } = action.payload
    const { data } = yield call(createQuery, GET_ALL_THREAT_SIGNATURES, {
      tsStart,
      tsEnd,
    })
    yield put(
      fetchThreatSignaturesSucceeded({
        allThreatSignatures: data.allThreatSignatures,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchThreatSignaturesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* addFailureMode(action: ActionType): SagaIterator {
  try {
    const { input, tsStart, tsEnd } = action.payload
    const { data } = yield call(createMutation, ADD_FAILURE_MODE, {
      input,
    })
    yield put(
      addFailureModeSucceeded({
        addFailureModeToSignature: data.addFailureModeToSignature,
      }),
    )
    yield put(fetchThreatSignaturesRequested({ tsStart, tsEnd }))
  } catch (error) {
    const { message } = error
    yield put(addFailureModeFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteFailureMode(action: ActionType): SagaIterator {
  try {
    const { input, tsStart, tsEnd } = action.payload
    const { data } = yield call(createMutation, DELETE_FAILURE_MODE, {
      input,
    })
    yield put(
      deleteFailureModeSucceeded({
        deleteFailureModeFromSignature: data.deleteFailureModeFromSignature,
      }),
    )
    yield put(fetchThreatSignaturesRequested({ tsStart, tsEnd }))
  } catch (error) {
    const { message } = error
    yield put(deleteFailureModeFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* internalSaga(): SagaIterator {
  yield takeLatest(fetchFailureModesRequested, fetchFailureModes)
  yield takeLatest(fetchThreatSignaturesRequested, fetchThreatSignatures)
  yield takeLatest(addFailureModeRequested, addFailureMode)
  yield takeLatest(deleteFailureModeRequested, deleteFailureMode)
}

export default internalSaga

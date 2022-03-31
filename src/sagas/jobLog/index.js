// saga
import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  jobLogsFetchRequested,
  jobLogsFetchSucceeded,
  jobLogsFetchFailed,
  createDiscoveryRequested,
  createDiscoverySucceeded,
  createDiscoveryFailed,
} from 'redux/slices/jobLog'

import { GET_JOB_LOGS_PAGINATED, CREATE_NEW_DISCOVERY } from './gql'

// Discovery Variable
// {
//   "capture_frame": false,
//   "credentials": [
//     {
//       "password": "123",
//       "username": "abc"
//     }
//   ],
//   "endpoints": [
//     {
//       "ip": "192.168.1.1-192.168.1.10",
//       "subnet": "192.168.1.0/24"
//     },
//     {
//       "ip": "192.168.1.1-192.168.1.10",
//       "subnet": "192.168.1.0/24"
//     }
//   ],
//   "ports": [
//     554
//   ],
//   "resolution": "64x64",
//   "scan_nmap": true,
//   "scan_onvif": true,
//   "scan_onvif_wsd": false
// }

function* fetchResources(action) {
  const { accountSlug, nodeIdentifiers, page, limit } = action.payload
  try {
    const response = yield call(createQuery, GET_JOB_LOGS_PAGINATED, {
      accountSlug,
      nodeIdentifiers,
      page,
      limit,
    })
    yield put(jobLogsFetchSucceeded(response.data.getNodeRequestsPaginated))
  } catch (error) {
    const { message } = error
    yield put(jobLogsFetchFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* createDiscovery(action) {
  const { nodeIdentifier, requestType, requestJson } = action.payload
  try {
    const response = yield call(createMutation, CREATE_NEW_DISCOVERY, {
      nodeIdentifier,
      requestType,
      requestJson,
    })
    const { message } = response.data.createNodeRequest
    yield put(createDiscoverySucceeded(response.data.createNodeRequest))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(createDiscoveryFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* jobLogSaga() {
  yield takeLatest(jobLogsFetchRequested, fetchResources)
  yield takeLatest(createDiscoveryRequested, createDiscovery)
}

export default jobLogSaga

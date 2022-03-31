import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  fetchReIdVectorsRequested,
  fetchReIdVectorsSucceeded,
  fetchReIdVectorsFailed,
} from 'redux/slices/reId'

import { GET_REID_VECTORS } from './gql'

function* fetchReIdVectorsInfo(action) {
  const { startTs, streamId, deltaSecs } = action.payload
  try {
    const response = yield call(createQuery, GET_REID_VECTORS, {
      startTs,
      streamId,
      deltaSecs,
    })
    yield put(
      fetchReIdVectorsSucceeded(
        response.data.getReidVectorsInTimeRange.reidData,
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchReIdVectorsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* reIdSaga() {
  yield takeLatest(fetchReIdVectorsRequested, fetchReIdVectorsInfo)
}

export default reIdSaga

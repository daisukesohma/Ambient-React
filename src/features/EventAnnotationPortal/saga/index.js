import { call, put, takeLatest } from 'redux-saga/effects'

import { createNotification } from 'redux/slices/notifications'
import { createQuery } from 'providers/apollo'
import map from 'lodash/map'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'

import {
  dataPointToAnnotateFetchRequested,
  dataPointToAnnotateFetchSucceeded,
  dataPointToAnnotateFetchFailed,
  getDataPointFetchRequested,
  getDataPointFetchSucceeded,
  getDataPointFetchFailed,
  updateDataPointEventAnnotationFetchRequested,
  updateDataPointEventAnnotationFetchSucceeded,
  updateDataPointEventAnnotationFetchFailed,
  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,
} from '../redux/eventAnnotationPortalSlice'

import {
  GET_DATA_POINT_TO_ANNOTATE,
  GET_DATA_POINT,
  UPDATE_DATA_POINT_EVENT_ANNOTATION,
  GET_ALL_THREAT_SIGNATURES,
} from './gql'

function* getDataPointToAnnotate(action) {
  try {
    const { threatSignatureIds, label } = action.payload
    const ids = isEmpty(threatSignatureIds) ? null : threatSignatureIds
    // TODO: expose time window and randomize as options in UI
    const timeNow = Date.now()  // in ms
    const timeWeekAgo = timeNow - 1000 * 60 * 60 * 24 * 7
    const response = yield call(createQuery, GET_DATA_POINT_TO_ANNOTATE, {
      threatSignatureIds: ids,
      label,
      tsCreatedStart: timeWeekAgo,
      tsCreatedEnd: timeNow,
      randomize: true,
    })
    yield put(
      dataPointToAnnotateFetchSucceeded(response.data.dataPointToAnnotate),
    )
  } catch (error) {
    const { message } = error
    yield put(dataPointToAnnotateFetchFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* getDataPoint(action) {
  const { dataPointId } = action.payload
  try {
    const { data, errors } = yield call(createQuery, GET_DATA_POINT, {
      dataPointId,
    })
    if (!isEmpty(errors)) {
      yield put(createNotification({ message: errors[0].message }))
      yield put(getDataPointFetchFailed({ message: errors[0].message }))
    } else {
      yield put(getDataPointFetchSucceeded(data.getDataPoint))
    }
  } catch (error) {
    const { message } = error
    yield put(getDataPointFetchFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* updateDataPointEventAnnotation(action) {
  const { dataPointId, label, other, failureModeIds } = action.payload
  try {
    const params = label
      ? {
          dataPointId,
          label,
        }
      : {
          dataPointId,
          label,
          other,
          failureModeIds,
        }
    const response = yield call(
      createQuery,
      UPDATE_DATA_POINT_EVENT_ANNOTATION,
      params,
    )
    yield put(
      updateDataPointEventAnnotationFetchSucceeded(
        response.data.getEventAnnotation,
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(updateDataPointEventAnnotationFetchFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchThreatSignatures(action) {
  try {
    const { dataPointId } = action.payload
    const response = yield call(createQuery, GET_ALL_THREAT_SIGNATURES)
    const allThreatSignatures = response.data.allThreatSignatures
    const defaultSelected = map(
      filter(allThreatSignatures, ts => !isEmpty(ts.validFailureModes)),
      ({ name, id }) => ({ label: name, value: id }),
    )
    const selectedThreatSignatureIds = map(defaultSelected, 'value')
    yield put(
      fetchThreatSignaturesSucceeded({ allThreatSignatures, defaultSelected }),
    )
    if (dataPointId) {
      const parsedDataPointId = parseInt(dataPointId, 10)
      yield put(getDataPointFetchRequested({ dataPointId: parsedDataPointId }))
    } else {
      yield put(
        dataPointToAnnotateFetchRequested({
          threatSignatureIds: selectedThreatSignatureIds,
          label: false,
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(fetchThreatSignaturesFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* eventAnnotationPortalSaga() {
  yield takeLatest(dataPointToAnnotateFetchRequested, getDataPointToAnnotate)
  yield takeLatest(getDataPointFetchRequested, getDataPoint)
  yield takeLatest(
    updateDataPointEventAnnotationFetchRequested,
    updateDataPointEventAnnotation,
  )
  yield takeLatest(fetchThreatSignaturesRequested, fetchThreatSignatures)
}

export default eventAnnotationPortalSaga

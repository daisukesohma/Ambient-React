import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import get from 'lodash/get'
// src
import { createNotification } from 'redux/slices/notifications'
import { createQuery, createMutation } from 'providers/apollo'

import {
  campaignsFetchRequested,
  campaignsFetchSucceeded,
  campaignsFetchFailed,
  allCampaignsFetchRequested,
  allCampaignsFetchSucceeded,
  allCampaignsFetchFailed,
  dataPointsFetchRequested,
  dataPointsFetchSucceeded,
  dataPointsFetchFailed,
  updateDataPointEventAnnotationFetchRequested,
  updateDataPointEventAnnotationFetchSucceeded,
  updateDataPointEventAnnotationFetchFailed,
  getEventAnnotationFetchRequested,
  getEventAnnotationFetchSucceeded,
  getEventAnnotationFetchFailed,
  archiveCampaignRequested,
  archiveCampaignSucceeded,
  archiveCampaignFailed,
  stopCampaignRequested,
  stopCampaignSucceeded,
  stopCampaignFailed,
  startCampaignRequested,
  startCampaignSucceeded,
  startCampaignFailed,
  deleteCampaignRequested,
  deleteCampaignSucceeded,
  deleteCampaignFailed,
  createCampaignRequested,
  createCampaignSucceeded,
  createCampaignFailed,
  fetchAllThreatSignaturesRequested,
  fetchAllThreatSignaturesSucceeded,
  fetchAllThreatSignaturesFailed,
  confirmDialogClose,
} from '../redux/dataInfraSlice'

import {
  GET_DATA_CAMPAIGNS_PAGINATED,
  GET_DATA_POINTS_PAGINATED,
  UPDATE_DATA_POINT_EVENT_ANNOTATION,
  GET_EVENT_ANNOTATION,
  CREATE_DATA_CAMPAIGN,
  ARCHIVE_DATA_CAMPAIGN,
  STOP_DATA_CAMPAIGN,
  START_DATA_CAMPAIGN,
  DELETE_DATA_CAMPAIGN,
  GET_THREAT_SIGNATURES,
} from './gql'

function* fetchCampaigns(action) {
  try {
    const status = get(action.payload, 'status', null)
    const { page, limit } = action.payload
    const response = yield call(createQuery, GET_DATA_CAMPAIGNS_PAGINATED, {
      page,
      limit,
      status,
    })
    yield put(campaignsFetchSucceeded(response.data.dataCampaignsPaginated))
  } catch (error) {
    const { message } = error
    yield put(campaignsFetchFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchAllCampaigns(action) {
  try {
    const response = yield call(createQuery, GET_DATA_CAMPAIGNS_PAGINATED, {})
    yield put(allCampaignsFetchSucceeded(response.data.dataCampaignsPaginated))
  } catch (error) {
    const { message } = error
    yield put(allCampaignsFetchFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* createCampaign(action) {
  try {
    const {
      threatSignatureId,
      mode,
      name,
      page,
      limit,
      campaignSwitch,
    } = action.payload
    const response = yield call(createMutation, CREATE_DATA_CAMPAIGN, {
      threatSignatureId,
      mode,
      name,
    })
    yield put(createCampaignSucceeded(response.data))
    if (campaignSwitch) {
      yield put(campaignsFetchRequested({ page, limit, status: 'ARCHIVED' }))
    } else {
      yield put(campaignsFetchRequested({ page, limit }))
    }
  } catch (error) {
    const { message } = error
    yield put(createCampaignFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* archiveCampaign(action) {
  try {
    const { dataCampaignId, page, limit, campaignSwitch } = action.payload
    const response = yield call(createMutation, ARCHIVE_DATA_CAMPAIGN, {
      dataCampaignId,
    })
    yield put(archiveCampaignSucceeded(response.data.dataCampaign))
    if (campaignSwitch) {
      yield put(campaignsFetchRequested({ page, limit, status: 'ARCHIVED' }))
    } else {
      yield put(campaignsFetchRequested({ page, limit }))
    }
    yield put(confirmDialogClose())
  } catch (error) {
    const { message } = error
    yield put(archiveCampaignFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* stopCampaign(action) {
  try {
    const { dataCampaignId, page, limit, campaignSwitch } = action.payload
    const response = yield call(createMutation, STOP_DATA_CAMPAIGN, {
      dataCampaignId,
    })
    yield put(stopCampaignSucceeded(response.data.dataCampaign))
    if (campaignSwitch) {
      yield put(campaignsFetchRequested({ page, limit, status: 'ARCHIVED' }))
    } else {
      yield put(campaignsFetchRequested({ page, limit }))
    }
    yield put(confirmDialogClose())
  } catch (error) {
    const { message } = error
    yield put(stopCampaignFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* startCampaign(action) {
  try {
    const { dataCampaignId, page, limit, campaignSwitch } = action.payload
    const response = yield call(createMutation, START_DATA_CAMPAIGN, {
      dataCampaignId,
    })
    yield put(startCampaignSucceeded(response.data.dataCampaign))
    if (campaignSwitch) {
      yield put(campaignsFetchRequested({ page, limit, status: 'ARCHIVED' }))
    } else {
      yield put(campaignsFetchRequested({ page, limit }))
    }
    yield put(confirmDialogClose())
  } catch (error) {
    const { message } = error
    yield put(startCampaignFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* deleteCampaign(action) {
  try {
    const { dataCampaignId, page, limit, campaignSwitch } = action.payload
    const response = yield call(createMutation, DELETE_DATA_CAMPAIGN, {
      dataCampaignId,
    })
    yield put(deleteCampaignSucceeded(response.data.dataCampaign))
    if (campaignSwitch) {
      yield put(campaignsFetchRequested({ page, limit, status: 'ARCHIVED' }))
    } else {
      yield put(campaignsFetchRequested({ page, limit }))
    }
    yield put(confirmDialogClose())
  } catch (error) {
    const { message } = error
    yield put(deleteCampaignFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchDataPoints(action) {
  const {
    dataCampaignId,
    page,
    tsIdentifierStart,
    tsIdentifierEnd,
    eventAnnotationLabel,
    failureModeIds,
    filterAtLeastOne,
  } = action.payload
  try {
    const response = yield call(createQuery, GET_DATA_POINTS_PAGINATED, {
      dataCampaignId,
      page,
      tsIdentifierStart,
      tsIdentifierEnd,
      eventAnnotationLabel,
      failureModeIds,
      filterAtLeastOne,
    })
    yield put(
      dataPointsFetchSucceeded(response.data.dataPointsForCampaignPaginated),
    )
  } catch (error) {
    const { message } = error
    yield put(dataPointsFetchFailed({ message }))
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

function* getEventAnnotation(action) {
  const { eventAnnotationId } = action.payload
  try {
    const response = yield call(createQuery, GET_EVENT_ANNOTATION, {
      eventAnnotationId,
    })
    yield put(
      getEventAnnotationFetchSucceeded(response.data.getEventAnnotation),
    )
  } catch (error) {
    const { message } = error
    yield put(getEventAnnotationFetchFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchThreatSignatures(action) {
  try {
    const response = yield call(createQuery, GET_THREAT_SIGNATURES)
    yield put(
      fetchAllThreatSignaturesSucceeded({
        threatSignatures: response.data.allThreatSignatures,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchAllThreatSignaturesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* dataInfraSaga() {
  yield takeLatest(campaignsFetchRequested, fetchCampaigns)
  yield takeLatest(allCampaignsFetchRequested, fetchAllCampaigns)
  yield takeLatest(createCampaignRequested, createCampaign)
  yield takeLatest(archiveCampaignRequested, archiveCampaign)
  yield takeLatest(stopCampaignRequested, stopCampaign)
  yield takeLatest(startCampaignRequested, startCampaign)
  yield takeLatest(deleteCampaignRequested, deleteCampaign)
  yield takeLatest(dataPointsFetchRequested, fetchDataPoints)
  yield takeLatest(
    updateDataPointEventAnnotationFetchRequested,
    updateDataPointEventAnnotation,
  )
  yield takeLatest(getEventAnnotationFetchRequested, getEventAnnotation)
  yield takeEvery(fetchAllThreatSignaturesRequested, fetchThreatSignatures)
}

export default dataInfraSaga

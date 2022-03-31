/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { call, put, takeLatest } from 'redux-saga/effects'
import { find } from 'lodash'
// src
import {
  createNotification,
  NOTIFICATION_TYPES,
} from 'redux/slices/notifications'

import DMSInstance, {
  dmsCreateQuery,
  dmsCreateQueryV2,
  dmsCreateMutationV2,
} from '../apollo'
import {
  updateLoginRequested,
  updateLoginSucceeded,
  updateLoginFailed,
  getAllDatasetsRequested,
  getAllDatasetsSucceeded,
  getAllDatasetsFailed,
  getAllDatasplitsRequested,
  getAllDatasplitsSucceeded,
  getAllDatasplitsFailed,
  getAllDatapointsRequested,
  getAllDatapointsSucceeded,
  getAllDatapointsFailed,
  getDatasetRequested,
  getDatasetSucceeded,
  getDatasetFailed,
  getDatasplitRequested,
  getDatasplitSucceeded,
  getDatasplitFailed,
  getDatapointSucceeded,
  getDatapointRequested,
  getDatapointFailed,
  getDatapointsByDatasplitRequested,
  getDatapointsByDatasplitSucceeded,
  getDatapointsByDatasplitFailed,
  getDatasplitsByDatasetRequested,
  getDatasplitsByDatasetSucceeded,
  getDatasplitsByDatasetFailed,
  DatasetType,
  DatasplitType,
  DatapointType,
  getDatapointsByDatasetFailed,
  getDatapointsByDatasetSucceeded,
  getDatapointsByDatasetRequested,
  getDatapointCountByDatasetRequested,
  getDatapointCountByDatasetSucceeded,
  getDatapointCountByDatasetFailed,
} from '../redux/dmsSlice'

import {
  LOGIN,
  GET_ALL_DATASETS,
  GET_ALL_DATASPLITS,
  GET_ALL_DATAPOINTS,
  GET_DATASET,
  GET_DATASPLIT,
  GET_DATAPOINT,
  GET_DATAPOINTS_BY_DATASPLIT,
  GET_DATASPLITS_BY_DATASET,
  GET_DATAPOINTS_BY_DATASET,
  GET_DATAPOINT_COUNT_BY_DATASET,
} from './gql'

interface ActionProps {
  payload: {
    variables: {
      username: string
      password: string
    }
  }
}

interface DataProps {
  payload: {
    page?: number
    pageSize?: number
    name?: string
    currentDatasplit?: string
  }
}

interface DatasetProps {
  data: {
    page: number
    pages: number
    count: number
    datasets: DatasetType[]
  }
}

interface DatasplitProps {
  data: {
    page: number
    pages: number
    count: number
    datasplits: DatasplitType[]
  }
}

interface DatapointResponse {
  data: {
    page: number
    pages: number
    count: number
    datapoints: DatapointType[]
  }
}

interface DatasplitsByDatasetResponse {
  data: {
    datasplitsByDataset: {
      page: number
      pages: number
      count: number
      datasplits: DatasplitType[]
    }
  }
}

interface LoginProps {
  data: {
    payload: Record<string, unknown>
    refreshExpiresIn: number
    user: {
      id: number
    }
    awsAccessKeyId: number
    token: string
  }
  errors?: { message: string }[]
}

function* updateLogin(action: ActionProps) {
  try {
    const { variables } = action.payload

    const response: LoginProps = yield call(
      dmsCreateMutationV2,
      LOGIN,
      variables,
    )
    if (!response.errors) {
      yield DMSInstance.createClient(null, null, () => {})
      yield put(updateLoginSucceeded(response.data))
    } else {
      const { message } = response.errors[0]
      yield put(updateLoginFailed({ error: message }))
      yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
    }
  } catch (error) {
    const { message } = error
    yield put(updateLoginFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getAllDatasets() {
  try {
    const response: DatasetProps = yield call(
      dmsCreateQueryV2,
      GET_ALL_DATASETS,
    )
    yield put(getAllDatasetsSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(getAllDatasetsFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getAllDatasplits() {
  try {
    const response: DatasplitProps = yield call(
      dmsCreateQueryV2,
      GET_ALL_DATASPLITS,
    )
    yield put(getAllDatasplitsSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(getAllDatasplitsFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getAllDatapoints(action: DataProps) {
  try {
    const { page, pageSize } = action.payload
    const response: DatapointResponse = yield call(
      dmsCreateQuery,
      GET_ALL_DATAPOINTS,
      { page, pageSize },
    )
    yield put(getAllDatapointsSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(getAllDatapointsFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getDataset(action: DataProps) {
  try {
    const { name } = action.payload
    const response: DatasetProps = yield call(dmsCreateQuery, GET_DATASET, {
      datasetName: name,
    })
    yield put(getDatasetSucceeded(response))
  } catch (error) {
    const { message } = error
    yield put(getDatasetFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getDatasplit(action: DataProps) {
  try {
    const { name } = action.payload
    const response: DatasetProps = yield call(dmsCreateQuery, GET_DATASPLIT, {
      datasplitName: name,
    })
    yield put(getDatasplitSucceeded(response))
  } catch (error) {
    const { message } = error
    yield put(getDatasplitFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getDatapoint(action: DataProps) {
  try {
    const { name } = action.payload
    const response: DatasetProps = yield call(dmsCreateQuery, GET_DATAPOINT, {
      dataFile: name,
    })
    yield put(getDatapointSucceeded(response))
  } catch (error) {
    const { message } = error
    yield put(getDatapointFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getDatapointsByDataset(action: DataProps) {
  try {
    const { name, page, pageSize } = action.payload
    const response: DatasetProps = yield call(
      dmsCreateQuery,
      GET_DATAPOINTS_BY_DATASET,
      { datasetName: name, page, pageSize },
    )
    yield put(getDatapointsByDatasetSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(getDatapointsByDatasetFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getDatasplitsByDataset(action: DataProps) {
  try {
    const { name, page, pageSize, currentDatasplit } = action.payload
    const response: DatasplitsByDatasetResponse = yield call(
      dmsCreateQuery,
      GET_DATASPLITS_BY_DATASET,
      { datasetName: name, page, pageSize },
    )
    if (
      !currentDatasplit ||
      find(response.data.datasplitsByDataset.datasplits, [
        'datasplitName',
        currentDatasplit,
      ]) === undefined
    ) {
      yield put(getDatapointsByDatasetRequested({ name, page, pageSize }))
    } else {
      yield put(getDatapointCountByDatasetRequested({ name, page, pageSize }))
    }
    yield put(getDatasplitsByDatasetSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(getDatasplitsByDatasetFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getDatapointCountByDataset(action: DataProps) {
  try {
    const { name, page, pageSize } = action.payload
    const response: DatasplitsByDatasetResponse = yield call(
      dmsCreateQuery,
      GET_DATAPOINT_COUNT_BY_DATASET,
      { datasetName: name, page, pageSize },
    )
    yield put(getDatapointCountByDatasetSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(getDatapointCountByDatasetFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* getDatapointsByDatasplit(action: DataProps) {
  try {
    const { name, page, pageSize } = action.payload
    const response: DatasetProps = yield call(
      dmsCreateQuery,
      GET_DATAPOINTS_BY_DATASPLIT,
      { datasplitName: name, page, pageSize },
    )
    yield put(getDatapointsByDatasplitSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(getDatapointsByDatasplitFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* saga() {
  yield takeLatest(updateLoginRequested, updateLogin)
  yield takeLatest(getAllDatasetsRequested, getAllDatasets)
  yield takeLatest(getAllDatasplitsRequested, getAllDatasplits)
  yield takeLatest(getAllDatapointsRequested, getAllDatapoints)
  yield takeLatest(getDatasetRequested, getDataset)
  yield takeLatest(getDatasplitRequested, getDatasplit)
  yield takeLatest(getDatapointRequested, getDatapoint)
  yield takeLatest(getDatapointsByDatasplitRequested, getDatapointsByDatasplit)
  yield takeLatest(getDatasplitsByDatasetRequested, getDatasplitsByDataset)
  yield takeLatest(getDatapointsByDatasetRequested, getDatapointsByDataset)
  yield takeLatest(
    getDatapointCountByDatasetRequested,
    getDatapointCountByDataset,
  )
}

export default saga

import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'
// import isEmpty from 'lodash/isEmpty'
// import compact from 'lodash/compact'
import get from 'lodash/get'
// src
import { createNotification } from 'redux/slices/notifications'
import { createQuery, createMutation } from 'providers/apollo'

import {
  fetchAmbientOsRequested,
  fetchAmbientOsSucceeded,
  fetchAmbientOsFailed,
  fetchInventoryRequested,
  fetchInventorySucceeded,
  fetchInventoryFailed,
  fetchProvisionStatusesRequested,
  fetchProvisionStatusesSucceeded,
  fetchProvisionStatusesFailed,
  updateNodeProvisionRequested,
  updateNodeProvisionSucceeded,
  updateNodeProvisionFailed,
  updateNodeAdminRequested,
  updateNodeAdminSucceeded,
  updateNodeAdminFailed,
  verifyNodeProvisionSetupRequested,
  verifyNodeProvisionSetupSucceeded,
  verifyNodeProvisionSetupFailed,
} from '../redux'

import {
  NODE_PROVISIONS,
  NODE_PROVISION,
  UPDATE_NODE_PROVISION,
  CREATE_NODE_PROVISION,
  PROVISION_STATUSES,
  UPDATE_NODE_ADMIN,
  AMBIENT_OS_DOWNLOAD_LINK,
  VERIFY_NODE_PROVISION_SETUP,
} from './gql'

function* verifyNodeProvisionSetup(action) {
  try {
    const response = yield call(createQuery, VERIFY_NODE_PROVISION_SETUP, {
      id: action.payload.id,
    })
    const dataKey = 'verifyNodeProvisionSetup'

    const data = get(response.data, dataKey)

    yield put(verifyNodeProvisionSetupSucceeded(data))
  } catch (error) {
    const { message } = error
    yield put(verifyNodeProvisionSetupFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchAmbientOs(action) {
  try {
    const response = yield call(createQuery, AMBIENT_OS_DOWNLOAD_LINK)
    const dataKey = 'ambientOsDownloadLink'

    const url = get(response.data, dataKey)
    const queryString = url ? url.split('?')[1] : ''
    const urlParams = new URLSearchParams(queryString)
    const expires = urlParams.get('Expires')

    yield put(
      fetchAmbientOsSucceeded({
        isOpen: true,
        url,
        expires: expires ? parseInt(expires, 10) : null,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchAmbientOsFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchInventory(action) {
  try {
    const { filters, page, limit } = action.payload
    const response = yield call(createQuery, NODE_PROVISIONS, {
      filters,
      page,
      limit,
    })

    yield put(fetchInventorySucceeded(response.data.nodeProvisions))
  } catch (error) {
    const { message } = error
    yield put(fetchInventoryFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchProvisionStatuses() {
  try {
    const response = yield call(createQuery, PROVISION_STATUSES)

    yield put(fetchProvisionStatusesSucceeded(response.data.provisionStatuses))
  } catch (error) {
    const { message } = error
    yield put(fetchProvisionStatusesFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* updateNodeProvision(action) {
  try {
    const { nodeProvisionId, data } = action.payload
    const dataKey = 'updateNodeProvision'
    const updateResponse = yield call(createMutation, UPDATE_NODE_PROVISION, {
      data,
      nodeProvisionId,
    })

    if (get(updateResponse, `data.${dataKey}.ok`)) {
      yield put(
        createNotification({
          message: get(updateResponse, `data.${dataKey}.message`),
        }),
      )
    }

    // refetch
    const page = yield select(state => state.inventory.collectionCurrentPage)
    const limit = yield select(state => state.inventory.collectionLimit)
    const provisionResponse = yield call(createQuery, NODE_PROVISIONS, {
      filters: {},
      page,
      limit,
    })

    yield put(fetchInventorySucceeded(provisionResponse.data.nodeProvisions))
  } catch (error) {
    const { message } = error
    yield put(updateNodeProvisionFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* updateNodeAdmin(action) {
  try {
    const { nodeIdentifier, data } = action.payload
    const response = yield call(createMutation, UPDATE_NODE_ADMIN, {
      data,
      nodeIdentifier,
    })

    // yield put(updateNodeAdminSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(updateNodeAdminFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* inventorySaga() {
  yield takeLatest(fetchAmbientOsRequested, fetchAmbientOs)
  yield takeLatest(fetchInventoryRequested, fetchInventory)
  yield takeLatest(fetchProvisionStatusesRequested, fetchProvisionStatuses)
  yield takeLatest(updateNodeProvisionRequested, updateNodeProvision)
  yield takeLatest(updateNodeAdminRequested, updateNodeAdmin)
  yield takeLatest(verifyNodeProvisionSetupRequested, verifyNodeProvisionSetup)
}

export default inventorySaga

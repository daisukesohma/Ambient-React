import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
// import isEmpty from 'lodash/isEmpty'
// import compact from 'lodash/compact'
import get from 'lodash/get'
// src
import { createNotification } from 'redux/slices/notifications'
import { createQuery, createMutation } from 'providers/apollo'
import { fetchInventoryRequested } from 'pages/Inventory/redux'

import {
  createNodeProvisionRequested,
  createNodeProvisionSucceeded,
  createNodeProvisionFailed,
  fetchSkusRequested,
  fetchSkusSucceeded,
  fetchSkusFailed,
  setProvisionNewModalValue,
} from '../redux'

import {
  CREATE_GPU,
  UPDATE_GPU,
  DELETE_GPU,
  CREATE_HARDWARE_PARTNER,
  UPDATE_HARDWARE_PARTNER,
  DELETE_HARDWARE_PARTNER,
  CREATE_SKU_CAPABILITY,
  UPDATE_SKU_CAPABILITY,
  DELETE_SKU_CAPABILITY,
  CREATE_SKU,
  UPDATE_SKU,
  DELETE_SKU,
  QUERY_SKUS,
  CREATE_NODE_PROVISION,
} from './gql'

function* fetchSkus(action) {
  try {
    const response = yield call(createQuery, QUERY_SKUS, {})
    yield put(fetchSkusSucceeded(response.data.skus))
  } catch (error) {
    const { message } = error
    yield put(fetchSkusFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* createNodeProvision(action) {
  try {
    const dataKey = 'createNodeProvision'
    const response = yield call(
      createMutation,
      CREATE_NODE_PROVISION,
      action.payload,
    )
    const responseData = get(response, `data[${dataKey}]`)
    if (get(responseData, 'ok')) {
      // this currently only handles the first nodeProvision
      yield put(
        createNodeProvisionSucceeded({
          id: get(responseData, 'nodeProvisions[0].id'),
        }),
      )

      // refetch new node provision
      yield put(
        fetchInventoryRequested({
          filters: {},
          page: 1,
          limit: 10,
        }),
      )
      yield put(setProvisionNewModalValue({ isOpen: false, tabIndex: 0 }))
    } else {
      yield put(createNodeProvisionFailed({ message: responseData.message }))
    }
    yield put(createNotification({ message: responseData.message }))

    if (response.errors) {
      yield put(
        createNotification({
          message: get(response, 'errors[0].locations.message'),
        }),
      )
    }
  } catch (error) {
    // const { message } = error
    // yield put(createNodeProvisionFailed({ message }))
    // yield put(createNotification({ message }))
  }
}
// function* createCampaign(action) {
//   try {
//     const {
//       threatSignatureId,
//     } = action.payload
//     const response = yield call(createMutation, CREATE_DATA_CAMPAIGN, {
//       threatSignatureId,
//     })
//     yield put(createCampaignSucceeded(response.data))
//   } catch (error) {
//     const { message } = error
//     yield put(createCampaignFailed({ message }))
//     yield put(createNotification({ message }))
//   }
// }

function* skuManagementSaga() {
  // yield takeLatest(campaignsFetchRequested, fetchCampaigns)
  yield takeLatest(createNodeProvisionRequested, createNodeProvision)
  yield takeEvery(fetchSkusRequested, fetchSkus)
}

export default skuManagementSaga

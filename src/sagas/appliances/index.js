import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createNotification } from 'redux/slices/notifications'
import { createQuery, createMutation } from 'providers/apollo'
import {
  fetchNodesByAccountRequested,
  fetchNodesByAccountSucceeded,
  fetchNodesByAccountFailed,
  fetchNodeStatisticsByAccountRequested,
  fetchNodeStatisticsByAccountSucceeded,
  fetchNodeStatisticsByAccountFailed,
  fetchNodePackageMetadataRequested,
  fetchNodePackageMetadataSucceeded,
  fetchNodePackageMetadataFailed,
  fetchNodeRequestStatusByAccountRequested,
  fetchNodeRequestStatusByAccountSucceeded,
  fetchNodeRequestStatusByAccountFailed,
  nodeCreateRequested,
  nodeCreateSucceeded,
  nodeCreateFailed,
  nodeCreateV2Requested,
  nodeCreateV2Succeeded,
  nodeCreateV2Failed,
  associateNodeToAccountRequested,
  associateNodeToAccountSucceeded,
  associateNodeToAccountFailed,
} from 'redux/slices/appliances'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'

import {
  GET_NODES_BY_ACCOUNT,
  GET_NODE_STATISTICS,
  GET_LATEST_NODE_PACKAGE_METADATA,
  GET_NODE_REQUEST_STATUS_BY_ACCOUNT,
  CREATE_NODE_REQUEST,
  CREATE_NODE_V2_REQUEST,
  ASSOCIATE_NODE_TO_ACCOUNT,
} from './gql'

function* fetchNodes(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_NODES_BY_ACCOUNT, {
      accountSlug,
    })
    yield put(
      fetchNodesByAccountSucceeded({ nodes: response.data.allNodesByAccount }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchNodesByAccountFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchNodeStatistics(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_NODE_STATISTICS, {
      accountSlug,
    })
    const { nodeStatistics } = response.data
    yield put(fetchNodeStatisticsByAccountSucceeded({ nodeStatistics }))
  } catch (error) {
    const { message } = error
    yield put(fetchNodeStatisticsByAccountFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchNodePackageMetadata() {
  try {
    const response = yield call(createQuery, GET_LATEST_NODE_PACKAGE_METADATA)
    const metadata = response.data.getLatestNodePackageMetadata
    yield put(fetchNodePackageMetadataSucceeded({ metadata }))
  } catch (error) {
    const { message } = error
    yield put(fetchNodePackageMetadataFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* fetchNodeRequestStatusByAccount(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(
      createQuery,
      GET_NODE_REQUEST_STATUS_BY_ACCOUNT,
      {
        accountSlug,
      },
    )
    yield put(fetchNodeRequestStatusByAccountSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(fetchNodeRequestStatusByAccountFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* createNode(action) {
  try {
    const { nodeRequestInput } = action.payload
    yield call(createMutation, CREATE_NODE_REQUEST, {
      data: nodeRequestInput,
    })
    yield put(nodeCreateSucceeded())
  } catch (error) {
    const { message } = error
    yield put(nodeCreateFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* createNodeV2(action) {
  try {
    const { nodeIdentifier, requestJson, requestType } = action.payload
    yield call(createMutation, CREATE_NODE_V2_REQUEST, {
      nodeIdentifier,
      requestJson,
      requestType,
    })
    yield put(nodeCreateV2Succeeded())
  } catch (error) {
    const { message } = error
    yield put(nodeCreateV2Failed({ message }))
    yield put(createNotification({ message }))
  }
}

function* associateNodeToAccount(action) {
  try {
    const { serialNumber, accountSlug, nodeName } = action.payload
    const response = yield call(createQuery, ASSOCIATE_NODE_TO_ACCOUNT, {
      serialNumber,
      accountSlug,
      nodeName,
    })
    const { ok, message, node } = response.data.associateNodeToAccount
    if (ok === false) {
      yield put(associateNodeToAccountFailed({ message }))
      yield put(createNotification({ message }))
    } else {
      yield call(
        trackEventToMixpanel,
        MixPanelEventEnum.INVENTORY_ASSOCIATE_NODE_TO_ACCOUNT,
        { account: accountSlug },
      )
      yield put(associateNodeToAccountSucceeded({ node }))
      yield put(createNotification({ message }))
    }
  } catch (error) {
    const { message } = error
    yield put(associateNodeToAccountFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* appliancesSaga() {
  yield takeLatest(fetchNodesByAccountRequested, fetchNodes)
  yield takeLatest(fetchNodeStatisticsByAccountRequested, fetchNodeStatistics)
  yield takeLatest(fetchNodePackageMetadataRequested, fetchNodePackageMetadata)
  yield takeLatest(
    fetchNodeRequestStatusByAccountRequested,
    fetchNodeRequestStatusByAccount,
  )
  yield takeLatest(nodeCreateRequested, createNode)
  yield takeLatest(nodeCreateV2Requested, createNodeV2)
  yield takeLatest(associateNodeToAccountRequested, associateNodeToAccount)
}

export default appliancesSaga

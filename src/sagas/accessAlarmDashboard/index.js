import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
// src
import { createNotification } from 'redux/slices/notifications'
import { createQuery } from 'providers/apollo'
import {
  fetchAccessAlarmTypeDistributionRequested,
  fetchAccessAlarmTypeDistributionSucceeded,
  fetchAccessAlarmTypeDistributionFailed,
  fetchAccessReaderListRequested,
  fetchAccessReaderListSucceeded,
  fetchAccessReaderListFailed,
  fetchDoorPACSAlertEventDistributionRequested,
  fetchDoorPACSAlertEventDistributionSucceeded,
  fetchDoorPACSAlertEventDistributionFailed,
  fetchAccessNodesForAccountRequested,
  fetchAccessNodesForAccountSucceeded,
  fetchAccessNodesForAccountFailed,
  fetchInvalidBadgePACSAlertEventDistributionRequested,
  fetchInvalidBadgePACSAlertEventDistributionSucceeded,
  fetchInvalidBadgePACSAlertEventDistributionFailed,
} from 'redux/slices/accessAlarmDashboard'

import {
  GET_ACCESS_READER_LIST,
  GET_PACS_ALERT_EVENT_DISTRIBUTION,
  GET_ACCESS_NODES_FOR_ACCOUNT,
  GET_ACCESS_ALARM_TYPE_DISTRIBUTION,
} from './gql'

function* fetchAccessAlarmTypeDistribution(action) {
  try {
    const {
      accountSlug,
      siteSlugs,
      startTs,
      endTs,
      accessAlarmTypes,
    } = action.payload
    const { data } = yield call(
      createQuery,
      GET_ACCESS_ALARM_TYPE_DISTRIBUTION,
      {
        accountSlug,
        siteSlugs,
        startTs,
        endTs,
        accessAlarmTypes,
      },
    )
    yield put(
      fetchAccessAlarmTypeDistributionSucceeded({
        accessAlarmTypeDistributions: data.accessAlarmTypeDistribution,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchAccessAlarmTypeDistributionFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchAccessReaderList(action) {
  try {
    const {
      accountSlug,
      siteSlugs,
      startTs,
      endTs,
      accessAlarmType,
    } = action.payload
    const { data } = yield call(createQuery, GET_ACCESS_READER_LIST, {
      accountSlug,
      siteSlugs,
      startTs,
      endTs,
      accessAlarmTypes: [accessAlarmType],
    })
    yield put(
      fetchAccessReaderListSucceeded({
        accessReaderList: data.accessReaderList,
        accessAlarmType,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchAccessReaderListFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchDoorPACSAlertEventDistribution(action) {
  try {
    const {
      accountSlug,
      siteSlugs,
      startTs,
      endTs,
      accessAlarmTypes,
    } = action.payload
    const { data } = yield call(
      createQuery,
      GET_PACS_ALERT_EVENT_DISTRIBUTION,
      {
        accountSlug,
        siteSlugs,
        startTs,
        endTs,
        accessAlarmTypes,
      },
    )
    yield put(
      fetchDoorPACSAlertEventDistributionSucceeded({
        _PACSAlertEventDistribution: data.pacsAlertEventDistribution,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchDoorPACSAlertEventDistributionFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchInvalidBadgePACSAlertEventDistribution(action) {
  try {
    const {
      accountSlug,
      siteSlugs,
      startTs,
      endTs,
      accessAlarmTypes,
    } = action.payload
    const { data } = yield call(
      createQuery,
      GET_PACS_ALERT_EVENT_DISTRIBUTION,
      {
        accountSlug,
        siteSlugs,
        startTs,
        endTs,
        accessAlarmTypes,
      },
    )
    yield put(
      fetchInvalidBadgePACSAlertEventDistributionSucceeded({
        _PACSAlertEventDistribution: data.pacsAlertEventDistribution,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(
      fetchInvalidBadgePACSAlertEventDistributionFailed({ error: message }),
    )
    yield put(createNotification({ message }))
  }
}

function* fetchAccessNodesForAccount(action) {
  try {
    const { accountSlug } = action.payload
    const { data } = yield call(createQuery, GET_ACCESS_NODES_FOR_ACCOUNT, {
      accountSlug,
    })
    yield put(
      fetchAccessNodesForAccountSucceeded({
        accessNodesForAccount: data.accessNodesForAccount,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchAccessNodesForAccountFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* accessAlarmDashboardSaga() {
  yield takeLatest(
    fetchAccessAlarmTypeDistributionRequested,
    fetchAccessAlarmTypeDistribution,
  )
  yield takeEvery(fetchAccessReaderListRequested, fetchAccessReaderList)
  yield takeLatest(
    fetchDoorPACSAlertEventDistributionRequested,
    fetchDoorPACSAlertEventDistribution,
  )
  yield takeLatest(
    fetchInvalidBadgePACSAlertEventDistributionRequested,
    fetchInvalidBadgePACSAlertEventDistribution,
  )
  yield takeLatest(
    fetchAccessNodesForAccountRequested,
    fetchAccessNodesForAccount,
  )
}

export default accessAlarmDashboardSaga

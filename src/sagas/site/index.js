import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
// src
import { createQuery } from 'providers/apollo'
import {
  fetchByAccountSucceeded,
  fetchByAccountFailed,
  fetchSiteUpTimeByAccountSucceeded,
  fetchSiteUpTimeByAccountRequested,
  fetchNodeStatisticsByAccountSucceeded,
  fetchNodeStatisticsByAccountFailed,
} from 'redux/site/actions'
import {
  FETCH_ALL_BY_ACCOUNT_REQUESTED,
  FETCH_SITE_UP_TIME_REQUESTED,
  FETCH_NODE_STATISTICS_REQUESTED,
} from 'redux/site/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import {
  GET_SITES_BY_ACCOUNT,
  GET_SITE_UP_TIME,
  GET_NODE_STATISTICS,
} from './gql'

function* fetchResources(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    const sites = get(response, 'data.allSitesByAccount', [])
    yield put(fetchByAccountSucceeded(sites))
  } catch (error) {
    const { message } = error
    yield put(fetchByAccountFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchSiteUpTime(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITE_UP_TIME, { accountSlug })
    yield put(fetchSiteUpTimeByAccountSucceeded(response.data.siteUptime))
  } catch (error) {
    const { message } = error
    yield put(fetchSiteUpTimeByAccountRequested({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchNodeStatistics(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_NODE_STATISTICS, {
      accountSlug,
    })
    yield put(
      fetchNodeStatisticsByAccountSucceeded(response.data.nodeStatistics),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchNodeStatisticsByAccountFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* foldersSaga() {
  yield takeLatest(FETCH_ALL_BY_ACCOUNT_REQUESTED, fetchResources)
  yield takeLatest(FETCH_SITE_UP_TIME_REQUESTED, fetchSiteUpTime)
  yield takeLatest(FETCH_NODE_STATISTICS_REQUESTED, fetchNodeStatistics)
}

export default foldersSaga

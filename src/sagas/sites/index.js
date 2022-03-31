import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
// src
import { createQuery, createMutation } from 'providers/apollo'
import {
  fetchByAccountSucceeded,
  fetchByAccountFailed,
  fetchSiteUpTimeByAccountSucceeded,
  fetchSiteUpTimeByAccountRequested,
  fetchTimezonesSucceeded,
  fetchTimezonesFailed,
  updateSiteInfoSucceeded,
  updateSiteInfoFailed,
} from 'redux/sites/actions'
import {
  FETCH_ALL_BY_ACCOUNT_REQUESTED,
  FETCH_SITE_UP_TIME_REQUESTED,
  FETCH_TIMEZONES_REQUESTED,
  UPDATE_SITE_INFO_REQUESTED,
} from 'redux/sites/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import {
  GET_SITES_BY_ACCOUNT,
  GET_SITE_UP_TIME,
  UPDATE_SITE_INFO,
  GET_TIMEZONES,
} from './gql'

function* fetchResources(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    const sites = get(response, 'data.allSitesByAccount')
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

function* updateSiteInfo(action) {
  try {
    const response = yield call(
      createMutation,
      UPDATE_SITE_INFO,
      action.payload,
    )
    yield put(updateSiteInfoSucceeded(response.data.updateSiteInfo))
  } catch (error) {
    const { message } = error
    yield put(updateSiteInfoFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchTimezones(action) {
  try {
    const response = yield call(createQuery, GET_TIMEZONES, action.payload)
    yield put(fetchTimezonesSucceeded(response.data.timezones))
  } catch (error) {
    const { message } = error
    yield put(fetchTimezonesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* sitesSaga() {
  yield takeLatest(FETCH_ALL_BY_ACCOUNT_REQUESTED, fetchResources)
  yield takeLatest(FETCH_SITE_UP_TIME_REQUESTED, fetchSiteUpTime)
  yield takeLatest(FETCH_TIMEZONES_REQUESTED, fetchTimezones)
  yield takeLatest(UPDATE_SITE_INFO_REQUESTED, updateSiteInfo)
}

export default sitesSaga

// saga
import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
// src
import { createQuery } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import { fetchSitesFailed, fetchSitesSucceeded } from 'redux/reports/actions'
import { FETCH_SITES_REQUESTED } from 'redux/reports/actionTypes'

import { GET_ACCOUNT_SITES } from './gql'

function* fetchResources(action) {
  const { accountSlug } = action.payload
  try {
    const response = yield call(createQuery, GET_ACCOUNT_SITES, {
      accountSlug,
    })
    const sites = get(response, 'data.allSites', [])
    yield put(fetchSitesSucceeded(sites))
  } catch (error) {
    const { message } = error
    yield put(fetchSitesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* reportsSaga() {
  yield takeLatest(FETCH_SITES_REQUESTED, fetchResources)
}

export default reportsSaga

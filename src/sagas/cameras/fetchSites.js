// saga
import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery } from 'providers/apollo'
import { fetchSitesSucceeded, fetchSitesFailed } from 'redux/cameras/actions'
import { FETCH_SITES_REQUESTED } from 'redux/cameras/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import { GET_SITES_BY_ACCOUNT } from './gql'

function* fetchSites(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    yield put(fetchSitesSucceeded(response.data.allSitesByAccount))
  } catch (error) {
    const { message } = error
    yield put(fetchSitesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

export default takeLatest(FETCH_SITES_REQUESTED, fetchSites)

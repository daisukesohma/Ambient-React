// saga
import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery } from 'providers/apollo'
import {
  getAllStreamIdsForSiteSucceeded,
  getAllStreamIdsForSiteFailed,
} from 'redux/cameras/actions'
import { GET_ALL_STREAM_IDS_FOR_SITE_REQUESTED } from 'redux/cameras/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import { GET_ALL_STREAM_IDS_FOR_SITE } from './gql'

function* findStreams(action) {
  try {
    const { variables } = action.payload
    const response = yield call(createQuery, GET_ALL_STREAM_IDS_FOR_SITE, {
      ...variables,
      limit: 600,
    })
    yield put(getAllStreamIdsForSiteSucceeded(response.data.streamsPaginated))
  } catch (error) {
    const { message } = error
    yield put(getAllStreamIdsForSiteFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

export default takeLatest(GET_ALL_STREAM_IDS_FOR_SITE_REQUESTED, findStreams)

// saga
import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
// src
import { createQuery } from 'providers/apollo'
import {
  updateStreamSiteSucceeded,
  updateStreamSiteFailed,
} from 'redux/cameras/actions'
import { UPDATE_STREAM_SITE_REQUESTED } from 'redux/cameras/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import { CHANGE_STREAM_SITE } from './gql'

function* updateStreamSite(action) {
  try {
    const { variables } = action.payload
    const response = yield call(createQuery, CHANGE_STREAM_SITE, {
      ...variables,
    })

    const { message, ok } = get(response, 'data.changeStreamSite')
    if (ok === false) {
      yield put(updateStreamSiteFailed({ error: message }))
      yield put(createNotification({ message }))
    } else {
      yield put(updateStreamSiteSucceeded())
      yield put(createNotification({ message }))
    }
  } catch (error) {
    const { message } = error
    yield put(updateStreamSiteFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

export default takeLatest(UPDATE_STREAM_SITE_REQUESTED, updateStreamSite)

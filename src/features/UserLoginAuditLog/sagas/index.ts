import { call, put, takeLatest } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
// src
import { createQuery } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'

import {
  fetchUserLoginActivityRequested,
  fetchUserLoginActivitySucceeded,
  fetchUserLoginActivityFailed,
} from '../redux/userLoginAuditLogSlice'

import { GET_LOGIN_EVENTS } from './gql'


interface ActionType {
  payload: {
    profileId: number
    startTs: number
    endTs: number
    page: number
    limit: number
    desc: number
    searchQuery: string
  }
}

function* fetchLoginActivity(action : ActionType) : SagaIterator {
  try {
    const { profileId, startTs, endTs, page, limit, desc, searchQuery } = action.payload
    const { data } = yield call(createQuery, GET_LOGIN_EVENTS, {
      profileId,
      startTs,
      endTs,
      page,
      limit,
      desc,
      searchQuery,
    })
    yield put(fetchUserLoginActivitySucceeded({ data: data.usersLoginEvents }))
  } catch (error) {
    const { message } = error
    yield put(fetchUserLoginActivityFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* userLoginAuditLogSaga() : SagaIterator {
  yield takeLatest(fetchUserLoginActivityRequested, fetchLoginActivity)
}

export default userLoginAuditLogSaga

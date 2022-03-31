// saga
import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery } from 'providers/apollo'
import { findStreamsSucceeded, findStreamsFailed } from 'redux/cameras/actions'
import { FIND_STREAMS_REQUESTED } from 'redux/cameras/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import { GET_STREAMS_PAGINATED } from './gql'

function* findStreams(action) {
  try {
    const { variables } = action.payload
    const response = yield call(createQuery, GET_STREAMS_PAGINATED, variables)
    yield put(findStreamsSucceeded(response.data.streamsPaginated))
  } catch (error) {
    const { message } = error
    yield put(findStreamsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

export default takeLatest(FIND_STREAMS_REQUESTED, findStreams)

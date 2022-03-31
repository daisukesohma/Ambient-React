import { call, put, takeEvery } from 'redux-saga/effects'
// src
import { createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  createAccessAlarmSucceeded,
  createAccessAlarmFailed,
} from 'redux/access/actions'
import { CREATE_ACCESS_ALARM_REQUESTED } from 'redux/access/actionTypes'

import { CREATE_ACCESS_ALARM } from './gql'

function* createAccessAlarm(action) {
  try {
    const { accessReaderId, name } = action.payload
    const response = yield call(createMutation, CREATE_ACCESS_ALARM, {
      accessReaderId,
      name,
    })
    const { message, accessAlarm } = response.data.createAccessAlarm
    yield put(createAccessAlarmSucceeded({ id: accessAlarm.id, message }))
  } catch (error) {
    const { message } = error
    yield put(createAccessAlarmFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* accessSaga() {
  yield takeEvery(CREATE_ACCESS_ALARM_REQUESTED, createAccessAlarm)
}

export default accessSaga

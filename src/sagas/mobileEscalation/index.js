import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  ESCALATION_CONTACT_FETCH_REQUESTED,
  SNOOZE_ESCALATION_METHOD_REQUESTED,
  UNSNOOZE_ESCALATION_METHOD_REQUESTED,
} from 'redux/mobileEscalation/actionTypes'
import {
  escalationContactFetchSucceeded,
  escalationContactFetchFailed,
  snoozeEscalationMethodSucceeded,
  snoozeEscalationMethodFailed,
  unsnoozeEscalationMethodSucceeded,
  unsnoozeEscalationMethodFailed,
} from 'redux/mobileEscalation/actions'

import {
  FETCH_ESCALATION_CONTACT,
  SNOOZE_ESCALATION_METHOD,
  UNSNOOZE_ESCALATION_METHOD,
} from './gql'

function* fetchEscalationContact(action) {
  const { id } = action.payload
  try {
    const response = yield call(createQuery, FETCH_ESCALATION_CONTACT, { id })
    const { escalationContact } = response.data
    yield put(escalationContactFetchSucceeded(escalationContact))
  } catch (error) {
    const { message } = error
    yield put(escalationContactFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* snoozeEscalationMethod(action) {
  try {
    const { profileId, method, duration } = action.payload
    const response = yield call(createMutation, SNOOZE_ESCALATION_METHOD, {
      profileId,
      method,
      duration,
    })
    const { message, escalationSnooze } = response.data.snoozeEscalationMethod
    yield put(snoozeEscalationMethodSucceeded(escalationSnooze))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(snoozeEscalationMethodFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* unsnoozeEscalationMethod(action) {
  try {
    const { profileId, method } = action.payload
    const response = yield call(createMutation, UNSNOOZE_ESCALATION_METHOD, {
      profileId,
      method,
    })
    const { message, escalationSnooze } = response.data.unsnoozeEscalationMethod
    yield put(unsnoozeEscalationMethodSucceeded(escalationSnooze))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(unsnoozeEscalationMethodFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* mobileEscalationSaga() {
  yield takeLatest(ESCALATION_CONTACT_FETCH_REQUESTED, fetchEscalationContact)
  yield takeLatest(SNOOZE_ESCALATION_METHOD_REQUESTED, snoozeEscalationMethod)
  yield takeLatest(
    UNSNOOZE_ESCALATION_METHOD_REQUESTED,
    unsnoozeEscalationMethod,
  )
}

export default mobileEscalationSaga

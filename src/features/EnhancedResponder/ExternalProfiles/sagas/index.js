// saga
import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'

import {
  fetchContactsRequested,
  fetchContactsSucceeded,
  fetchContactsFailed,
  createContactRequested,
  createContactSucceeded,
  createContactFailed,
  deleteContactRequested,
  deleteContactSucceeded,
  deleteContactFailed,
  updateContactRequested,
  updateContactSucceeded,
  updateContactFailed,
  closeUpdateModal,
} from '../externalContactsSlice'

import {
  // ALERTS
  GET_EXTERNAL_PROFILES_BY_ACCOUNT,
  CREATE_EXTERNAL_PROFILE,
  DELETE_EXTERNAL_PROFILE,
  UPDATE_EXTERNAL_PROFILE,
} from './gql'

function* fetchContacts(action) {
  try {
    const variables = action.payload
    const {
      data: { getExternalProfilesByAccount },
    } = yield call(createQuery, GET_EXTERNAL_PROFILES_BY_ACCOUNT, variables)
    yield put(
      fetchContactsSucceeded({ contacts: getExternalProfilesByAccount }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchContactsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createContact(action) {
  try {
    const variables = action.payload
    const {
      data: {
        createExternalProfileV2: { externalProfile },
      },
    } = yield call(createMutation, CREATE_EXTERNAL_PROFILE, variables)
    yield put(createContactSucceeded({ contact: externalProfile }))
  } catch (error) {
    const { message } = error
    yield put(createContactFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* deleteContact(action) {
  try {
    const variables = action.payload
    yield call(createMutation, DELETE_EXTERNAL_PROFILE, variables)
    yield put(deleteContactSucceeded(variables))
  } catch (error) {
    const { message } = error
    yield put(deleteContactFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateContact(action) {
  try {
    const variables = action.payload
    yield call(createMutation, UPDATE_EXTERNAL_PROFILE, variables)
    yield put(updateContactSucceeded(variables))
    yield put(closeUpdateModal())
  } catch (error) {
    const { message } = error
    yield put(updateContactFailed({ message }))
    yield put(createNotification({ message }))
  }
}

export default function*() {
  yield takeLatest(fetchContactsRequested, fetchContacts)
  yield takeLatest(createContactRequested, createContact)
  yield takeLatest(deleteContactRequested, deleteContact)
  yield takeLatest(updateContactRequested, updateContact)
}

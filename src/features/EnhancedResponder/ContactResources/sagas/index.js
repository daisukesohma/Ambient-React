// saga
import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  addContactResource,
  updateContactResource,
  deleteContactResource,
} from 'features/EnhancedResponder/CheckinModal/redux/checkinModalSlice'

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
} from '../contactResourcesSlice'

import {
  // ALERTS
  GET_CONTACT_RESOURCES,
  CREATE_CONTACT_RESOURCE,
  DELETE_CONTACT_RESOURCE,
  UPDATE_CONTACT_RESOURCE,
} from './gql'

function* fetchContacts(action) {
  try {
    const variables = action.payload
    const {
      data: { contactResources },
    } = yield call(createQuery, GET_CONTACT_RESOURCES, variables)
    yield put(fetchContactsSucceeded({ contacts: contactResources }))
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
        createContactResource: { contactResource },
      },
    } = yield call(createMutation, CREATE_CONTACT_RESOURCE, variables)
    yield put(addContactResource({ contact: contactResource }))
    yield put(createContactSucceeded({ contact: contactResource }))
  } catch (error) {
    const { message } = error
    yield put(createContactFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* deleteContact(action) {
  try {
    const variables = action.payload
    const {
      data: {
        deleteContactResource: { contactResourceId },
      },
    } = yield call(createMutation, DELETE_CONTACT_RESOURCE, variables)
    yield put(deleteContactResource({ id: contactResourceId }))
    yield put(deleteContactSucceeded({ id: contactResourceId }))
  } catch (error) {
    const { message } = error
    yield put(deleteContactFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateContact(action) {
  try {
    const variables = action.payload
    const {
      data: {
        updateContactResource: { contactResource },
      },
    } = yield call(createMutation, UPDATE_CONTACT_RESOURCE, variables)
    yield put(updateContactResource({ contact: contactResource }))
    yield put(updateContactSucceeded({ contact: contactResource }))
  } catch (error) {
    const { message } = error
    yield put(updateContactFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

export default function*() {
  yield takeLatest(fetchContactsRequested, fetchContacts)
  yield takeLatest(createContactRequested, createContact)
  yield takeLatest(deleteContactRequested, deleteContact)
  yield takeLatest(updateContactRequested, updateContact)
}

// // saga
import { SagaIterator } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'

import {
  createTicketRequested,
  createTicketSucceeded,
  createTicketFailed,
} from '../redux/supportSlice'

import { CREATE_SUPPORT_TICKET } from './gql'

function* createTicket(action: any) {
  try {
    const input = action.payload
    const { data } = yield call(createMutation, CREATE_SUPPORT_TICKET, input)
    yield put(createTicketSucceeded({ data }))
    yield put(createNotification({ message: data.createSupportTicket.message }))
  } catch (error) {
    const { message } = error
    yield put(createTicketFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

export default function* supportHelp(): SagaIterator {
  yield takeLatest(createTicketRequested, createTicket)
}

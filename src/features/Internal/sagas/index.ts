import { call, put, takeLatest } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import isFunction from 'lodash/isFunction'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'

import {
  fetchUserSupportRequestsRequested,
  fetchUserSupportRequestsSucceeded,
  fetchUserSupportRequestsFailed,
  fetchAdminSupportRequestsRequested,
  fetchAdminSupportRequestsSucceeded,
  fetchAdminSupportRequestsFailed,
  fetchAccountSupportRequestsRequested,
  fetchAccountSupportRequestsSucceeded,
  fetchAccountSupportRequestsFailed,
  requestSupportAccessRequested,
  requestSupportAccessSucceeded,
  requestSupportAccessFailed,
  grantSupportAccessRequested,
  grantSupportAccessSucceeded,
  grantSupportAccessFailed,
  denySupportAccessRequested,
  denySupportAccessSucceeded,
  denySupportAccessFailed,
  withdrawSupportAccessRequested,
  withdrawSupportAccessSucceeded,
  withdrawSupportAccessFailed,
  releaseSupportAccessRequested,
  releaseSupportAccessSucceeded,
  releaseSupportAccessFailed,
  revokeSupportAccessRequested,
  revokeSupportAccessSucceeded,
  revokeSupportAccessFailed,
  fetchAccountsRequested,
  fetchAccountsSucceeded,
  fetchAccountsFailed,
} from '../redux/internalSlice'

import {
  REQUEST_SUPPORT_ACCESS,
  GRANT_SUPPORT_ACCESS,
  DENY_SUPPORT_ACCESS,
  WITHDRAW_SUPPORT_ACCESS,
  REVOKE_SUPPORT_ACCESS,
  RELEASE_SUPPORT_ACCESS,
  ACCOUNT_SUPPORT_ACCESS_REQUESTS_PAGINATED,
  USER_SUPPORT_ACCESS_REQUESTS_PAGINATED,
  ADMIN_SUPPORT_ACCESS_REQUESTS_PAGINATED,
  GET_ACCOUNTS,
} from './gql'

interface ActionType {
  payload: {
    accountSlug: string
    filters: {
      searchQuery: string | null
      accountSlug?: string | null
    }
    orderDesc: boolean
    page: number
    limit: number
  }
}

interface RequestSupportAccessInput {
  payload: {
    input: {
      accountSlug: string
      tsStartRequested?: number
      tsEndRequested: number
      reason: string
    }
  }
}

interface SupportAccessActionInput {
  payload: {
    input: {
      requestId: number
    }
  }
}

function* requestSupportAccess(
  action: RequestSupportAccessInput,
): SagaIterator {
  try {
    const { input } = action.payload
    const { data } = yield call(createMutation, REQUEST_SUPPORT_ACCESS, {
      input,
    })
    yield put(requestSupportAccessSucceeded({ data }))
    yield put(
      createNotification({ message: data.requestSupportAccess.message }),
    )
  } catch (error) {
    const { message } = error
    yield put(requestSupportAccessFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// TODO:
// probably a better way to do this, since only difference between these is the mutation
// maybe send the mutation through the payload?
function* grantSupportAccess(action: SupportAccessActionInput): SagaIterator {
  try {
    const { input } = action.payload
    const { data, errors } = yield call(createMutation, GRANT_SUPPORT_ACCESS, {
      input,
    })
    yield put(grantSupportAccessSucceeded({ data }))
    if (errors) {
      yield put(createNotification({ message: errors.message }))
    } else {
      yield put(
        createNotification({ message: data.grantSupportAccessRequest.message }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(grantSupportAccessFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* denySupportAccess(action: SupportAccessActionInput): SagaIterator {
  try {
    const { input } = action.payload
    const { data, errors } = yield call(createMutation, DENY_SUPPORT_ACCESS, {
      input,
    })
    yield put(denySupportAccessSucceeded({ data }))
    if (errors) {
      yield put(createNotification({ message: errors[0].message }))
    } else {
      yield put(
        createNotification({ message: data.denySupportAccessRequest.message }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(denySupportAccessFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* withdrawSupportAccess(
  action: SupportAccessActionInput,
): SagaIterator {
  try {
    const { input } = action.payload
    const { data, errors } = yield call(
      createMutation,
      WITHDRAW_SUPPORT_ACCESS,
      {
        input,
      },
    )
    yield put(withdrawSupportAccessSucceeded({ data }))
    if (errors) {
      yield put(createNotification({ message: errors[0].message }))
    } else {
      yield put(
        createNotification({
          message: data.withdrawSupportAccessRequest.message,
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(withdrawSupportAccessFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* releaseSupportAccess(action: SupportAccessActionInput): SagaIterator {
  try {
    const { input } = action.payload
    const { data, errors } = yield call(
      createMutation,
      RELEASE_SUPPORT_ACCESS,
      {
        input,
      },
    )
    yield put(releaseSupportAccessSucceeded({ data }))
    if (errors) {
      yield put(createNotification({ message: errors[0].message }))
    } else {
      yield put(
        createNotification({
          message: data.releaseSupportAccessRequest.message,
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(releaseSupportAccessFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* revokeSupportAccess(action: SupportAccessActionInput): SagaIterator {
  try {
    const { input } = action.payload
    const { data, errors } = yield call(createMutation, REVOKE_SUPPORT_ACCESS, {
      input,
    })
    yield put(revokeSupportAccessSucceeded({ data }))
    if (errors) {
      yield put(createNotification({ message: errors[0].message }))
    } else {
      yield put(
        createNotification({
          message: data.revokeSupportAccessRequest.message,
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(revokeSupportAccessFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchUserSupportRequests(action: ActionType): SagaIterator {
  try {
    const { filters, orderDesc, page, limit } = action.payload
    const { data } = yield call(
      createQuery,
      USER_SUPPORT_ACCESS_REQUESTS_PAGINATED,
      {
        filters,
        orderDesc,
        page,
        limit,
      },
    )
    yield put(fetchUserSupportRequestsSucceeded({ data }))
  } catch (error) {
    const { message } = error
    yield put(fetchUserSupportRequestsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchAdminSupportRequests(action: ActionType): SagaIterator {
  try {
    const { filters, orderDesc, page, limit } = action.payload
    const { data } = yield call(
      createQuery,
      ADMIN_SUPPORT_ACCESS_REQUESTS_PAGINATED,
      {
        filters,
        orderDesc,
        page,
        limit,
      },
    )
    yield put(fetchAdminSupportRequestsSucceeded({ data }))
  } catch (error) {
    const { message } = error
    yield put(fetchAdminSupportRequestsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchAccountSupportRequests(action: ActionType): SagaIterator {
  try {
    const { filters, accountSlug, orderDesc, page, limit } = action.payload
    const { data } = yield call(
      createQuery,
      ACCOUNT_SUPPORT_ACCESS_REQUESTS_PAGINATED,
      {
        filters,
        accountSlug,
        orderDesc,
        page,
        limit,
      },
    )
    yield put(fetchAccountSupportRequestsSucceeded({ data }))
  } catch (error) {
    const { message } = error
    yield put(fetchAccountSupportRequestsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchAccounts(action: {
  payload: { onCompleted: () => void }
}): SagaIterator {
  const { onCompleted } = action.payload
  try {
    const { data } = yield call(createQuery, GET_ACCOUNTS)
    yield put(fetchAccountsSucceeded({ data }))
  } catch (error) {
    const { message } = error
    yield put(fetchAccountsFailed({ error: message }))
    yield put(createNotification({ message }))
  } finally {
    if (isFunction(onCompleted)) onCompleted()
  }
}

function* internalSaga(): SagaIterator {
  yield takeLatest(requestSupportAccessRequested, requestSupportAccess)
  yield takeLatest(grantSupportAccessRequested, grantSupportAccess)
  yield takeLatest(denySupportAccessRequested, denySupportAccess)
  yield takeLatest(withdrawSupportAccessRequested, withdrawSupportAccess)
  yield takeLatest(releaseSupportAccessRequested, releaseSupportAccess)
  yield takeLatest(revokeSupportAccessRequested, revokeSupportAccess)
  yield takeLatest(fetchUserSupportRequestsRequested, fetchUserSupportRequests)
  yield takeLatest(
    fetchAdminSupportRequestsRequested,
    fetchAdminSupportRequests,
  )
  yield takeLatest(
    fetchAccountSupportRequestsRequested,
    fetchAccountSupportRequests,
  )
  yield takeLatest(fetchAccountsRequested, fetchAccounts)
}

export default internalSaga

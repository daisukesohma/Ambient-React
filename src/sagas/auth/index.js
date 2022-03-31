import { call, put, takeLatest } from 'redux-saga/effects'
import { persistor } from 'redux/store'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
// src
import { createMutationV2, createQueryV2 } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  verifyTokenRequested,
  verifyTokenSucceeded,
  verifyTokenFailed,
  logoutRequested,
  logoutInitiateRequested,
  logoutInitiateSucceeded,
  logoutInitiateFailed,
  verifyAccountsRequested,
  verifyAccountsSucceeded,
  verifyAccountsFailed,
  verifySitesRequested,
  verifySitesSucceeded,
  verifySitesFailed,
} from 'redux/slices/auth'
import JWTService from 'common/services/JWTService'
import APITokenService from 'common/services/APITokenService'

import {
  VERIFY_AUTH_TOKEN,
  VERIFY_ACCOUNTS,
  LOG_OUT_USER,
  VERIFY_SITES,
} from './gql'
import { NOTIFICATION_TYPES } from '../../redux/slices/notifications'

function* verifyAuthToken(action) {
  const { token, afterVerify } = action.payload
  let data
  try {
    const response = yield call(createMutationV2, VERIFY_AUTH_TOKEN, {
      input: { token },
    })
    const { errors } = response
    if (!isEmpty(errors)) throw Error(get(errors, [0, 'message'], ''))

    data = response.data.verifyTokenV2.data
    const { payload } = response.data.verifyTokenV2
    yield put(verifyTokenSucceeded({ ...data, payload }))
  } catch (error) {
    const { message } = error
    yield put(logoutRequested())
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
    yield put(verifyTokenFailed({ message }))
  } finally {
    if (isFunction(afterVerify)) yield call(afterVerify, data)
  }
}

function* revokeAuthToken() {
  try {
    yield call(JWTService.removeToken)
    yield call(APITokenService.removeToken)
    yield call(persistor.purge)
    // TODO: wait updates from Rodaan. Will need to implement revoke token process
    // const response = yield call(createMutationV2, REVOKE_AUTH_TOKEN, { token })
  } catch (error) {
    const { message } = error
  }
}

function* logoutInitiate() {
  try {
    const response = yield call(createMutationV2, LOG_OUT_USER)
    yield put(
      logoutInitiateSucceeded({
        message: response.message,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(logoutInitiateFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* verifyAccounts(action) {
  const { onDone } = action.payload
  try {
    const token = yield call(JWTService.getToken)
    const response = yield call(createMutationV2, VERIFY_ACCOUNTS, {
      input: { token },
    })
    const { errors } = response
    if (!isEmpty(errors)) throw Error(get(errors, [0, 'message'], ''))
    const { accounts } = response.data.verifyTokenV2.data
    yield put(verifyAccountsSucceeded({ accounts }))
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
    yield put(verifyAccountsFailed({ message }))
  } finally {
    if (isFunction(onDone)) yield call(onDone)
  }
}

function* verifySites(action) {
  const { accountSlug, onComplete } = action.payload
  try {
    const response = yield call(createQueryV2, VERIFY_SITES, {
      accountSlug,
    })
    const sites = get(response, 'data.allSitesByAccount', [])
    yield put(verifySitesSucceeded({ sites }))
  } catch (error) {
    const { message } = error
    yield put(verifySitesFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  } finally {
    if (isFunction(onComplete)) yield call(onComplete)
  }
}

function* authSaga() {
  yield takeLatest(logoutInitiateRequested, logoutInitiate)
  yield takeLatest(verifyTokenRequested, verifyAuthToken)
  yield takeLatest(logoutRequested, revokeAuthToken)

  yield takeLatest(verifyAccountsRequested, verifyAccounts)
  yield takeLatest(verifySitesRequested, verifySites)
}

export default authSaga

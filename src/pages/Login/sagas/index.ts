/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { select, call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
import has from 'lodash/has'
import isFunction from 'lodash/isFunction'
// src
import { createQuery, createMutationV2 } from 'providers/apollo'
import {
  createNotification,
  NOTIFICATION_TYPES,
} from 'redux/slices/notifications'
import { api, getHost } from 'utils'
import config from 'config'

import {
  ReducerProps,
  changeView,
  checkMfaRequested,
  checkMfaSucceeded,
  checkMfaFailed,
  tokenAuthRequested,
  tokenAuthSucceeded,
  tokenAuthFailed,
  verifyTokenRequested,
  verifyTokenSucceeded,
  verifyTokenFailed,
  ssoLoginRequested,
  ssoLoginSucceeded,
  ssoLoginFailed,
} from '../redux/loginSlice'
import { VIEWS } from '../enums'
import JWTService from '../../../common/services/JWTService'
import { loginSucceeded } from '../../../redux/slices/auth'
import trackEventToMixpanel from '../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../enums'
import APITokenService from '../../../common/services/APITokenService'

import { CHECK_MFA, TOKEN_AUTH, VERIFY_AUTH_TOKEN } from './gql'

const host = getHost(config.api.HOST, null)

interface ActionProps {
  payload: {
    onSuccess: () => void
  }
}

function* checkMfa(action: ActionProps) {
  try {
    const { onSuccess } = action.payload
    const { username, password } = yield select(
      (state: ReducerProps) => state.login.form,
    )
    const response = yield call(createMutationV2, CHECK_MFA, {
      input: { username, password },
    })

    const {
      message,
      ok,
      mfaEnabled,
    } = response.data.checkMultiFactorAuthentication
    if (!ok) throw Error(message)
    if (mfaEnabled) {
      yield put(changeView({ view: VIEWS.MFA_VERIFY }))
    } else {
      yield put(tokenAuthRequested({ onSuccess }))
    }
    yield put(checkMfaSucceeded({}))
  } catch (error) {
    const { message } = error
    yield put(checkMfaFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* tokenAuth(action: ActionProps) {
  try {
    const { onSuccess } = action.payload
    const { username, password, code } = yield select(
      (state: ReducerProps) => state.login.form,
    )
    // GQL Auth
    const gqlResponse = yield call(createQuery, TOKEN_AUTH, {
      username,
      password,
      code,
    })
    // Old REST API Auth
    const apiResponse = yield call(api, {
      url: `${host}/token_auth`,
      method: 'POST',
      params: null,
      data: { username, password },
    })

    // NOTE: we need this to rises needed because BE respond with 200 OK and errors (should be 4xx or 5xx group)
    if (has(gqlResponse, 'errors')) {
      throw Error(get(gqlResponse, 'errors[0].message'))
    }
    if (get(gqlResponse, 'data.tokenAuth.data.ok', false) === false) {
      throw Error(get(gqlResponse, 'data.tokenAuth.data.message', null))
    }

    const { token } = gqlResponse.data.tokenAuth
    const apiToken = apiResponse.data.token
    // TODO: we will need to remove this data. On tokenAuth we need just store token,
    //  because on next steps we have verifyToken endpoint which populate all needed data
    const {
      accounts,
      nodes,
      profile,
      sites,
      user,
    } = gqlResponse.data.tokenAuth.data
    yield call(JWTService.setToken, token)
    yield call(APITokenService.setToken, apiToken)

    yield put(
      loginSucceeded({
        accounts,
        profile,
        user,
        sites,
        nodes,
        // will need to remove if after first release
        apiToken,
        token,
      }),
    )
    yield call(trackEventToMixpanel, MixPanelEventEnum.AUTH_LOGIN)
    if (isFunction(onSuccess)) yield call(onSuccess, { accounts })
    yield put(tokenAuthSucceeded({}))
  } catch (error) {
    const { message } = error
    yield put(tokenAuthFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* verifyToken(action: ActionProps) {
  try {
    const { onSuccess } = action.payload
    const response = yield call(createQuery, VERIFY_AUTH_TOKEN)
    if (isFunction(onSuccess)) yield call(onSuccess, response.data)
    yield put(verifyTokenSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(verifyTokenFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* ssoLogin(action: ActionProps) {
  try {
    const { onSuccess } = action.payload
    const accountSlug = yield select(
      (state: ReducerProps) => state.login.form.accountSlug,
    )
    const url = `${host}/accounts/oktalogin/v2`
    const response = yield call(api, {
      url,
      method: 'POST',
      params: null,
      data: { accountSlug },
    })

    const { error } = response.data
    if (error) throw Error(error)

    if (isFunction(onSuccess)) yield call(onSuccess, response.data)
    yield put(ssoLoginSucceeded({}))
  } catch (error) {
    const { message } = error
    yield put(ssoLoginFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* saga() {
  yield takeLatest(checkMfaRequested, checkMfa)
  yield takeLatest(tokenAuthRequested, tokenAuth)
  yield takeLatest(verifyTokenRequested, verifyToken)
  yield takeLatest(ssoLoginRequested, ssoLogin)
}

export default saga

import { call, put, takeLatest } from 'redux-saga/effects'
import isFunction from 'lodash/isFunction'
// src
import { createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  createCommentRequested,
  createCommentSucceeded,
  createCommentFailed,
  updateCommentRequested,
  updateCommentSucceeded,
  updateCommentFailed,
  deleteCommentRequested,
  deleteCommentSucceeded,
  deleteCommentFailed,
  resolveAlertRequested,
  resolveAlertSucceeded,
  resolveAlertFailed,
  dispatchExternalRequested,
  dispatchExternalFailed,
  dispatchInternalRequested,
  dispatchInternalFailed,
} from 'redux/slices/alertModal'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'

import {
  // ALERTS
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  RESOLVE_ALERT_EVENT,
  DISPATCH_EXTERNAL,
  DISPATCH_INTERNAL,
} from './gql'

function* createComment(action) {
  try {
    const variables = action.payload
    const response = yield call(createMutation, CREATE_COMMENT, variables)
    yield put(createCommentSucceeded(response.data.createComment))
    // track mix MixPanelEventEnum
    yield call(trackEventToMixpanel, MixPanelEventEnum.COMMENT_CREATE)
  } catch (error) {
    const { message } = error
    yield put(createCommentFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* updateComment(action) {
  try {
    const variables = action.payload
    const response = yield call(createMutation, UPDATE_COMMENT, variables)
    yield put(updateCommentSucceeded(response.data.updateComment))
  } catch (error) {
    const { message } = error
    yield put(updateCommentFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* deleteComment(action) {
  try {
    const variables = action.payload
    yield call(createMutation, DELETE_COMMENT, variables)
    yield put(deleteCommentSucceeded(variables))
  } catch (error) {
    const { message } = error
    yield put(deleteCommentFailed(message))
    yield put(createNotification({ message }))
  }
}

function* resolveAlert(action) {
  try {
    const variables = action.payload
    const response = yield call(createMutation, RESOLVE_ALERT_EVENT, variables)
    yield put(resolveAlertSucceeded(response.data.resolveAlertEvent))
    yield call(trackEventToMixpanel, MixPanelEventEnum.ALERT_RESOLVED)
  } catch (error) {
    const { message } = error
    yield put(resolveAlertFailed(message))
    yield put(createNotification({ message }))
  }
}

function* dispatchExternal(action) {
  try {
    const { variables } = action.payload
    yield call(createMutation, DISPATCH_EXTERNAL, variables)
    yield call(trackEventToMixpanel, MixPanelEventEnum.ALERT_SHARE)
  } catch (error) {
    const { message } = error
    yield put(dispatchExternalFailed(message))
    yield put(createNotification({ message }))
  }
}

function* dispatchInternal(action) {
  try {
    const { variables, afterDispatch } = action.payload
    yield call(createMutation, DISPATCH_INTERNAL, variables)
    yield call(trackEventToMixpanel, MixPanelEventEnum.ALERT_DISPATCH)

    if (isFunction(afterDispatch)) {
      yield call(afterDispatch)
    }
  } catch (error) {
    const { message } = error
    yield put(dispatchInternalFailed(message))
    yield put(createNotification({ message }))
  }
}

function* alertModalSaga() {
  yield takeLatest(createCommentRequested, createComment)
  yield takeLatest(updateCommentRequested, updateComment)
  yield takeLatest(deleteCommentRequested, deleteComment)
  yield takeLatest(resolveAlertRequested, resolveAlert)
  yield takeLatest(dispatchExternalRequested, dispatchExternal)
  yield takeLatest(dispatchInternalRequested, dispatchInternal)
}

export default alertModalSaga

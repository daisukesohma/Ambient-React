/* eslint-disable import/no-named-as-default */
import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  videoWallTemplatesFetchRequested,
  videoWallTemplatesFetchSucceeded,
  videoWallTemplatesFetchFailed,
} from 'redux/slices/videoWall'

import { GET_VIDEO_WALL_TEMPLATES } from './gql'

import templates from './templates'

const TEST = false

function* fetchTemplateResources() {
  try {
    if (TEST) {
      const {
        data: { getVideoWallTemplates },
      } = templates
      yield put(
        videoWallTemplatesFetchSucceeded({
          videoWallTemplates: getVideoWallTemplates,
        }),
      )
    } else {
      const {
        data: { getVideoWallTemplates },
      } = yield call(createQuery, GET_VIDEO_WALL_TEMPLATES)
      yield put(
        videoWallTemplatesFetchSucceeded({
          videoWallTemplates: getVideoWallTemplates,
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(videoWallTemplatesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}
function* videoWallsSaga() {
  yield takeLatest(videoWallTemplatesFetchRequested, fetchTemplateResources)
}

export default videoWallsSaga

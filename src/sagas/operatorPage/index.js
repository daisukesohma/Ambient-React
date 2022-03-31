import { call, put, takeLatest, select } from 'redux-saga/effects'
import { map, parseInt, reject, isNumber, get } from 'lodash'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  fetchVideoWallRequested,
  fetchVideoWallSucceeded,
  fetchVideoWallFailed,
  updateVideoWallRequested,
  updateVideoWallSucceeded,
  updateVideoWallFailed,
  updateStreamFeedRequested,
  updateStreamFeedSucceeded,
  updateStreamFeedFailed,
  fetchSitesRequested,
  fetchSitesSucceeded,
  fetchSitesFailed,
  fetchStreamsRequested,
  fetchStreamsSucceeded,
  fetchStreamsFailed,
  fetchStreamSnapShotRequested,
  fetchStreamSnapShotSucceeded,
  fetchStreamSnapShotFailed,
  fetchUsersRequested,
  fetchUsersSucceeded,
  fetchUsersFailed,
} from 'redux/slices/operatorPage'
import { pausePlayer } from 'components/VideoWallPlayer/videoWallPlayerSlice'
import { GET_STREAM_SNAPSHOT } from 'gql/queries'

import {
  GET_STREAMS_BY_ACCOUNT,
  GET_OPERATOR_VIDEO_WALL,
  EDIT_VIDEO_WALL,
  EDIT_STREAM_FEED,
  GET_SITES_BY_ACCOUNT,
  GET_USERS,
} from './gql'

function* fetchStreams(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_STREAMS_BY_ACCOUNT, {
      accountSlug,
    })
    yield put(
      fetchStreamsSucceeded({ streams: response.data.findStreamsByAccount }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchStreamsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchStreamSnapShot(action) {
  try {
    const { streamId } = action.payload
    const response = yield call(createQuery, GET_STREAM_SNAPSHOT, { streamId })
    yield put(fetchStreamSnapShotSucceeded({ stream: response.data.getStream }))
  } catch (error) {
    const { message } = error
    yield put(fetchStreamSnapShotFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchSites(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    const sites = get(response, 'data.allSitesByAccount', [])
    yield put(fetchSitesSucceeded({ sites }))
  } catch (error) {
    const { message } = error
    yield put(fetchSitesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchOperatorVideoWall(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_OPERATOR_VIDEO_WALL, {
      accountSlug,
    })
    const videoWall = response.data.getOperatorVideoWall
    yield put(fetchVideoWallSucceeded({ videoWall }))
  } catch (error) {
    const { message } = error
    yield put(fetchVideoWallFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateOperatorVideoWall({ nodeId }) {
  try {
    let streamFeeds = yield select(
      state => state.operatorPage.videoWall.streamFeeds,
    )
    const videoWallId = yield select(state => state.operatorPage.videoWall.id)
    const templateId = yield select(
      state => state.operatorPage.videoWall.template.id,
    )
    // NOTE: Temporary. Until BE side works incorrect
    streamFeeds = reject(streamFeeds, item => !isNumber(item.streamId))
    streamFeeds = map(streamFeeds, streamFeed => ({
      id: parseInt(streamFeed.id),
      orderIndex: streamFeed.orderIndex,
      streamId: parseInt(streamFeed.streamId),
    }))
    const response = yield call(createMutation, EDIT_VIDEO_WALL, {
      streamFeeds,
      videoWallId,
      templateId,
    })
    yield put(
      updateVideoWallSucceeded({
        videoWall: response.data.editVideoWall.videoWall,
      }),
    )
    yield put(pausePlayer())
    yield put(
      createNotification({
        message: response.data.editVideoWall.message,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(updateVideoWallFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateStreamFeed(action) {
  try {
    const { videoWallId, streamId, orderIndex } = action.payload
    const response = yield call(createMutation, EDIT_STREAM_FEED, {
      videoWallId,
      streamId,
      orderIndex,
    })
    yield put(
      updateStreamFeedSucceeded({
        streamFeed: response.data.editStreamFeed.streamFeed,
      }),
    )
    yield put(pausePlayer())
    yield put(
      createNotification({
        message: response.data.editStreamFeed.message,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(updateStreamFeedFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchUsers(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_USERS, {
      accountSlug,
    })
    yield put(
      fetchUsersSucceeded({
        users: response.data.allActiveOrNewUsersByAccount,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchUsersFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* operatorPageSaga() {
  yield takeLatest(fetchVideoWallRequested, fetchOperatorVideoWall)
  yield takeLatest(fetchSitesRequested, fetchSites)
  yield takeLatest(fetchStreamsRequested, fetchStreams)
  yield takeLatest(updateVideoWallRequested, updateOperatorVideoWall)
  yield takeLatest(updateStreamFeedRequested, updateStreamFeed)
  yield takeLatest(fetchStreamSnapShotRequested, fetchStreamSnapShot)
  yield takeLatest(fetchUsersRequested, fetchUsers)
}

export default operatorPageSaga

/* eslint-disable import/no-named-as-default */
// Saga
import { call, put, takeLatest, select } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  fetchPlayListRequested,
  fetchPlayListSucceeded,
  requestFailed,
  addVideoWallRequested,
  addVideoWallSucceeded,
  removeVideoWallRequested,
  updateDurationRequested,
} from 'components/VideoWallPlayer/videoWallPlayerSlice'

import {
  GET_PLAYLIST,
  ADD_PLAYLIST_ENTRY,
  DELETE_PLAYLIST_ENTRY,
  // UPDATE_PLAYLIST_ENTRY,
  UPDATE_PLAYLIST_DURATION,
} from './gql'

function* fetchPlayList(action) {
  const { account } = action.payload
  try {
    const {
      data: { getPlaylist },
    } = yield call(createQuery, GET_PLAYLIST, {
      accountSlug: account,
    }) // account slug as action payload
    yield put(fetchPlayListSucceeded({ playList: getPlaylist }))
  } catch (error) {
    const { message } = error
    yield put(requestFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* addVideoWall(action) {
  try {
    const playlistId = yield select(state => state.videoWallPlayer.id)
    const {
      account,
      videoWall: { id },
    } = action.payload
    const {
      data: {
        addPlaylistEntry: { playlist, message },
      },
    } = yield call(createMutation, ADD_PLAYLIST_ENTRY, {
      input: {
        videoWallId: id,
        playlistId,
        accountSlug: account,
      },
    })
    yield put(addVideoWallSucceeded({ playlist }))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(requestFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* removeVideoWall(action) {
  try {
    const playlistId = yield select(state => state.videoWallPlayer.id)
    const {
      account,
      videoWall: { playlistEntryId },
    } = action.payload
    const {
      data: {
        deletePlaylistEntry: { message },
      },
    } = yield call(createMutation, DELETE_PLAYLIST_ENTRY, {
      input: {
        playlistId,
        playlistEntryId,
        accountSlug: account,
      },
    })
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(requestFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateDuration(action) {
  try {
    const playlistId = yield select(state => state.videoWallPlayer.id)
    const { account, duration } = action.payload
    const {
      data: {
        updatePlaylistDuration: { message },
      },
    } = yield call(createMutation, UPDATE_PLAYLIST_DURATION, {
      input: {
        playlistId,
        duration,
        accountSlug: account,
      },
    })
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(requestFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* videoWallPlayerSaga() {
  yield takeLatest(fetchPlayListRequested, fetchPlayList)
  yield takeLatest(addVideoWallRequested, addVideoWall)
  yield takeLatest(removeVideoWallRequested, removeVideoWall)

  yield takeLatest(updateDurationRequested, updateDuration)
  // yield takeLatest(folderCreateRequested, createFolderResource)
  // yield takeLatest(folderEditRequested, editFolderResource)
  // yield takeLatest(folderDestroyConfirmed, deleteFolderResource)
}

export default videoWallPlayerSaga

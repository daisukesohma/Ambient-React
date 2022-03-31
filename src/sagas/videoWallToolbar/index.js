import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  videoWallsFetchRequested,
  videoWallsFetchSucceeded,
  videoWallsFetchFailed,
  videoWallCreateRequested,
  videoWallCreateSucceeded,
  videoWallCreateFailed,
  videoWallEditRequested,
  videoWallEditSucceeded,
  videoWallEditFailed,
  videoWallDestroyConfirmed,
  videoWallDestroySucceeded,
  videoWallDestroyFailed,
  foldersFetchRequested,
  foldersFetchSucceeded,
  foldersFetchFailed,
  folderCreateRequested,
  folderCreateSucceeded,
  folderCreateFailed,
  folderEditRequested,
  folderEditSucceeded,
  folderEditFailed,
  folderDestroyConfirmed,
  folderDestroySucceeded,
  folderDestroyFailed,
  folderApplySucceeded,
  removeFromFolder,
  videoWallUpdateForFolderSucceeded,
} from 'components/VideoWallToolbar/videoWallToolbarSlice'
import {
  setActiveVideoWall,
  unsetActiveVideoWall,
} from 'redux/slices/videoWall'

import {
  GET_FOLDERS,
  CREATE_FOLDER,
  EDIT_FOLDER,
  DELETE_FOLDER,
  GET_VIDEO_WALLS_AND_STREAMS,
  CREATE_VIDEO_WALL,
  EDIT_VIDEO_WALL,
  DELETE_VIDEO_WALL,
} from './gql'
import trackEventToMixpanel from '../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../enums'

function* fetchResources(action) {
  const { account } = action.payload
  try {
    const {
      data: { getVideoWallsForUser },
    } = yield call(createQuery, GET_VIDEO_WALLS_AND_STREAMS, {
      accountSlug: account,
    }) // account slug as action payload
    yield put(videoWallsFetchSucceeded({ videoWalls: getVideoWallsForUser }))
  } catch (error) {
    const { message } = error
    yield put(videoWallsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createResource(action) {
  try {
    const {
      account,
      name,
      isPublic,
      templateId,
      onRequestDone,
    } = action.payload
    const {
      data: {
        createVideoWallV2: { videoWall, message },
      },
    } = yield call(createMutation, CREATE_VIDEO_WALL, {
      input: {
        accountSlug: account,
        name,
        templateId,
        public: isPublic,
      },
    }) // account slug as action payload
    yield put(videoWallCreateSucceeded({ videoWall }))
    yield put(createNotification({ message }))
    yield call(trackEventToMixpanel, MixPanelEventEnum.VIDEO_WALL_CREATED, {
      videoWallId: videoWall.id,
    })
    if (onRequestDone) {
      yield onRequestDone(videoWall.id)
    }
  } catch (error) {
    const { message } = error
    yield put(videoWallCreateFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* editResource(action) {
  try {
    const { variables, onRequestDone, folderUpdated } = action.payload
    const {
      data: {
        editVideoWall: { videoWall, message },
      },
    } = yield call(createMutation, EDIT_VIDEO_WALL, variables)

    yield put(videoWallEditSucceeded({ videoWall }))
    yield call(trackEventToMixpanel, MixPanelEventEnum.VIDEO_WALL_UPDATED, {
      videoWallId: videoWall.id,
    })
    yield put(setActiveVideoWall({ activeVideoWall: videoWall }))
    if (folderUpdated) {
      yield put(folderApplySucceeded({ videoWall }))
    } else if (videoWall.folder !== null && videoWall.folder.id !== null) {
      // if the video wall name is changed, we need to update the folder tree structure as well
      yield put(videoWallUpdateForFolderSucceeded({ videoWall }))
    }
    yield put(createNotification({ message }))
    if (onRequestDone) {
      yield onRequestDone({ videoWall })
    }
  } catch (error) {
    const { message } = error
    yield put(videoWallEditFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteResource(action) {
  try {
    const { id, folderId } = action.payload.videoWall
    const response = yield call(createMutation, DELETE_VIDEO_WALL, {
      videoWallId: id,
    })
    yield put(videoWallDestroySucceeded({ id }))
    yield put(unsetActiveVideoWall({ id }))

    if (folderId) {
      yield put(removeFromFolder({ folderId, videoWallId: id }))
    }

    yield put(
      createNotification({
        message: response.data.deleteVideoWall.message,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(videoWallDestroyFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// folder sagas
function* fetchFolderResources(action) {
  try {
    const { account } = action.payload
    const {
      data: { getFoldersForUser },
    } = yield call(createQuery, GET_FOLDERS, { accountSlug: account })
    yield put(foldersFetchSucceeded({ folders: getFoldersForUser }))
  } catch (error) {
    const { message } = error
    yield put(foldersFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createFolderResource(action) {
  try {
    const { accountSlug } = action.payload
    const {
      data: {
        createFolder: { folder, message },
      },
    } = yield call(createMutation, CREATE_FOLDER, { accountSlug })
    yield put(folderCreateSucceeded({ folder }))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(folderCreateFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* editFolderResource(action) {
  try {
    const { name, folderId } = action.payload
    const {
      data: {
        editFolder: { folder, message },
      },
    } = yield call(createMutation, EDIT_FOLDER, { name, folderId })
    yield put(folderEditSucceeded({ folder }))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(folderEditFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteFolderResource(action) {
  try {
    const { folderId } = action.payload
    const {
      data: {
        deleteFolder: { message },
      },
    } = yield call(createMutation, DELETE_FOLDER, {
      folderId,
    })
    yield put(folderDestroySucceeded({ folderId }))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(folderDestroyFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* videoWallsSaga() {
  yield takeLatest(videoWallsFetchRequested, fetchResources)
  yield takeLatest(videoWallCreateRequested, createResource)
  yield takeLatest(videoWallEditRequested, editResource)
  yield takeLatest(videoWallDestroyConfirmed, deleteResource)

  yield takeLatest(foldersFetchRequested, fetchFolderResources)
  yield takeLatest(folderCreateRequested, createFolderResource)
  yield takeLatest(folderEditRequested, editFolderResource)
  yield takeLatest(folderDestroyConfirmed, deleteFolderResource)
}

export default videoWallsSaga

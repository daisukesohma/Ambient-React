import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { setShareLink } from 'redux/slices/shareLink'
import { showModal, hideModal } from 'redux/slices/modal'

function* setShareLinkParams(action) {
  const { content } = action.payload
  try {
    let streamId
    let ts
    let objectType
    let objectId

    // if just video modal
    streamId = content.streamId

    // if modal is Alert Modal
    if (content.alertEvent) {
      streamId = content.alertEvent.stream.id
      objectType = 'AlertEvent'
      objectId = content.alertEvent.id
    }

    yield put(
      setShareLink({
        type: 'video',
        params: {
          streamId,
          ts,
          objectType,
          objectId,
        },
      }),
    )
  } catch (error) {
    const { message } = error
  }
}

function* resetShareLinkParams(action) {
  try {
    yield put(
      setShareLink({
        type: 'video',
        params: {
          streamId: null,
          ts: null,
          objectType: null,
          objectId: null,
        },
      }),
    )
  } catch (error) {
    const { message } = error
  }
}

function* modalSaga() {
  yield takeLatest(showModal, setShareLinkParams)
  yield takeLatest(hideModal, resetShareLinkParams)
}

export default modalSaga

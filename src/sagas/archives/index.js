import { call, put, takeLatest } from 'redux-saga/effects'
import { hideModal } from 'redux/slices/modal'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  fetchSitesRequested,
  fetchSitesSucceeded,
  fetchSitesFailed,
  fetchStreamsRequested,
  fetchStreamsSucceeded,
  fetchStreamsFailed,
  fetchInstancesRequested,
  fetchInstancesSucceeded,
  fetchInstancesFailed,
  deleteClipRequested,
  deleteClipFailed,
} from 'redux/slices/archives'

import {
  GET_SITES_BY_ACCOUNT,
  GET_ARCHIVED_CLIPS,
  GET_STREAMS,
  DELETE_CLIP,
} from './gql'

function* fetchSites(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    yield put(fetchSitesSucceeded({ sites: response.data.allSitesByAccount }))
  } catch (error) {
    const { message } = error
    yield put(fetchSitesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchStreams(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const { data } = yield call(createQuery, GET_STREAMS, {
      accountSlug,
      siteSlug,
    })
    yield put(
      fetchStreamsSucceeded({ streamsPaginated: data.streamsPaginated }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchStreamsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchInstances(action) {
  try {
    const { accountSlug, siteSlug, ...filterOptions } = action.payload
    const { data } = yield call(createQuery, GET_ARCHIVED_CLIPS, {
      accountSlug,
      siteSlug,
      ...filterOptions,
    })
    yield put(
      fetchInstancesSucceeded({
        streamExportsPaginated: data.streamExportsPaginated,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchInstancesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteClip(action) {
  try {
    const { uniq, accountSlug, siteSlug, ...filterOptions } = action.payload
    yield call(createMutation, DELETE_CLIP, {
      uniq,
    })
    const { data } = yield call(createQuery, GET_ARCHIVED_CLIPS, {
      accountSlug,
      siteSlug,
      ...filterOptions,
    })
    yield put(
      fetchInstancesSucceeded({
        streamExportsPaginated: data.streamExportsPaginated,
      }),
    )

    // close modal
    yield put(hideModal())
  } catch (error) {
    const { message } = error
    yield put(deleteClipFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* archivesSaga() {
  yield takeLatest(fetchSitesRequested, fetchSites)
  yield takeLatest(fetchStreamsRequested, fetchStreams)
  yield takeLatest(fetchInstancesRequested, fetchInstances)
  yield takeLatest(deleteClipRequested, deleteClip)
}

export default archivesSaga

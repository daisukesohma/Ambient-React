/* eslint-disable import/no-named-as-default */
import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
// src
import { createQuery } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  catalogueFetchRequested,
  catalogueFetchSucceeded,
  catalogueFetchFailed,
} from 'components/VideoStreamV4/components/VideoStreamControlsV2/components/ControlBar/components/Calendar/vmsCalendarSlice'

import { GET_STREAM_CATALOGUE } from './gql'

function* fetchStreamCatalogueData(action) {
  const { accountSlug, siteSlug, streamId, startTs, endTs } = action.payload
  try {
    const response = yield call(createQuery, GET_STREAM_CATALOGUE, {
      accountSlug,
      siteSlug,
      streamId,
      startTs,
      endTs,
    })
    yield put(
      catalogueFetchSucceeded({
        catalogue: get(response, 'data.streamCatalogue.catalogue', []),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(catalogueFetchFailed({ error: message }))
  }
}

function* videoWallPlayerSaga() {
  yield takeLatest(catalogueFetchRequested, fetchStreamCatalogueData)
}

export default videoWallPlayerSaga

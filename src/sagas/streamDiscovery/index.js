import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
// src
import { createQuery, createMutation } from 'providers/apollo'
import {
  streamDiscoveryFetchSucceeded,
  streamDiscoveryFetchFailed,
  createStreamsSucceeded,
  createStreamsFailed,
  streamDiscoveryFetchThumbnailSucceeded,
  streamDiscoveryFetchThumbnailFailed,
} from 'redux/streamDiscovery/actions'
import {
  FETCH_REQUESTED,
  CREATE_STREAMS_REQUESTED,
  FETCH_THUMBNAIL_REQUESTED,
} from 'redux/streamDiscovery/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import {
  GET_NODE_REQUEST,
  CREATE_STREAMS,
  CREATE_CAPTURE_FRAME_REQUEST,
  ALL_SITES_BY_ACCOUNT,
} from './gql'

function* fetchResource(action) {
  const { nodeRequestId, accountSlug } = action.payload

  try {
    const nodeResponse = yield call(createQuery, GET_NODE_REQUEST, {
      nodeRequestId,
    })

    // fetch the first site Id here as default site Id, since nodeRequest stream data doesn't have site id, this is now determined on front-end dropdowns
    // this will place this default site id in the streamsToCreate in redux
    const siteIdsResponse = yield call(createQuery, ALL_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    const { nodeRequest } = nodeResponse.data
    yield put(
      streamDiscoveryFetchSucceeded({
        data: {
          ...nodeRequest,
          defaultSiteId: get(siteIdsResponse, 'data.allSitesByAccount[0]')
            ? siteIdsResponse.data.allSitesByAccount[0].id
            : null, // add in another value to the payload
        },
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(streamDiscoveryFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createStreams(action) {
  try {
    const { data } = action.payload
    const response = yield call(createMutation, CREATE_STREAMS, {
      data,
      restart: true, // always restart
    })
    const { createStream } = response.data
    yield put(createStreamsSucceeded(createStream))
    yield put(createNotification({ message: createStream.message }))
  } catch (error) {
    const { message } = error
    yield put(createStreamsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createCaptureFrameRequest(action) {
  const { streamUrl, id, nodeIdentifier } = action.payload
  try {
    const response = yield call(createMutation, CREATE_CAPTURE_FRAME_REQUEST, {
      requestJson: JSON.stringify({
        streams: [{ url: streamUrl, stream_discovered_id: id }],
      }),
      nodeIdentifier,
    })
    const { createNodeRequest } = response.data
    yield put(streamDiscoveryFetchThumbnailSucceeded(createNodeRequest))
    yield put(createNotification({ message: createNodeRequest.message }))
  } catch (error) {
    const { message } = error
    yield put(streamDiscoveryFetchThumbnailFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* streamDiscoverySaga() {
  yield takeLatest(FETCH_REQUESTED, fetchResource)
  yield takeLatest(CREATE_STREAMS_REQUESTED, createStreams)
  yield takeLatest(FETCH_THUMBNAIL_REQUESTED, createCaptureFrameRequest)
}

export default streamDiscoverySaga

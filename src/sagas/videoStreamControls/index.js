import { put, call, takeLatest, takeEvery, debounce } from 'redux-saga/effects'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  fetchStreamCatalogueDataRequested,
  fetchStreamCatalogueDataSucceeded,
  fetchStreamCatalogueDataFailed,
  dispatchAlertRequested,
  dispatchAlertSucceeded,
  dispatchAlertFailed,
  fetchMetadataRequested,
  fetchMetadataSucceeded,
  fetchMetadataFailed,
  fetchFilmstripSnapshotsRequested,
  fetchFilmstripSnapshotsSucceeded,
  fetchFilmstripSnapshotsFailed,
  fetchResultsRequested,
  fetchResultsSucceeded,
  fetchResultsFailed,
  fetchForensicsSuggestionsRequested,
  fetchForensicsSuggestionsSucceeded,
  fetchForensicsSuggestionsFailed,
  fetchStreamSnapshotsRequested,
  fetchStreamSnapshotsSucceeded,
  fetchStreamSnapshotsFailed,
} from 'redux/slices/videoStreamControls'
import { tsAtMidnight, getEntityCamelCase } from 'utils'

import {
  DISPATCH_ALERT,
  GET_META_DATA_BY_STREAM,
  GET_SNAPSHOTS_BY_STREAM,
  GET_STREAM_CATALOGUE,
  RESULTS_BY_SITE,
  GET_SEARCH_SUGGESTIONS, // forensics
} from './gql'
import trackEventToMixpanel from '../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../enums'

function* fetchStreamCatalogueData(action) {
  const {
    accountSlug,
    siteSlug,
    streamId,
    startTs,
    endTs,
    videoStreamKey,
    isInitial,
    initTs,
    timezone,
  } = action.payload
  try {
    const response = yield call(createQuery, GET_STREAM_CATALOGUE, {
      accountSlug,
      siteSlug,
      streamId,
      startTs,
      endTs,
    })

    const catalogueData = {
      videoStreamKey,
      data: response.data.streamCatalogue,
      isInitial,
      streamId,
      timezone,
    }
    if (
      !isEmpty(response.data.streamCatalogue) &&
      initTs >=
        tsAtMidnight(
          Math.max(
            response.data.streamCatalogue.retention.motionSegmentRetentionDays,
            response.data.streamCatalogue.retention
              .nonmotionSegmentRetentionDays,
          ) * -1,
        )
    ) {
      catalogueData.initTs = initTs
    } else if (initTs) {
      // yield put(
      //   createNotification({
      //     message: 'Requested footage older than max retention days',
      //   }),
      // )
    }

    yield put(fetchStreamCatalogueDataSucceeded(catalogueData))
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(
      fetchStreamCatalogueDataFailed({
        videoStreamKey,
      }),
    )
  }
}

function* dispatchAlert(action) {
  const {
    accountSlug,
    siteSlug,
    streamId,
    ts,
    name,
    videoStreamKey,
    callback,
  } = action.payload

  try {
    const response = yield call(createMutation, DISPATCH_ALERT, {
      accountSlug,
      siteSlug,
      streamId,
      ts,
      name,
    })
    yield put(dispatchAlertSucceeded({ response, videoStreamKey }))
    yield put(
      createNotification({
        message: `Custom Alert Created: ${name}  at ${moment
          .unix(ts / 1000)
          .format('MM/DD/YYYY HH:mm:ss')}`,
      }),
    )
    yield call(trackEventToMixpanel(MixPanelEventEnum.VMS_CUSTOM_ALERT_CREATED))

    if (isFunction(callback)) yield callback()
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(
      dispatchAlertFailed({
        videoStreamKey,
        message,
      }),
    )
  }
}

function* fetchMetadata(action) {
  const {
    accountSlug,
    siteSlug,
    streamId,
    startTs,
    endTs,
    videoStreamKey,
    queryString, // array of strings
  } = action.payload

  try {
    const metadataKey = getEntityCamelCase(queryString)

    const response = yield call(createQuery, GET_META_DATA_BY_STREAM, {
      accountSlug,
      siteSlug,
      startTs,
      endTs,
      streamId,
      metadataTypes: queryString,
    })
    const metadata = get(response, 'data.metadataByStream.metadata')

    yield put(
      fetchMetadataSucceeded({
        metadata,
        videoStreamKey,
        metadataKey,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(
      fetchMetadataFailed({
        videoStreamKey,
        message,
        metadataKey: getEntityCamelCase(queryString),
      }),
    )
  }
}

function* fetchFilmstripSnapshots(action) {
  const { streamId, videoStreamKey, startTs } = action.payload

  try {
    const response = yield call(createQuery, GET_SNAPSHOTS_BY_STREAM, {
      streamId,
      startTs,
    })
    const snapshots = get(
      response,
      'data.getStreamSnapshotsAfterTimestamp.snapshots',
      [],
    )

    yield put(fetchFilmstripSnapshotsSucceeded({ snapshots, videoStreamKey }))
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(
      fetchFilmstripSnapshotsFailed({
        videoStreamKey,
        message,
      }),
    )
  }
}

// Threat Signature - forensics results
function* fetchResults(action) {
  const {
    videoStreamKey,
    params, // streamId, etc. all the params for the query
  } = action.payload

  try {
    // PRODUCTION
    const response = yield call(createQuery, RESULTS_BY_SITE, params) // eslint-disable-line
    const responseData = response

    // TESTING
    // const responseData = mockData
    const results = get(responseData, 'data.forensicsResultsBySite')

    yield put(fetchResultsSucceeded({ results, videoStreamKey }))
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(
      fetchResultsFailed({
        videoStreamKey,
        message,
      }),
    )
  }
}

// Forensics Search Suggestions
function* fetchForensicsSearchSuggestions(action) {
  const { accountSlug } = action.payload
  try {
    const response = yield call(createQuery, GET_SEARCH_SUGGESTIONS, {
      accountSlug,
    })
    yield put(
      fetchForensicsSuggestionsSucceeded({
        searchSuggestions: get(
          response,
          'data.getSearchSuggestionsByAccount.searchSuggestions',
          [],
        ),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(
      fetchForensicsSuggestionsFailed({
        error: message,
      }),
    )
  }
}

// SNAPSHOTS
function* fetchStreamSnapshots(action) {
  const { streamId, startTs, videoStreamKey } = action.payload

  try {
    const response = yield call(createQuery, GET_SNAPSHOTS_BY_STREAM, {
      streamId,
      startTs,
    })
    const snapshots = get(
      response,
      'data.getStreamSnapshotsAfterTimestamp.snapshots',
      [],
    )

    yield put(fetchStreamSnapshotsSucceeded({ snapshots, videoStreamKey }))
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(
      fetchStreamSnapshotsFailed({
        videoStreamKey,
        message,
      }),
    )
  }
}

function* videoStreamControlsSaga() {
  yield takeLatest(fetchStreamCatalogueDataRequested, fetchStreamCatalogueData)
  yield takeLatest(dispatchAlertRequested, dispatchAlert)
  yield takeEvery(fetchMetadataRequested, fetchMetadata)
  yield takeLatest(fetchFilmstripSnapshotsRequested, fetchFilmstripSnapshots)
  yield takeLatest(fetchResultsRequested, fetchResults)
  yield takeLatest(
    fetchForensicsSuggestionsRequested,
    fetchForensicsSearchSuggestions,
  )
  yield debounce(300, fetchStreamSnapshotsRequested, fetchStreamSnapshots)
}

export default videoStreamControlsSaga

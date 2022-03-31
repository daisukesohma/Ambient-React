// saga
import { call, put, takeLatest, select } from 'redux-saga/effects'
import get from 'lodash/get'
import set from 'lodash/set'
import compact from 'lodash/compact'

// src
import { createQuery } from 'providers/apollo'
import { GET_STREAMS_BY_SITE } from 'sagas/contextGraph/gql'
import {
  entityFetchSucceeded,
  entityFetchFailed,
  regionsFetchSucceeded,
  regionsFetchFailed,
  sitesFetchSucceeded,
  sitesFetchFailed,
  regionStatsFetchSucceeded,
  regionStatsFetchFailed,
  streamsBySiteFetchSucceeded,
  streamsBySiteFetchFailed,
  snapshotsFetchSucceeded,
  snapshotsFetchFailed,
  suggestionsFetchSucceeded,
  suggestionsFetchFailed,
} from 'redux/forensics/actions'
import {
  ENTITY_FETCH_REQUESTED,
  REGIONS_FETCH_REQUESTED,
  REGION_STATS_FETCH_REQUESTED,
  SITES_FETCH_REQUESTED,
  STREAMS_FETCH_REQUESTED,
  SNAPSHOTS_FETCH_REQUESTED,
  SUGGESTIONS_FETCH_REQUESTED,
} from 'redux/forensics/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import mockData from './mockData'
import {
  RESULTS_BY_SITE,
  RESULTS_BY_SITE_REGION_STATS,
  GET_ALL_REGIONS,
  GET_SITES_BY_ACCOUNT,
  GET_SNAPSHOTS_BY_STREAM,
  GET_SEARCH_SUGGESTIONS,
} from './gql'
import config from 'config'

const isDemo = config.settings.demo

// ENTITIES
function* fetchEntities(action) {
  /*
  if (isDemo) {
    const { query, startTs, endTs, regionIds } = action.payload
    yield put(
      entityFetchSucceeded(
        mockData.forensicsResultsBySite(
          query.threatSignatureId,
          startTs,
          endTs,
          regionIds,
        ),
      ),
    )
    return
  }
  */

  try {
    // TODO: This is a temporary workaround. De-dupe by stream for demo
    // needs to happen in the backend. Otherwise, we cannot de-dupe across pages.
    // Workaround by setting a reasonably high limit.
    const queryParams = isDemo
      ? {
          ...action.payload,
          limit: 100,
        }
      : action.payload

    const isVehicleFiltersActive = yield select(
      state => state.forensics.isVehicleFiltersActive,
    )
    const vehicleType = yield select(state => state.forensics.vehicleType)
    const vehicleColor = yield select(state => state.forensics.vehicleColor)
    const attributeFilters = compact([vehicleType, vehicleColor])

    const response = yield call(createQuery, RESULTS_BY_SITE, {
      ...queryParams,
      query: {
        ...get(queryParams, 'query', {}),
        attributeFilters: isVehicleFiltersActive ? attributeFilters : null,
      },
    })
    const data = response.data.forensicsResultsBySite

    if (isDemo) {
      // Demo restreams 5 minute clips, so the same incident is detected
      // multiple times. De-dupe here per stream by choosing the more recent
      // event.
      const { query, startTs, endTs, regionIds } = action.payload
      const streamTsMap = {}
      data.instances.forEach(instance => {
        // Improve ReID quality
        if (!query.reidQueryEntityId || instance.stream.name.startsWith('RD')) {
          const currentInstance = streamTsMap[instance.stream.id]
          if (
            !currentInstance ||
            parseInt(instance.ts, 10) <= parseInt(currentInstance.ts, 10)
          ) {
            streamTsMap[instance.stream.id] = instance
          }
        }
      })
      const filteredInstances = Object.values(streamTsMap)
      // Append with more data for richness
      const mockId = mockData.translate(query.threatSignatureId || query.query)
      const finalInstances = mockId
        ? filteredInstances.concat(
            mockData.forensicsResultsBySite(mockId, startTs, endTs, regionIds)
              .instances,
          )
        : filteredInstances

      const finalData = {
        ...data,
        instances: finalInstances,
        totalCount: finalInstances.length,
        pages: 1,
      }
      yield put(entityFetchSucceeded(finalData))
      return
    }

    yield put(entityFetchSucceeded(data))
  } catch (error) {
    const { message } = error
    yield put(entityFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// REGION STAT DATA
function* fetchRegionStats(action) {
  /*

  if (isDemo) {
    const { query } = action.payload
    yield put(
      regionStatsFetchSucceeded(
        mockData.forensicsResultsBySiteRegionStats(query.threatSignatureId),
      ),
    )
    return
  }
  */

  const isVehicleFiltersActive = yield select(
    state => state.forensics.isVehicleFiltersActive,
  )
  const vehicleType = yield select(state => state.forensics.vehicleType)
  const vehicleColor = yield select(state => state.forensics.vehicleColor)
  const attributeFilters = compact([vehicleType, vehicleColor])

  try {
    const response = yield call(createQuery, RESULTS_BY_SITE_REGION_STATS, {
      ...action.payload,
      query: {
        ...get(action.payload, 'query', {}),
        attributeFilters: isVehicleFiltersActive ? attributeFilters : null,
      },
    })
    yield put(
      regionStatsFetchSucceeded(
        response.data.forensicsResultsBySiteRegionStats,
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(regionStatsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// REGIONS
function* fetchRegions(action) {
  /*

  if (isDemo) {
    yield put(regionsFetchSucceeded(mockData.allRegions))
    return
  }
  */

  try {
    const response = yield call(createQuery, GET_ALL_REGIONS, action.payload)
    yield put(regionsFetchSucceeded(response.data.allRegions || []))
  } catch (error) {
    const { message } = error
    yield put(regionsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// SITES
function* fetchSites(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    yield put(sitesFetchSucceeded(response.data.allSitesByAccount))
  } catch (error) {
    const { message } = error
    yield put(sitesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// STEAMS
function* fetchStreamsBySite(action) {
  /*
  if (isDemo) {
    yield put(streamsBySiteFetchSucceeded(mockData.streamsBySite))
    return
  }
  */

  try {
    const { accountSlug, siteSlug } = action.payload
    const response = yield call(createQuery, GET_STREAMS_BY_SITE, {
      accountSlug,
      siteSlug,
    })
    yield put(streamsBySiteFetchSucceeded(response.data.streamsBySite))
  } catch (error) {
    const { message } = error
    yield put(streamsBySiteFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// SNAPSHOTS
function* fetchSnapshotsByStream(action) {
  const { streamId, startTs } = action.payload

  if (isDemo && streamId < 0) {
    yield put(
      snapshotsFetchSucceeded(
        mockData.getStreamSnapshotsAfterTimestamp(startTs),
      ),
    )
    return
  }

  try {
    const response = yield call(createQuery, GET_SNAPSHOTS_BY_STREAM, {
      streamId,
      startTs,
    })
    yield put(
      snapshotsFetchSucceeded(
        get(response, 'data.getStreamSnapshotsAfterTimestamp.snapshots', []),
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(snapshotsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// SEARCH SUGGESTIONS
function* fetchSuggestions(action) {
  /*

  if (isDemo) {
    yield put(suggestionsFetchSucceeded(mockData.searchSuggestions))
    return
  }
  */
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SEARCH_SUGGESTIONS, {
      accountSlug,
    })
    yield put(
      suggestionsFetchSucceeded(
        get(
          response,
          'data.getSearchSuggestionsByAccount.searchSuggestions',
          [],
        ),
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(suggestionsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* forensicsSaga() {
  yield takeLatest(ENTITY_FETCH_REQUESTED, fetchEntities)
  yield takeLatest(REGIONS_FETCH_REQUESTED, fetchRegions)
  yield takeLatest(SITES_FETCH_REQUESTED, fetchSites)
  yield takeLatest(REGION_STATS_FETCH_REQUESTED, fetchRegionStats)
  yield takeLatest(STREAMS_FETCH_REQUESTED, fetchStreamsBySite)
  yield takeLatest(SNAPSHOTS_FETCH_REQUESTED, fetchSnapshotsByStream)
  yield takeLatest(SUGGESTIONS_FETCH_REQUESTED, fetchSuggestions)
}

export default forensicsSaga

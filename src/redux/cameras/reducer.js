/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'
import moment from 'moment'

import {
  // SITES ------------------------------
  // SITES Fetch
  FETCH_SITES_REQUESTED,
  FETCH_SITES_SUCCEEDED,
  FETCH_SITES_FAILED,
  // CHANGE_STREAM_SITE
  UPDATE_STREAM_SITE_REQUESTED,
  UPDATE_STREAM_SITE_SUCCEEDED,
  UPDATE_STREAM_SITE_FAILED,
  // STREAMS
  FIND_STREAMS_REQUESTED,
  FIND_STREAMS_SUCCEEDED,
  FIND_STREAMS_FAILED,
  // STREAM HEALTH
  SET_STREAM_HEALTH,
  SET_STREAM_HEALTH_IS_TABLE_UPDATED,
  SET_STREAM_HEALTH_LOADING,
  SET_STREAM_SEARCH_TERM,
  SET_SORT_OPTIONS,
  // STREAM IDS FOR SITE
  GET_ALL_STREAM_IDS_FOR_SITE_REQUESTED,
  GET_ALL_STREAM_IDS_FOR_SITE_SUCCEEDED,
  GET_ALL_STREAM_IDS_FOR_SITE_FAILED,
  // EDITABLE
  SET_EDITABLE_TABLE,
} from './actionTypes'

export const initialState = {
  // SITES
  sites: [],
  sitesLoading: false,
  selectedSite: null,

  // STREAMS
  streams: [],
  // streamsPages: null,
  streamsPages: 0,
  streamsCurrentPage: null,
  streamsTotalCount: null,
  streamsLoading: false,
  streamsSearch: null,
  sortBy: null,
  sortOrder: null,
  updateStreamSiteLoading: false,

  // STREAM HEALTH
  streamsHealth: {},
  streamsHealthLoading: false,
  streamsHealthUpdatedTs: null,
  streamsHealthIsTableUpdated: false, // is table data updated with new stream data
  streamsHealthIds: [],
  streamsHealthIdsLoading: false,

  // editable
  editable: false,
}

const camerasReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    // SITES START ++++++++++++++++++++++++++++++++++++++++++++++++++
    case FETCH_SITES_REQUESTED:
      draft.sitesLoading = true
      return draft

    case FETCH_SITES_SUCCEEDED:
      draft.sites = action.payload.sites
      draft.sitesLoading = false
      // Select first site
      if (action.payload.sites.length > 0) {
        draft.selectedSite = action.payload.sites[0].slug
      }
      return draft

    case FETCH_SITES_FAILED:
      draft.sitesLoading = false
      draft.error = action.payload.error
      return draft

    case UPDATE_STREAM_SITE_REQUESTED:
      draft.updateStreamSiteLoading = true
      return draft

    case UPDATE_STREAM_SITE_SUCCEEDED:
      draft.updateStreamSiteLoading = false
      draft.editable = false
      return draft

    case UPDATE_STREAM_SITE_FAILED:
      draft.updateStreamSiteLoading = false
      draft.error = action.payload.error
      return draft

    // SITES END ++++++++++++++++++++++++++++++++++++++++++++++++++++
    // STREAMS START ++++++++++++++++++++++++++++++++++++++++++++++++++
    case FIND_STREAMS_REQUESTED:
      draft.streamsLoading = true
      return draft

    case FIND_STREAMS_SUCCEEDED:
      draft.streams = action.payload.instances
      draft.streamsPages = action.payload.pages
      draft.streamsCurrentPage = action.payload.currentPage
      draft.streamsLoading = false
      draft.streamsTotalCount = action.payload.totalCount
      return draft

    case FIND_STREAMS_FAILED:
      draft.streamsLoading = false
      draft.error = action.payload.error
      return draft

    case SET_STREAM_SEARCH_TERM:
      draft.streamsSearch = action.payload.search
      return draft

    case SET_SORT_OPTIONS:
      draft.sortBy = action.payload.sortBy
      draft.sortOrder = action.payload.sortOrder
      return draft

    // STREAMS END ++++++++++++++++++++++++++++++++++++++++++++++++++
    // STREAM HEALTH START ++++++++++++++++++++++++++++++++++++++++
    case SET_STREAM_HEALTH:
      draft.streamsHealth = action.payload.data
      draft.streamsHealthUpdatedTs = moment().unix()
      draft.streamsHealthIsTableUpdated = false
      return draft

    case SET_STREAM_HEALTH_IS_TABLE_UPDATED:
      draft.streamsHealthIsTableUpdated = action.payload.isUpdated
      return draft

    case SET_STREAM_HEALTH_LOADING:
      draft.streamsHealthLoading = action.payload.isLoading
      return draft

    // STREAM HEALTH END +++++++++++++++++++++++++++++++++++++++++
    //
    case GET_ALL_STREAM_IDS_FOR_SITE_REQUESTED:
      draft.streamsHealthIdsLoading = true
      return draft

    case GET_ALL_STREAM_IDS_FOR_SITE_SUCCEEDED:
      draft.streamsHealthIds = action.payload.instances.map(s => s.id)
      draft.streamsHealthIdsLoading = false
      return draft

    case GET_ALL_STREAM_IDS_FOR_SITE_FAILED:
      draft.streamsHealthIdsLoading = false
      draft.error = action.payload.error
      return draft

    case SET_EDITABLE_TABLE:
      draft.editable = action.payload.editable
      return draft

    default:
      return draft
  }
})

export default camerasReducer

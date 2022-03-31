/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'

import {
  FETCH_ALL_BY_ACCOUNT_REQUESTED,
  FETCH_ALL_BY_ACCOUNT_SUCCEEDED,
  FETCH_ALL_BY_ACCOUNT_FAILED,
  FETCH_SITE_UP_TIME_REQUESTED,
  FETCH_SITE_UP_TIME_SUCCEEDED,
  FETCH_SITE_UP_TIME_FAILED,
  FETCH_NODE_STATISTICS_REQUESTED,
  FETCH_NODE_STATISTICS_SUCCEEDED,
  FETCH_NODE_STATISTICS_FAILED,
} from './actionTypes'

const initialState = {
  collection: [],
  loading: false,
  error: null,
  siteUpTime: null,
  nodeStatistics: null,
}

const siteReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    // fetch
    case FETCH_ALL_BY_ACCOUNT_REQUESTED:
      draft.loading = true
      return draft

    case FETCH_ALL_BY_ACCOUNT_SUCCEEDED:
      draft.collection = action.payload.sites
      draft.loading = false
      return draft

    case FETCH_ALL_BY_ACCOUNT_FAILED:
      draft.loading = false
      draft.error = action.payload.error
      return draft

    case FETCH_SITE_UP_TIME_REQUESTED:
      draft.loading = true
      return draft

    case FETCH_SITE_UP_TIME_SUCCEEDED:
      draft.siteUpTime = action.payload.siteUpTime
      draft.loading = false
      return draft

    case FETCH_SITE_UP_TIME_FAILED:
      draft.loading = false
      draft.error = action.payload.error
      return draft

    case FETCH_NODE_STATISTICS_REQUESTED:
      draft.loading = true
      return draft

    case FETCH_NODE_STATISTICS_SUCCEEDED:
      draft.nodeStatistics = action.payload.nodeStatistics
      draft.loading = false
      return draft

    case FETCH_NODE_STATISTICS_FAILED:
      draft.loading = false
      draft.error = action.payload.error
      return draft

    default:
      return draft
  }
})

export default siteReducer

/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createReducer } from '@reduxjs/toolkit'
import findIndex from 'lodash/findIndex'

import {
  FETCH_ALL_BY_ACCOUNT_REQUESTED,
  FETCH_ALL_BY_ACCOUNT_SUCCEEDED,
  FETCH_ALL_BY_ACCOUNT_FAILED,
  FETCH_SITE_UP_TIME_REQUESTED,
  FETCH_SITE_UP_TIME_SUCCEEDED,
  FETCH_SITE_UP_TIME_FAILED,
  FETCH_TIMEZONES_REQUESTED,
  FETCH_TIMEZONES_SUCCEEDED,
  FETCH_TIMEZONES_FAILED,
  UPDATE_SITE_INFO_REQUESTED,
  UPDATE_SITE_INFO_SUCCEEDED,
  UPDATE_SITE_INFO_FAILED,
  SET_SITE_UPDATING,
} from './actionTypes'

const initialState = {
  collection: [],
  timezones: [],
  loading: false,
  updating: false,
  loadingTimezones: false,
  siteUpdating: null,
  error: null,
  siteUpTime: null,
  nodeStatistics: null,
}

const sitesReducer = createReducer(initialState, {
  // fetch
  [FETCH_ALL_BY_ACCOUNT_REQUESTED]: state => {
    state.loading = true
  },

  [FETCH_ALL_BY_ACCOUNT_SUCCEEDED]: (state, action) => {
    state.collection = action.payload.sites
    state.loading = false
  },

  [FETCH_ALL_BY_ACCOUNT_FAILED]: (state, action) => {
    state.loading = false
    state.error = action.payload.error
  },

  [FETCH_SITE_UP_TIME_REQUESTED]: state => {
    state.loading = true
  },

  [FETCH_SITE_UP_TIME_SUCCEEDED]: (state, action) => {
    state.siteUpTime = action.payload.siteUpTime
    state.loading = false
  },

  [FETCH_SITE_UP_TIME_FAILED]: (state, action) => {
    state.loading = false
    state.error = action.payload.error
  },

  [UPDATE_SITE_INFO_REQUESTED]: (state, action) => {
    state.updating = true
  },

  [UPDATE_SITE_INFO_SUCCEEDED]: (state, action) => {
    state.updating = false
    const { site } = action.payload
    const index = findIndex(state.collection, { id: site.id })
    state.collection[index] = site
  },

  [UPDATE_SITE_INFO_FAILED]: (state, action) => {
    state.updating = false
    state.error = action.payload.error
  },

  [SET_SITE_UPDATING]: (state, action) => {
    state.siteUpdating = action.payload.site
  },

  [FETCH_TIMEZONES_REQUESTED]: (state, action) => {
    state.loadingTimezones = true
  },

  [FETCH_TIMEZONES_SUCCEEDED]: (state, action) => {
    state.loadingTimezones = false
    state.timezones = action.payload.timezones
  },

  [FETCH_TIMEZONES_FAILED]: (state, action) => {
    state.loadingTimezones = false
  },
})

export default sitesReducer

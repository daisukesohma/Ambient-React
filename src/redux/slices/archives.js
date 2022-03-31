/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import orderBy from 'lodash/orderBy'
import tsAtMidnight from 'utils/dateTime/tsAtMidnight'

const initialState = {
  loading: false,
  // states
  selectedStream: null,
  startTs: Math.floor(new Date().setHours(0, 0, 0) / 1000),
  endTs: Math.floor(new Date().setHours(23, 59, 59) / 1000),
  page: 1, // current page

  // sites
  loadingSites: false,
  siteOptions: [],

  // streams
  loadingStreams: false,
  streams: [],

  // clip instances
  loadingInstances: false,
  instances: [],
  pages: 1,

  // delete clip
  loadingDelete: false,
  clipToDelete: null,

  error: null,
}

const archivesSlice = createSlice({
  name: 'archives',
  initialState,

  reducers: {
    reset: () => initialState,
    setStateValue: (state, action) => {
      const { key, value } = action.payload
      state[key] = value
    },
    fetchSitesRequested: state => {
      state.loadingSites = true
    },
    fetchSitesSucceeded: (state, action) => {
      state.loadingSites = false
      const { sites } = action.payload
      state.siteOptions = sites.map(site => ({
        value: site.slug,
        label: site.name,
        timezone: site.timezone,
      }))
      if (sites.length > 0) {
        // set default site
        state.startTs = tsAtMidnight(0, sites[0].timezone)
        state.endTs = tsAtMidnight(1, sites[0].timezone) - 1 // 23:59:59
      }
    },
    fetchSitesFailed: (state, action) => {
      state.loadingSites = false
      state.error = action.payload.error
    },
    fetchStreamsRequested: state => {
      state.loadingStreams = true
      state.selectedStream = null
    },
    fetchStreamsSucceeded: (state, action) => {
      const {
        streamsPaginated: { instances },
      } = action.payload
      state.streams = instances.map(el => {
        return {
          value: el.id,
          label: el.name,
        }
      })

      state.streams.unshift({
        value: null,
        label: 'All Streams',
      })
      state.loadingStreams = false
    },
    fetchStreamsFailed: (state, action) => {
      state.loadingStreams = false
      state.error = action.payload.error
    },
    fetchInstancesRequested: state => {
      state.loadingInstances = true
    },
    fetchInstancesSucceeded: (state, action) => {
      const { instances, pages } = action.payload.streamExportsPaginated
      state.instances = orderBy(instances, ['startTs'], ['desc'])
      state.pages = pages

      state.loadingInstances = false
    },
    fetchInstancesFailed: (state, action) => {
      state.loadingInstances = false
      state.error = action.payload.error
    },
    deleteClipRequested: state => {
      state.loadingDelete = true
    },
    deleteClipSucceeded: (state, action) => {
      const { uniq } = action.payload
      state.loadingDelete = false
      // remove clip from the instances array
      state.instances = state.instances.filter(item => item.uniq !== uniq)
    },
    deleteClipFailed: (state, action) => {
      state.loadingDelete = false
      state.error = action.payload.error
    },
  },
})

export const {
  reset,
  setStateValue,
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
  deleteClipSucceeded,
  deleteClipFailed,
} = archivesSlice.actions

export default archivesSlice.reducer

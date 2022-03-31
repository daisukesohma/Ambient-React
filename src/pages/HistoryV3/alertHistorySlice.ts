/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { findIndex, assign, map } from 'lodash'

const defaultSite = {
  label: 'All Sites',
  value: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // for all sites, just use local timezone
}

export interface AlertHistorySliceProps {
  alertHistoryV3: {
    loading: boolean
    error: string | null
    dateRange: []
    selectedStreams: []
    isTestFilter: boolean
    page: number
    pages: number

    currentPage: number
    isGridView: boolean
    newAlertsNum: number
    tabIndex: number

    loadingSites: boolean
    siteOptions: []

    loadingAlertEvents: boolean
    alertEvents: []

    loadingThreatSignatures: boolean
    threatSignatures: []
    selectedThreatSignaturesFilter: []

    loadingStreams: boolean
    streamOptions: []
    selectedStreamsFilter: string[]

    loadingDownload: boolean
    downloadLink: boolean
  }
}

const slice = createSlice({
  name: 'alertHistoryV3',
  initialState: {
    loading: false,
    error: null,
    dateRange: [],
    selectedStreams: [],
    isTestFilter: false,
    page: 1,
    pages: 1,

    currentPage: 0,
    isGridView: false,
    newAlertsNum: 0,
    tabIndex: 0,

    loadingSites: false,
    siteOptions: [defaultSite],

    loadingAlertEvents: false,
    alertEvents: [],

    loadingThreatSignatures: false,
    threatSignatures: [],
    selectedThreatSignaturesFilter: [],

    loadingStreams: false,
    streamOptions: [],
    selectedStreamsFilter: [],

    loadingDownload: false,
    downloadLink: false,
  },

  reducers: {
    setStateValue: (state, action) => {
      const { key, value } = action.payload
      // @ts-ignore
      state[key] = value
    },
    setStateValues: (state, action) => {
      assign(state, action.payload)
    },
    fetchSitesRequested: (state, action) => {
      state.loadingSites = true
    },
    fetchSitesSucceeded: (state, action) => {
      const { allSites } = action.payload
      state.loadingSites = false
      state.siteOptions = [defaultSite].concat(
        map(allSites, ({ name, slug, timezone }) => ({
          label: name,
          value: slug,
          timezone,
        })),
      )
    },
    fetchSitesFailed: (state, action) => {
      state.loadingSites = false
      state.error = action.payload.error
    },
    fetchAlertEventsRequested: (state, action) => {
      state.loadingAlertEvents = true
    },
    fetchAlertEventsSucceeded: (state, action) => {
      const { alertEvents, pages } = action.payload
      state.loadingAlertEvents = false
      state.alertEvents = alertEvents
      state.pages = pages
      // state.page = page
    },
    fetchAlertEventsFailed: (state, action) => {
      state.loadingAlertEvents = false
      state.error = action.payload.error
    },
    fetchThreatSignaturesRequested: state => {
      state.loadingThreatSignatures = true
    },
    fetchThreatSignaturesSucceeded: (state, action) => {
      const { threatSignatures } = action.payload
      state.loadingThreatSignatures = false
      state.threatSignatures = threatSignatures
      // @ts-ignore
      state.selectedThreatSignaturesFilter = map(threatSignatures, 'value')
    },
    fetchThreatSignaturesFailed: (state, action) => {
      state.loadingThreatSignatures = false
      state.error = action.payload.error
    },
    fetchStreamsRequested: state => {
      state.loadingStreams = true
    },
    fetchStreamsSucceeded: (state, action) => {
      const { streams } = action.payload
      state.loadingStreams = false
      state.streamOptions = streams
      // @ts-ignore
      state.selectedStreamsFilter = map(streams, 'value')
      // state.page = 1
    },
    fetchStreamsFailed: (state, action) => {
      state.loadingStreams = false
      state.error = action.payload.error
    },
    removeAlertEvent: (state, action) => {
      const { alertEventId }: { alertEventId: any } = action.payload
      // @ts-ignore
      const trueIdx = findIndex(state.alertEvents, { id: alertEventId })
      if (trueIdx > -1) {
        state.alertEvents.splice(trueIdx, 1)
      }
    },
    resolveAlertRequested: state => {
      state.loading = true
    },
    resolveAlertSucceeded: (state, action) => {
      state.loading = false

      const { resolvedAlertEvent } = action.payload
      if (resolvedAlertEvent.bookmarked) {
        // @ts-ignore
        state.alertEvents = map(state.alertEvents, alert => {
          // @ts-ignore
          if (alert.id === resolvedAlertEvent.id) {
            // @ts-ignore
            return { ...alert, status: 'RESOLVED' }
          }
          return alert
        })
      } else {
        // @ts-ignore
        const trueIdx = findIndex(state.alertEvents, {
          // @ts-ignore
          id: resolvedAlertEvent.id,
        })
        if (trueIdx > -1) {
          state.alertEvents.splice(trueIdx, 1)
        }
      }
    },
    resolveAlertFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
  },
})

export const {
  setStateValue,
  setStateValues,
  fetchSitesRequested,
  fetchSitesSucceeded,
  fetchSitesFailed,
  fetchAlertEventsRequested,
  fetchAlertEventsSucceeded,
  fetchAlertEventsFailed,
  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,
  fetchStreamsRequested,
  fetchStreamsSucceeded,
  fetchStreamsFailed,
  resolveAlertRequested,
  resolveAlertSucceeded,
  resolveAlertFailed,
} = slice.actions

export default slice.reducer

/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { findIndex, assign } from 'lodash'
// src
import { produceFilter } from 'pages/History/utils'

const getInitialDate = () => {
  const startDate = new Date()
  const pastDate = startDate.getDate() - 3
  startDate.setDate(pastDate)
  startDate.setHours(0, 0, 0, 0)
  const tomorrow = new Date(new Date().setHours(24, 0, 0, 0))
  return [startDate.getTime() / 1000, tomorrow.getTime() / 1000] // save unix timestamp
}

const defaultSite = {
  label: 'All Sites',
  value: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // for all sites, just use local timezone
}

const slice = createSlice({
  name: 'alertHistory',
  initialState: {
    loading: false,
    error: null,
    dateRange: getInitialDate(),
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
      state[key] = value
    },
    setStateValues: (state, action) => {
      assign(state, action.payload)
    },
    fetchSitesRequested: state => {
      state.loadingSites = true
    },
    fetchSitesSucceeded: (state, action) => {
      const { allSites } = action.payload
      state.loadingSites = false
      state.siteOptions = [defaultSite].concat(
        allSites.map(site => ({
          label: site.name,
          value: site.slug,
          timezone: site.timezone,
        })),
      )
    },
    fetchSitesFailed: (state, action) => {
      state.loadingSites = false
      state.error = action.payload.error
    },
    fetchAlertEventsRequested: state => {
      state.loadingAlertEvents = true
    },
    fetchAlertEventsSucceeded: (state, action) => {
      const { alertEvents, pages, page } = action.payload
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
      const selectedThreatSignaturesFilter = produceFilter(threatSignatures)
      state.loadingThreatSignatures = false
      state.threatSignatures = threatSignatures
      state.selectedThreatSignaturesFilter = selectedThreatSignaturesFilter
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
      const selectedStreamsFilter = produceFilter(streams)
      state.loadingStreams = false
      state.streamOptions = streams
      state.selectedStreamsFilter = selectedStreamsFilter
      // state.page = 1
    },
    fetchStreamsFailed: (state, action) => {
      state.loadingStreams = false
      state.error = action.payload.error
    },
    removeAlertEvent: (state, action) => {
      const { alertEventId } = action.payload
      const trueIdx = findIndex(
        state.alertEvents,
        alertEvent => alertEvent.id === alertEventId,
      )
      if (trueIdx > -1) {
        state.alertEvents.splice(trueIdx, 1)
      }
    },
    resolveAlertRequested: (state, action) => {
      state.loading = true
    },
    resolveAlertSucceeded: (state, action) => {
      state.loading = false

      const { resolvedAlertEvent } = action.payload
      if (resolvedAlertEvent.bookmarked) {
        state.alertEvents = state.alertEvents.map(alert => {
          if (alert.id === resolvedAlertEvent.id) {
            return { ...alert, status: 'RESOLVED' }
          }
          return alert
        })
      } else {
        // removing
        const trueIdx = findIndex(
          state.alertEvents,
          alertEvent => alertEvent.id === resolvedAlertEvent.id,
        )
        if (trueIdx > -1) {
          state.alertEvents.splice(trueIdx, 1)
        }
      }
    },
    resolveAlertFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
    fetchDownloadLinkRequested: state => {
      state.loadingDownload = true
    },
    fetchDownloadLinkSucceeded: (state, action) => {
      state.loadingDownload = false
      state.downloadLink = action.payload.link
    },
    fetchDownloadLinkFailed: (state, action) => {
      state.loadingDownload = false
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
  fetchDownloadLinkRequested,
  fetchDownloadLinkFailed,
  fetchDownloadLinkSucceeded,
} = slice.actions

export default slice.reducer

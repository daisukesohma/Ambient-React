/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import isEmpty from 'lodash/isEmpty'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import get from 'lodash/get'
import keys from 'lodash/keys'
import values from 'lodash/values'
import includes from 'lodash/includes'
import first from 'lodash/first'
// src
import tsAtMidnight from 'utils/dateTime/tsAtMidnight'

import {
  HISTORY_PANEL_STATUSES,
  SOUND_LEVELS,
  USE_DUMMY_DATA,
} from '../constants'

import dummy from '../saga/dummy'

const initialState = {
  lastUpdatedAt: null,
  isSocketConnected: false,
  isExpanded: false,
  fullScreen: false,
  clipSpe: false,

  // confirm modal window
  isConfirmVerifyModalOpen: false,
  confirmVerifyAlertInstance: {},

  // Active Alert instances
  alertInstances: USE_DUMMY_DATA
    ? dummy.data.getAlertInstancesPaginated.instances
    : [],
  alertsLoading: false,

  // Active Alert instances
  historyInstances: [],
  historyLoading: false,

  pageCount: 1,
  currentPage: 1,
  totalCount: 0,

  // clip
  clipLoading: false,

  // sites
  sites: [],
  sitesQuery: '',
  sitesLoading: false,
  selectedSites: [],

  streams: [],
  threatSignatures: [],

  getAlertLoading: false,
  searchedAlert: null,
  getAlertError: null,

  soundLevel: SOUND_LEVELS.MEDIUM,

  historicalFilter: {
    searchAlertId: '',
    status: get(HISTORY_PANEL_STATUSES, '0.value', 'outstanding'),
    tsStart: tsAtMidnight(),
    tsEnd: tsAtMidnight(1),
    threatSignatures: [],
    streams: [],
    sites: [],
  },
  error: null,
}

const slice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    toggleHistoryPanel: (state, action) => {
      // NOTE: Preselect sites for History Panel on open state
      if (!state.isExpanded && !isEmpty(action.payload.sites)) {
        state.historicalFilter.sites = action.payload.sites
      }
      state.isExpanded = !state.isExpanded
    },
    toggleFullScreen: state => {
      state.fullScreen = !state.fullScreen
    },
    toggleClipsType: state => {
      state.clipSpe = !state.clipSpe
    },
    // Confirmation Modal
    confirmVerifyAlertInstance: (state, action) => {
      state.confirmVerifyAlertInstance = action.payload.alert
      state.isConfirmVerifyModalOpen = true
    },
    setOpenConfirmVerifyModal: (state, action) => {
      state.isConfirmVerifyModalOpen = action.payload.isConfirmVerifyModalOpen
    },

    alertHistoryFetchRequested: (state, action) => {
      state.historyLoading = true
      state.currentPage = action.payload.page
    },
    alertHistoryFetchSucceeded: (state, action) => {
      if (isEmpty(action.payload)) return
      state.historyLoading = false
      state.historyInstances = action.payload.instances

      state.pageCount = action.payload.pages
      state.totalCount = action.payload.totalCount
    },
    alertHistoryFetchFailed: (state, action) => {
      state.historyLoading = false
      state.error = action.payload.message
    },

    alertClipFetchRequested: (state, action) => {
      const { alertInstanceId: id } = action.payload
      const alertInstanceIndex = findIndex(state.alertInstances, { id })
      if (alertInstanceIndex !== -1) {
        state.alertInstances[alertInstanceIndex].clipLoading = true
      }
      const historyInstanceIndex = findIndex(state.historyInstances, { id })
      if (historyInstanceIndex !== -1) {
        state.historyInstances[historyInstanceIndex].clipLoading = true
      }
    },
    alertClipFetchSucceeded: (state, action) => {
      const { id, clip, clipSpe } = action.payload.alert
      const alertInstanceIndex = findIndex(state.alertInstances, { id })
      if (alertInstanceIndex !== -1) {
        state.alertInstances[alertInstanceIndex].clipLoading = false
        if (isEmpty(state.alertInstances[alertInstanceIndex].clip)) {
          state.alertInstances[alertInstanceIndex].clip = clip
        }
        if (isEmpty(state.alertInstances[alertInstanceIndex].clipSpe)) {
          state.alertInstances[alertInstanceIndex].clipSpe = clipSpe
        }
      }
      const historyInstanceIndex = findIndex(state.historyInstances, { id })
      if (historyInstanceIndex !== -1) {
        state.historyInstances[historyInstanceIndex].clipLoading = false
        if (isEmpty(state.historyInstances[historyInstanceIndex].clip)) {
          state.historyInstances[historyInstanceIndex].clip = clip
        }
        if (isEmpty(state.historyInstances[historyInstanceIndex].clipSpe)) {
          state.historyInstances[historyInstanceIndex].clipSpe = clipSpe
        }
      }
    },
    alertClipFetchFailed: (state, action) => {
      state.error = action.payload.message
      const { alertInstanceId: id } = action.payload
      const alertInstanceIndex = findIndex(state.alertInstances, { id })
      if (alertInstanceIndex !== -1) {
        state.alertInstances[alertInstanceIndex].clipLoading = false
      }
      const historyInstanceIndex = findIndex(state.historyInstances, { id })
      if (historyInstanceIndex !== -1) {
        state.historyInstances[historyInstanceIndex].clipLoading = false
      }
    },

    sitesFetchRequested: state => {
      state.sitesLoading = true
    },
    sitesFetchSucceeded: (state, action) => {
      state.sitesLoading = false
      state.sites = action.payload.sites
    },
    sitesFetchFailed: (state, action) => {
      state.sitesLoading = false
      state.error = action.payload.message
    },

    verifyAlertRequested: (state, action) => {
      const { alertInstanceId: id } = action.payload

      const alertInstanceIndex = findIndex(state.alertInstances, { id })
      if (alertInstanceIndex !== -1)
        state.alertInstances[alertInstanceIndex].verifyLoading = true

      const historyInstanceIndex = findIndex(state.historyInstances, { id })
      if (historyInstanceIndex !== -1)
        state.historyInstances[historyInstanceIndex].verifyLoading = true
    },
    verifyAlertSucceeded: (state, action) => {
      const { id } = action.payload
      remove(state.alertInstances, { id })
      remove(state.historyInstances, { id })

      const alertInstanceIndex = findIndex(state.alertInstances, { id })
      if (alertInstanceIndex !== -1)
        state.alertInstances[alertInstanceIndex].verifyLoading = false

      const historyInstanceIndex = findIndex(state.historyInstances, { id })
      if (historyInstanceIndex !== -1)
        state.historyInstances[historyInstanceIndex].verifyLoading = false
    },
    verifyAlertFailed: (state, action) => {
      const { alertInstanceId: id, message } = action.payload
      state.error = message

      const alertInstanceIndex = findIndex(state.alertInstances, { id })
      if (alertInstanceIndex !== -1)
        state.alertInstances[alertInstanceIndex].verifyLoading = false

      const historyInstanceIndex = findIndex(state.historyInstances, { id })
      if (historyInstanceIndex !== -1)
        state.historyInstances[historyInstanceIndex].verifyLoading = false
    },

    getAlertInstanceRequested: state => {
      state.getAlertLoading = true
    },
    getAlertInstanceSucceeded: (state, action) => {
      const { alert } = action.payload
      state.getAlertLoading = false
      if (!isEmpty(alert)) state.historyInstances = [alert]
    },
    getAlertInstanceFailed: (state, action) => {
      state.getAlertLoading = false
      state.error = action.payload.message
    },

    setSelectedSites: (state, action) => {
      state.selectedSites = action.payload.selectedSites
      state.alertInstances = []
    },
    setSitesQuery: (state, action) => {
      state.sitesQuery = action.payload.sitesQuery
    },
    setHistoricalFilter: (state, action) => {
      const { payload } = action
      const historyKey = first(keys(payload))
      if (isEmpty(historyKey)) return
      state.historicalFilter[historyKey] = first(values(payload))
      if (includes(['tsStart', 'tsEnd', 'status', 'sites'], historyKey)) {
        state.historicalFilter.searchAlertId = ''
        state.historicalFilter.threatSignatures = []
        state.historicalFilter.streams = []
      }
    },
    addAlert: (state, action) => {
      state.alertInstances.unshift(action.payload.alertInstance)
    },
    setSoundLevel: (state, action) => {
      state.soundLevel = action.payload.soundLevel
    },
    allStreamsRequested: (state, action) => {},
    allStreamsSucceeded: (state, action) => {
      state.streams = action.payload.streams
    },

    allThreatSignaturesRequested: (state, action) => {},
    allThreatSignaturesSucceeded: (state, action) => {
      state.threatSignatures = action.payload.threatSignatures
    },
    // web socket
    wsConnect: () => {},
    wsStatus: (state, action) => {
      state.isSocketConnected = action.payload.isSocketConnected
    },
  },
})

export const {
  toggleHistoryPanel,
  toggleFullScreen,
  toggleClipsType,

  confirmVerifyAlertInstance,
  setOpenConfirmVerifyModal,

  alertHistoryFetchRequested,
  alertHistoryFetchSucceeded,
  alertHistoryFetchFailed,

  alertClipFetchRequested,
  alertClipFetchSucceeded,
  alertClipFetchFailed,

  sitesFetchRequested,
  sitesFetchSucceeded,
  sitesFetchFailed,

  verifyAlertRequested,
  verifyAlertSucceeded,
  verifyAlertFailed,

  getAlertInstanceRequested,
  getAlertInstanceSucceeded,
  getAlertInstanceFailed,

  setSelectedSites,
  setSitesQuery,
  setHistoricalFilter,

  setSoundLevel,

  allStreamsRequested,
  allStreamsSucceeded,

  allThreatSignaturesRequested,
  allThreatSignaturesSucceeded,

  // web socket
  wsConnect,
  wsStatus,

  addAlert,
} = slice.actions

export default slice.reducer

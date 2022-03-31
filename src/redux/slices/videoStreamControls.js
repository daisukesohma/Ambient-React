/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
// Primarily for handling video streams
import { createSlice } from '@reduxjs/toolkit'
import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import set from 'lodash/set'

import initializeVideoControlsState from '../../utils/initializeVideoControlsState'

// import SNAPSHOT_MOCK from './videoStreamControls-snapshots-mock'

const modalOpenInitial = {
  calendar: false,
  customAlert: false,
  keyboardShortcuts: false,
  motion: false,
  videoShareLink: false,
}

const metadataCurveInitial = {
  metadata: {},
  metadataCurveVisible: {
    person: true,
  },
  loadingMetadata: false,
}

// can add this to 'forensics' key in state later. Keeping this as forensicsSearchInitial to
// differentiate keys that are specific to forensics search within VMS
const forensicsSearchInitial = {
  // Forensics Search START
  forensicsSearchBarFocused: false, // is search bar focused
  isAlertCommentFocused: false, // is alert modal open and the comment box focused
  searchSuggestions: [],
  selectedSuggestion: {},
  searchQuery: {},
  history: [],
  // Forensics Search END
}

const videoStreamControlsSlice = createSlice({
  name: 'videoStreamControls',
  initialState: {
    ...forensicsSearchInitial,
  },
  reducers: {
    initControls: (state, action) => {
      const { videoStreamKey, initTs, timezone } = action.payload
      state[videoStreamKey] = initializeVideoControlsState({
        initTs,
        timezone,
      })
      state[videoStreamKey].ready = true
      state[videoStreamKey].times = []
      state[videoStreamKey].modalOpen = modalOpenInitial
      state[videoStreamKey].metadata = {}
      state[videoStreamKey].metadataCurveVisible = {
        person: true,
      }
    },
    fetchStreamCatalogueDataRequested: (state, action) => {
      const { videoStreamKey, timezone } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].catalogueLoading = true
        state[videoStreamKey].timezone = timezone
      }
    },
    fetchStreamCatalogueDataSucceeded: (state, action) => {
      const {
        videoStreamKey,
        data,
        isInitial,
        initTs,
        timezone,
      } = action.payload
      if (!state[videoStreamKey]) {
        state[videoStreamKey] = initializeVideoControlsState({
          initTs,
          timezone,
        })
      }
      if (state[videoStreamKey]) {
        if (!isEmpty(data)) {
          state[videoStreamKey].availableDays = data.availableDays
          state[videoStreamKey].catalogue = data.catalogue.sort((a, b) => {
            return Number(a.startTs) - Number(b.startTs)
          })
          state[videoStreamKey].entitySelections = data.entitySelections
          state[videoStreamKey].retention = data.retention
        }

        state[videoStreamKey].catalogueLoading = false
        state[videoStreamKey].ready = true
        if (isInitial && !isEmpty(data)) {
          state[videoStreamKey].originalEntities = data.entitySelections
        }
      }
    },
    fetchStreamCatalogueDataFailed: (state, action) => {
      const { videoStreamKey } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].catalogueLoading = false
      }
    },

    setDispatchAlertCustomTimeMode: (state, action) => {
      try {
        const { videoStreamKey, value } = action.payload
        let dispatchAlertManualTimeMode
        if (isUndefined(value)) {
          dispatchAlertManualTimeMode = !state[videoStreamKey]
            .dispatchAlertManualTimeMode
        } else {
          dispatchAlertManualTimeMode = value
        }
        state[
          videoStreamKey
        ].dispatchAlertManualTimeMode = dispatchAlertManualTimeMode
        if (!dispatchAlertManualTimeMode) {
          state[videoStreamKey].dispatchAlertTS = moment().unix()
        }
      } catch (e) {
        // console.error(action.payload)
      }
    },

    setDispatchAlertTS: (state, action) => {
      const { videoStreamKey, ts } = action.payload
      try {
        if (state[videoStreamKey]) {
          state[videoStreamKey].dispatchAlertTS = ts
        }
      } catch (e) {
        // console.error(action.payload)
      }
    },

    dispatchAlertRequested: (state, action) => {
      const { videoStreamKey } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].creatingDispatchRequest = true
      }
    },

    dispatchAlertSucceeded: (state, action) => {
      const { videoStreamKey } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].creatingDispatchRequest = false
      }
    },
    dispatchAlertFailed: (state, action) => {
      const { videoStreamKey } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].creatingDispatchRequest = false
      }
    },
    fetchMetadataRequested: (state, action) => {
      const { videoStreamKey } = action.payload
      if (!state[videoStreamKey]) {
        // initialize
        state[videoStreamKey] = metadataCurveInitial
      }
      state[videoStreamKey].loadingMetadata = true
      state[videoStreamKey].message = 'Gathering data for Motion Curves...'
      state[videoStreamKey].displayMessage = true
    },
    fetchMetadataSucceeded: (state, action) => {
      const { videoStreamKey, metadata, metadataKey } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].loadingMetadata = false

        const parseMetadata = metadata
          .map(_ => _.aggregations)
          .map(_ => _.byTimeUnit)
          .map(_ => _.buckets)
          .flat()
          .filter(_ => _.docCount > 1) // ensure min docCount GREATER than 1, or false positives
          .map(_ => ({
            date: moment.unix(_.keyAsString / 1000).toDate(),
            value: _.docCount,
          }))

        // add new key with results to metadata object
        // this will progressively add keys and overwrite existing keys,  never remove
        // ie. state[vkey].metadata = {  person: [],  car: [],  personCarryingBox: [] }
        //
        state[videoStreamKey].metadata = {
          ...state[videoStreamKey].metadata,
          [metadataKey]: parseMetadata,
        }

        state[videoStreamKey].message = ''
        state[videoStreamKey].displayMessage = false
      }
    },
    fetchMetadataFailed: (state, action) => {
      const { videoStreamKey, metadataKey } = action.payload
      if (!state[videoStreamKey]) {
        // initialize
        state[videoStreamKey] = metadataCurveInitial
      }

      state[videoStreamKey].loadingMetadata = false
      state[videoStreamKey].metadata = {
        ...state[videoStreamKey].metadata,
        [metadataKey]: [],
      }
      state[videoStreamKey].message = ''
      state[videoStreamKey].displayMessage = false
    },
    toggleMetadataCurveVisible: (state, action) => {
      const { videoStreamKey, metadataKey, visible } = action.payload
      set(
        state,
        `[${videoStreamKey}]metadataCurveVisible[${metadataKey}]`,
        visible,
      )
    },
    fetchFilmstripSnapshotsRequested: (state, action) => {
      const { videoStreamKey } = action.payload
      if (!state[videoStreamKey]) {
        state[videoStreamKey] = {
          snapshots: [],
        }
      }
      state[videoStreamKey].loadingSnapshots = true
      state[videoStreamKey].message = 'Loading Minimap...'
      state[videoStreamKey].displayMessage = true
    },
    fetchFilmstripSnapshotsSucceeded: (state, action) => {
      const { videoStreamKey, snapshots } = action.payload
      state[videoStreamKey].loadingSnapshots = false
      state[videoStreamKey].snapshots = snapshots //  SNAPSHOT_MOCK || snapshots
      state[videoStreamKey].message = ''
      state[videoStreamKey].displayMessage = false
    },
    fetchFilmstripSnapshotsFailed: (state, action) => {
      const { videoStreamKey } = action.payload
      state[videoStreamKey].loadingSnapshots = false
      state[videoStreamKey].snapshots = []
      state[videoStreamKey].message = ''
      state[videoStreamKey].displayMessage = false
    },
    cleanupVideoStreamControls: (state, action) => {
      delete state[action.payload.videoStreamKey]
    },
    // main function to set any key on the newly created
    setVideoStreamValues: (state, action) => {
      const { videoStreamKey, props } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey] = { ...state[videoStreamKey], ...props }
      }
    },
    fetchResultsRequested: (state, action) => {
      const { videoStreamKey } = action.payload

      if (!state[videoStreamKey]) {
        state[videoStreamKey] = {
          results: [],
        }
      }
      state[videoStreamKey].loadingSearch = true
      state[videoStreamKey].loadingMetadata = true
      state[videoStreamKey].message = 'Loading Results...'
      state[videoStreamKey].displayMessage = true
    },
    fetchResultsSucceeded: (state, action) => {
      const { videoStreamKey, results } = action.payload
      state[videoStreamKey].results = get(results, 'instances', [])
      state[videoStreamKey].searchResultsType = get(results, 'searchType')
      state[videoStreamKey].searchPages = get(results, 'pages')
      state[videoStreamKey].searchCurrentPage = get(results, 'currentPage')
      state[videoStreamKey].searchTotalCount = get(results, 'totalCount')
      state[videoStreamKey].loadingSearch = false
      state[videoStreamKey].message = ''
      state[videoStreamKey].displayMessage = false
    },
    fetchResultsFailed: (state, action) => {
      const { videoStreamKey } = action.payload
      state[videoStreamKey].loadingResults = false
      state[videoStreamKey].results = []
      state[videoStreamKey].message = ''
      state[videoStreamKey].displayMessage = false
    },
    setCurrentResultsPage: (state, action) => {
      const { videoStreamKey, searchCurrentPage } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].searchCurrentPage = searchCurrentPage
      }
    },
    // search suggestions
    fetchForensicsSuggestionsRequested: (state, action) => {},
    fetchForensicsSuggestionsSucceeded: (state, action) => {
      state.searchSuggestions = action.payload.searchSuggestions
    },
    fetchForensicsSuggestionsFailed: (state, action) => {},
    // setSelectedSuggestion: (state, action) => {
    //   const { selectedSuggestion } = action.payload
    // },
    setSelectedSuggestion: (state, action) => {
      state.selectedSuggestion = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    addHistoryItem: (state, action) => {
      if (
        !state.history.find(
          item => item.params.name === action.payload.params.name,
        )
      ) {
        state.history.push(action.payload)
      }
    },
    setForensicsSearchFocused: (state, action) => {
      state.forensicsSearchBarFocused = action.payload
    },
    setIsAlertCommentFocused: (state, action) => {
      state.isAlertCommentFocused = action.payload
    },
    resetSearch: (state, action) => {
      const { videoStreamKey } = action.payload
      state.searchQuery = {}
      state.selectedSuggestion = {}
      if (!isEmpty(state[videoStreamKey])) {
        state[videoStreamKey].results = []
        state[videoStreamKey].searchPages = 1
        state[videoStreamKey].searchCurrentPage = null
        state[videoStreamKey].searchTotalCount = 0
      }
    },
    addTimes: (state, action) => {
      const { videoStreamKey, time } = action.payload
      if (!state[videoStreamKey].times) {
        // initialize
        state[videoStreamKey].times = [time]
      } else {
        state[videoStreamKey].times.push(time)
      }
    },

    setModalOpen: (state, action) => {
      // open modals (calendar, etc.) on video player
      // each time this function is called, will close other modals

      const { videoStreamKey, modal, open } = action.payload // modal is required, open is optional

      // resets and overrides the modal name
      state[videoStreamKey].modalOpen = {
        ...modalOpenInitial,
        [modal]: open || !state[videoStreamKey].modalOpen[modal], // if open is passed, use it, else toggle
      }
    },
    fetchStreamSnapshotsRequested: (state, action) => {
      const { videoStreamKey } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].snapshotLoading = true
      }
    },
    fetchStreamSnapshotsSucceeded: (state, action) => {
      const { videoStreamKey, snapshots } = action.payload
      if (state[videoStreamKey]) {
        if (snapshots[0]) {
          state[videoStreamKey].snapshotUrl = snapshots[0].snapshotUrl
        }
        state[videoStreamKey].snapshotLoading = false
      }
    },
    fetchStreamSnapshotsFailed: (state, action) => {
      const { videoStreamKey } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].snapshotLoading = false
      }
    },
    clearSnapshot: (state, action) => {
      const { videoStreamKey } = action.payload
      if (state[videoStreamKey]) {
        state[videoStreamKey].snapshotUrl = null
        state[videoStreamKey].snapshotLoading = false
      }
    },
  },
})

export const {
  addHistoryItem,
  addTimes,
  cleanupVideoStreamControls,
  clearSnapshot,
  dispatchAlertFailed,
  dispatchAlertRequested,
  dispatchAlertSucceeded,
  fetchFilmstripSnapshotsFailed,
  fetchFilmstripSnapshotsRequested,
  fetchFilmstripSnapshotsSucceeded,
  fetchForensicsSuggestionsFailed,
  fetchForensicsSuggestionsRequested,
  fetchForensicsSuggestionsSucceeded,
  fetchMetadataFailed,
  fetchMetadataRequested,
  fetchMetadataSucceeded,
  fetchResultsFailed,
  fetchResultsRequested,
  fetchResultsSucceeded,
  fetchStreamCatalogueDataFailed,
  fetchStreamCatalogueDataRequested,
  fetchStreamCatalogueDataSucceeded,
  fetchStreamSnapshotsFailed,
  fetchStreamSnapshotsRequested,
  fetchStreamSnapshotsSucceeded,
  initControls,
  movePlaybackTimeOffsetSeconds,
  resetSearch,
  setCurrentResultsPage,
  setDispatchAlertCustomTimeMode,
  setDispatchAlertTS,
  setForensicsSearchFocused,
  setIsAlertCommentFocused,
  setModalOpen,
  setSearchQuery,
  setSelectedSuggestion,
  setVideoStreamValues,
  toggleMetadataCurveVisible,
} = videoStreamControlsSlice.actions

export default videoStreamControlsSlice.reducer

/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough, no-console */
import { createSlice } from '@reduxjs/toolkit'
import { failureModeToString } from '../components/utils/index'

const slice = createSlice({
  name: 'eventAnnotationPortal',
  initialState: {
    getDataPointToAnnotateLoading: false,
    currentDataPointId: null,
    currentVideoArchiveLink: null,
    currentVideoArchiveSPELink: null,
    currentEventAnnotationLabel: null,
    currentEventAnnotationOther: null,
    currentEventAnnotationFailureModes: [],
    currentEventAnnotationValidFailureModes: [],
    currentEventAnnotationThreatSignature: {},
    previousDataPointIds: [],
    allThreatSignatures: [],
    selectedThreatSignatures: [],
    threatSignaturesLoading: false,
    label: false,
    isNormalView: false,
    videoComponentKey: 0,
    error: null,
  },
  reducers: {
    dataPointToAnnotateFetchRequested: (state, action) => {
      state.getDataPointToAnnotateLoading = true
    },
    dataPointToAnnotateFetchSucceeded: (state, action) => {
      state.getDataPointToAnnotateLoading = false
      if (action.payload === null) {
        state.currentDataPointId = null
        state.currentVideoArchiveLink = null
        state.currentVideoArchiveSPELink = null
        state.currentEventAnnotationLabel = null
        state.currentEventAnnotationOther = null
        state.currentEventAnnotationFailureModes = []
        state.currentEventAnnotationValidFailureModes = []
        state.currentEventAnnotationThreatSignature = {}
      } else {
        const { id, videoArchive, eventAnnotation, speLink } = action.payload
        const { link } = videoArchive.videoArchive
        const {
          label,
          other,
          failureModes,
          validFailureModes,
          threatSignature,
        } = eventAnnotation

        const transformedFailureModes = failureModes.map(failureMode =>
          failureModeToString(failureMode),
        )

        state.currentDataPointId = id
        state.currentVideoArchiveLink = link
        state.currentVideoArchiveSPELink = speLink
        state.currentEventAnnotationLabel = label
        state.currentEventAnnotationOther = other
        state.currentEventAnnotationFailureModes = transformedFailureModes
        state.currentEventAnnotationValidFailureModes = validFailureModes
        state.currentEventAnnotationThreatSignature = threatSignature
      }
    },
    dataPointToAnnotateFetchFailed: (state, action) => {
      state.getDataPointToAnnotateLoading = false
      state.error = action.payload.message
    },
    getDataPointFetchRequested: (state, action) => {
      state.getDataPointToAnnotateLoading = true
    },
    getDataPointFetchSucceeded: (state, action) => {
      state.getDataPointToAnnotateLoading = false
      const { id, videoArchive, eventAnnotation, speLink } = action.payload
      const { link } = videoArchive.videoArchive
      const {
        label,
        other,
        failureModes,
        validFailureModes,
        threatSignature,
      } = eventAnnotation

      const transformedFailureModes = failureModes.map(failureMode =>
        failureModeToString(failureMode),
      )

      state.currentDataPointId = id
      state.currentVideoArchiveLink = link
      state.currentVideoArchiveSPELink = speLink
      state.currentEventAnnotationLabel = label
      state.currentEventAnnotationOther = other
      state.currentEventAnnotationFailureModes = transformedFailureModes
      state.currentEventAnnotationValidFailureModes = validFailureModes
      state.currentEventAnnotationThreatSignature = threatSignature
    },
    getDataPointFetchFailed: (state, action) => {
      state.getDataPointToAnnotateLoading = false
      state.error = action.payload.message
    },
    updateDataPointEventAnnotationFetchRequested: (state, action) => {
      state.updateDataPointEventAnnotationLoading = true
    },
    updateDataPointEventAnnotationFetchSucceeded: (state, action) => {
      state.updateDataPointEventAnnotationLoading = false
    },
    updateDataPointEventAnnotationFetchFailed: (state, action) => {
      state.updateDataPointEventAnnotationLoading = false
      state.error = action.payload.message
    },
    setCurrentEventAnnotationLabel: (state, action) => {
      state.currentEventAnnotationLabel = action.payload.label
    },
    setCurrentEventAnnotationFailureModes: (state, action) => {
      state.currentEventAnnotationFailureModes =
        action.payload.currentEventAnnotationFailureModes
    },
    setCurrentEventAnnotationOther: (state, action) => {
      state.currentEventAnnotationOther =
        action.payload.currentEventAnnotationOther
    },
    pushToPreviousDataPointIds: (state, action) => {
      state.previousDataPointIds.push(action.payload.dataPointId)
    },
    popPreviousDataPointIds: (state, action) => {
      state.previousDataPointIds.pop()
    },
    setIsNormalView: (state, action) => {
      state.isNormalView = action.payload.isNormalView
      state.videoComponentKey += 1
    },
    fetchThreatSignaturesRequested: (state, action) => {
      state.threatSignaturesLoading = true
    },
    fetchThreatSignaturesSucceeded: (state, action) => {
      state.allThreatSignatures = action.payload.allThreatSignatures
      state.selectedThreatSignatures = action.payload.defaultSelected
      state.threatSignaturesLoading = false
    },
    fetchThreatSignaturesFailed: state => {
      state.threatSignaturesLoading = false
    },
    setSelectedThreatSignatures: (state, action) => {
      state.selectedThreatSignatures = action.payload
    },
    setSelectedLabel: (state, action) => {
      state.label = action.payload
    },
  },
})

export const {
  dataPointToAnnotateFetchRequested,
  dataPointToAnnotateFetchSucceeded,
  dataPointToAnnotateFetchFailed,

  getDataPointFetchRequested,
  getDataPointFetchSucceeded,
  getDataPointFetchFailed,

  updateDataPointEventAnnotationFetchRequested,
  updateDataPointEventAnnotationFetchSucceeded,
  updateDataPointEventAnnotationFetchFailed,

  setCurrentEventAnnotationLabel,
  setCurrentEventAnnotationFailureModes,
  setCurrentEventAnnotationOther,

  pushToPreviousDataPointIds,
  popPreviousDataPointIds,

  setIsNormalView,
  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,
  setSelectedThreatSignatures,
  setSelectedLabel,
} = slice.actions

export default slice.reducer

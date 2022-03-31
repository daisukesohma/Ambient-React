/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import get from 'lodash/get'

import { ContextFeature } from './enums'

export const MIN_DURATION = 15

export const initialState = {
  threatSignaturePausePeriods: [],
  siteThreatSignatures: [],
  isOpened: false,
  navSelected: ContextFeature.THREAT_SIGNATURE_PAUSER,
  error: null,
  selectedSite: null,
  selectedThreatSignature: null,
  streamsWithThreatSignature: [],
  loading: false,
  modalOpen: false,
  cancelModalOpen: false,
  pausePeriodToDelete: null,
  cancellingPausePeriods: [],
}

const slice = createSlice({
  name: 'securityPosturePanel',
  initialState,
  reducers: {
    selectSite: (state, action) => {
      state.selectedSite = action.payload.site
      state.selectedThreatSignature = null
      state.streamsWithThreatSignature = []
    },
    selectThreat: (state, action) => {
      state.selectedThreatSignature = action.payload.threat
    },
    clearOptions: (state, action) => {
      state.selectedSite = null
      state.selectedThreatSignature = null
      state.streamsWithThreatSignature = []
      state.siteThreatSignatures = []
    },
    createThreatSignaturePausePeriodRequested: (state, action) => {
      state.loading = true
    },
    createThreatSignaturePausePeriodSucceeded: (state, action) => {
      // state.siteThreatSignatures = []
      // state.threatSignaturePausePeriods.push(
      // action.payload.threatSignaturePausePeriod,
      // )
    },
    createThreatSignaturePausePeriodFailed: (state, action) => {
      state.loading = false
    },
    getThreatSignaturePausePeriodsRequested: (state, action) => {
      state.loading = true
      state.pausePeriodToDelete = null
    },
    getThreatSignaturePausePeriodsSucceeded: (state, action) => {
      state.loading = false
      state.threatSignaturePausePeriods = action.payload
    },
    getThreatSignaturePausePeriodsFailed: (state, action) => {
      state.loading = false
    },
    getThreatSignaturePausePeriodRequested: (state, action) => {
      state.loading = true
    },
    getThreatSignaturePausePeriodSucceeded: (state, action) => {
      state.loading = false
    },
    getThreatSignaturePausePeriodFailed: (state, action) => {
      state.loading = false
    },
    cancelThreatSignaturePausePeriodRequested: (state, action) => {
      state.loading = true
      state.cancellingPausePeriods.push(
        parseInt(get(action.payload, 'threatSignaturePausePeriodId'), 10),
      )
    },
    cancelThreatSignaturePausePeriodSucceeded: (state, action) => {
      state.loading = false
      state.cancellingPausePeriods.filter(period => {
        return (
          period.id ===
          parseInt(get(action.payload.threatSignaturePausePeriod, 'id'), 10)
        )
      })
    },
    cancelThreatSignaturePausePeriodFailed: (state, action) => {
      state.loading = false
      state.cancellingPausePeriods.filter(period => {
        return period.id === parseInt(action.payload.id, 10)
      })
    },
    getStreamsWithThreatSignatureRequested: (state, action) => {
      state.loading = true
    },
    getStreamsWithThreatSignatureSucceeded: (state, action) => {
      state.loading = false
      state.streamsWithThreatSignature = action.payload
    },
    getStreamsWithThreatSignatureFailed: (state, action) => {
      state.loading = false
    },
    getAllThreatSignaturesBySiteRequested: (state, action) => {
      state.loading = true
    },
    getAllThreatSignaturesBySiteSucceeded: (state, action) => {
      state.loading = false
      state.siteThreatSignatures = action.payload
    },
    getAllThreatSignaturesBySiteFailed: (state, action) => {
      state.loading = false
    },
    toggleBar: (state, action) => {
      state.isOpened = !state.isOpened
    },
    closeModal: state => {
      state.modalOpen = false
    },
    toggleModal: (state, action) => {
      state.modalOpen = !state.modalOpen
    },
    toggleCancelModal: (state, action) => {
      state.cancelModalOpen = !state.cancelModalOpen
      state.pausePeriodToDelete = action.payload.id
    },
  },
})

export const {
  selectSite,
  selectThreat,
  createThreatSignaturePausePeriodRequested,
  createThreatSignaturePausePeriodSucceeded,
  createThreatSignaturePausePeriodFailed,
  getThreatSignaturePausePeriodsRequested,
  getThreatSignaturePausePeriodsSucceeded,
  getThreatSignaturePausePeriodsFailed,
  getThreatSignaturePausePeriodRequested,
  getThreatSignaturePausePeriodSucceeded,
  getThreatSignaturePausePeriodFailed,
  cancelThreatSignaturePausePeriodRequested,
  cancelThreatSignaturePausePeriodSucceeded,
  cancelThreatSignaturePausePeriodFailed,
  getStreamsWithThreatSignatureRequested,
  getStreamsWithThreatSignatureSucceeded,
  getStreamsWithThreatSignatureFailed,
  getAllThreatSignaturesBySiteRequested,
  getAllThreatSignaturesBySiteSucceeded,
  getAllThreatSignaturesBySiteFailed,
  toggleBar,
  clearOptions,
  toggleModal,
  closeModal,
  toggleCancelModal,
} = slice.actions

export default slice.reducer

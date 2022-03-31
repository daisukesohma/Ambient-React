/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'

export interface PauseAlertModalSliceType {
  pauseAlertModal: {
    error: string | null
    siteSlug: string | null
    threatSignatureId: string | null
    streamId: string | null
    loading: boolean
    modalOpen: boolean
    threatSignatureName: string | null
    streamName: string | null
  }
}

export const initialState = {
  error: null,
  siteSlug: null,
  threatSignatureId: null,
  streamId: null,
  loading: false,
  modalOpen: false,
  threatSignatureName: null,
  streamName: null,
}

const slice = createSlice({
  name: 'pauseAlertModal',
  initialState,
  reducers: {
    pauseAlertThreatSignaturePeriodRequested: (state, action) => {
      state.loading = true
      state.siteSlug = action.payload.siteSlug
    },
    pauseAlertThreatSignaturePeriodSucceeded: state => {
      state.loading = false
    },
    pauseAlertThreatSignaturePeriodFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
    closeModal: state => {
      state.modalOpen = false
      state.siteSlug = null
      state.threatSignatureId = null
      state.streamId = null
    },
    openModal: (state, action) => {
      state.modalOpen = true
      state.siteSlug = action.payload.siteSlug
      state.threatSignatureId = action.payload.threatSignatureId
      state.streamId = action.payload.streamId
      state.threatSignatureName = action.payload.threatSignatureName
      state.streamName = action.payload.streamName
    },
  },
})

export const {
  pauseAlertThreatSignaturePeriodRequested,
  pauseAlertThreatSignaturePeriodSucceeded,
  pauseAlertThreatSignaturePeriodFailed,
  closeModal,
  openModal,
} = slice.actions

export default slice.reducer

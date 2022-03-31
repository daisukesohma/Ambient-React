/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'

import { CreateAlertErrorReportRequestedActionType } from '../types'
/* TODO(AMB-2276|@rys): rename this to SubmitAlertFeedbackSliceType. */

export const initialState = {
  error: null,
  alertId: null,
  streamId: null,
  profileId: null,
  reason: '',
  description: '',
  loading: false,
  modalOpen: false,
  siteSlug: null,
  threatSignatureId: null,
  threatSignatureName: null,
  streamName: null,
}

const slice = createSlice({
  name: 'submitAlertModal',
  initialState,
  reducers: {
    createAlertErrorReportRequested: (
      state,
      action: CreateAlertErrorReportRequestedActionType,
    ) => {
      state.loading = true
      state.reason = action.payload.reason
      state.description = action.payload.description || ''
    },
    createAlertErrorReportSucceeded: state => {
      state.loading = false
    },
    createAlertErrorReportFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },

    recallAlertToSOCRequested: (state, action) => {
      state.loading = true
      state.alertId = action.payload.alertId
    },
    recallAlertToSOCSucceeded: state => {
      state.loading = false
    },
    recallAlertToSOCFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
    closeModal: state => {
      state.modalOpen = false
    },
    openModal: (state, action) => {
      state.modalOpen = true
      state.alertId = action.payload.alertId
      state.streamId = action.payload.streamId
      state.profileId = action.payload.profileId
      state.siteSlug = action.payload.siteSlug
      state.threatSignatureId = action.payload.threatSignatureId
      state.threatSignatureName = action.payload.threatSignatureName
      state.streamName = action.payload.streamName
    },
  },
})

export const {
  createAlertErrorReportRequested,
  createAlertErrorReportSucceeded,
  createAlertErrorReportFailed,

  recallAlertToSOCRequested,
  recallAlertToSOCSucceeded,
  recallAlertToSOCFailed,

  closeModal,
  openModal,
} = slice.actions

export default slice.reducer

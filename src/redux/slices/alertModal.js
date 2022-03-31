/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import reject from 'lodash/reject'
import find from 'lodash/find'
import map from 'lodash/map'
import get from 'lodash/get'

const initialState = {
  dispatchStatus: {},
  dispatchStatusLoading: false,

  createCommentLoading: false,
  updateCommentLoading: false,
  deleteCommentLoading: false,
  resolveLoading: false,

  error: null,
  loading: false,
  loadingDispatchExternal: false,
  loadingDispatchInternal: false,
}

const alertModalSlice = createSlice({
  name: 'alertModal',
  initialState,

  reducers: {
    resetState: () => initialState,

    fetchDispatchStatusRequested: state => {
      state.loading = true
    },

    fetchDispatchStatusSucceeded: (state, action) => {
      state.dispatchStatus = action.payload.dispatchStatus

      state.loading = false
    },

    dispatchExternalRequested: state => {
      state.loadingDispatchExternal = true
    },
    dispatchExternalFailed: (state, action) => {
      state.loadingDispatchExternal = false
      state.error = action.payload.error
    },

    dispatchInternalRequested: state => {
      state.loadingDispatchInternal = true
    },
    dispatchInternalSucceeded: (state, action) => {
      const { dispatchInternal } = action.payload

      const length = dispatchInternal.responders.length
      for (let i = 0; i < length; i++) {
        const newProfile = dispatchInternal.responders[i]
        const { dispatchLink } = dispatchInternal.dispatchedProfiles[i]
        // check if responder already exists
        const foundIndex = (state.dispatchStatus.responders || []).findIndex(
          responder => get(responder, 'profile.id') === newProfile.id,
        )
        if (foundIndex !== -1) {
          state.dispatchStatus.responders[
            foundIndex
          ].dispatchLink = dispatchLink
        } else {
          state.dispatchStatus.responders.push({
            profile: newProfile,
            dispatchLink,
            status: 'requested', // by default
          })
        }
      }
    },
    dispatchInternalFailed: (state, action) => {
      state.loadingDispatchInternal = false
      state.error = action.payload.error
    },

    fetchDispatchStatusFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },

    // create comment
    createCommentRequested: state => {
      state.createCommentLoading = true
    },

    createCommentSucceeded: (state, action) => {
      state.dispatchStatus.alertEvent.timeline = [
        action.payload.comment,
        ...state.dispatchStatus.alertEvent.timeline,
      ]
      state.createCommentLoading = false
    },

    createCommentFailed: (state, action) => {
      state.createCommentLoading = false
      state.error = action.payload.error
    },

    // update comment
    updateCommentRequested: state => {
      state.updateCommentLoading = true
    },

    updateCommentSucceeded: (state, action) => {
      const previousComment = find(state.dispatchStatus.alertEvent.timeline, {
        id: action.payload.comment.id,
      })
      state.dispatchStatus.alertEvent.timeline = map(
        state.dispatchStatus.alertEvent.timeline,
        item => {
          return item.id === action.payload.id
            ? { ...previousComment, comment: action.payload.comment }
            : item
        },
      )
      state.updateCommentLoading = false
    },

    updateCommentFailed: (state, action) => {
      state.updateCommentLoading = false
      state.error = action.payload.error
    },

    // delete comment
    deleteCommentRequested: state => {
      state.deleteCommentLoading = true
    },

    deleteCommentSucceeded: (state, action) => {
      state.dispatchStatus.alertEvent.timeline = reject(
        state.dispatchStatus.alertEvent.timeline,
        {
          id: action.payload.data.id,
          __typename: 'CommentType',
        },
      )
      state.deleteCommentLoading = false
    },

    deleteCommentFailed: (state, action) => {
      state.deleteCommentLoading = false
      state.error = action.payload.error
    },

    // resolve alert
    resolveAlertRequested: (state, action) => {
      state.resolveLoading = true
    },

    resolveAlertSucceeded: (state, action) => {
      state.resolveLoading = false
    },

    resolveAlertFailed: (state, action) => {
      state.resolveLoading = false
    },
  },
  // fetch dispatch status
})

export const {
  resetState,

  fetchDispatchStatusRequested,
  fetchDispatchStatusSucceeded,
  fetchDispatchStatusFailed,

  // dispatch external
  dispatchExternalRequested,
  dispatchExternalFailed,

  // dispatch internal
  dispatchInternalRequested,
  dispatchInternalSucceeded,
  dispatchInternalFailed,

  // create comment
  createCommentRequested,
  createCommentSucceeded,
  createCommentFailed,
  // update comment
  updateCommentRequested,
  updateCommentSucceeded,
  updateCommentFailed,

  // delete comment
  deleteCommentRequested,
  deleteCommentSucceeded,
  deleteCommentFailed,

  // resolve alert
  resolveAlertRequested,
  resolveAlertSucceeded,
  resolveAlertFailed,
} = alertModalSlice.actions

export default alertModalSlice.reducer

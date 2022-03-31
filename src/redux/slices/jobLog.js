/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jobs: [],
  lastUpdatedTs: null,
  error: null,
  loading: false,
  pages: 0,
  isSubmitting: false,
}

const slice = createSlice({
  name: 'jobLog',
  initialState,
  reducers: {
    jobLogsFetchRequested: state => {
      state.loading = true
    },
    jobLogsFetchSucceeded: (state, action) => {
      const { instances, pages, totalCount } = action.payload
      state.loading = false
      state.jobs = instances
      state.pages = pages
      state.totalCount = totalCount
      state.lastUpdatedTs = Math.round(Date.now().valueOf() / 1000)
    },
    jobLogsFetchFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.message
    },

    createDiscoveryRequested: state => {
      state.loading = true
      state.isSubmitting = true
    },
    createDiscoverySucceeded: state => {
      state.loading = false
      state.isSubmitting = false
    },
    createDiscoveryFailed: (state, action) => {
      state.loading = false
      state.isSubmitting = true
      state.error = action.payload.message
    },
  },
})

export const {
  jobLogsFetchRequested,
  jobLogsFetchSucceeded,
  jobLogsFetchFailed,

  createDiscoveryRequested,
  createDiscoverySucceeded,
  createDiscoveryFailed,
} = slice.actions

export default slice.reducer

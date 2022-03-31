/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import get from 'lodash/get'

export interface VersionSliceProps {
  version: {
    currentRevision: string
    revision: string
    branch: string
  }
}

const initialState = {
  revision: null,
  branch: null,
  currentRevision: null,
}

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    fetchProductInfoRequested: (state, action) => {},
    fetchProductInfoSucceeded: (state, action) => {
      if (action.payload.initialLoad)
        state.currentRevision = get(
          action.payload,
          'info.revision',
          initialState.revision,
        )

      state.revision = get(
        action.payload,
        'info.revision',
        initialState.revision,
      )
      state.branch = get(action.payload, 'info.branch', initialState.revision)
    },
    fetchProductInfoFailed: () => initialState,
    setVersion: (state, action) => {
      state.currentRevision = action.payload.revision
    },
  },
})

export const {
  fetchProductInfoRequested,
  fetchProductInfoSucceeded,
  fetchProductInfoFailed,
  setVersion,
} = slice.actions

export default slice.reducer

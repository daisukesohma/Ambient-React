/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  // videoWall states
  catalogue: [],
  catalogueLoading: false,
  error: null,
}

const slice = createSlice({
  name: 'vmsCalendar',
  initialState,

  reducers: {
    catalogueFetchRequested: (state, action) => {
      state.catalogueLoading = true
    },
    catalogueFetchSucceeded: (state, action) => {
      state.catalogue = action.payload.catalogue
      state.catalogueLoading = false
    },
    catalogueFetchFailed: (state, action) => {
      state.error = action.payload.error
      state.catalogueLoading = false
    },
  },
})

export const {
  catalogueFetchRequested,
  catalogueFetchSucceeded,
  catalogueFetchFailed,
} = slice.actions

export default slice.reducer

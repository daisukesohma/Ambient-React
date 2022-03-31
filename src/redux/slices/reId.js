/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'

const reId = createSlice({
  name: 'reId',
  initialState: {
    // make sure to have reset reducer reflect initialState
    history: [],
    isOpen: false,
    queryTs: null,
    selectedIndex: null,
    selectedModal: {}, // dispatch(showModal({ data: modalData }))
    snapshotData: [],
    snapshotLoading: false,
  },
  reducers: {
    // isOPEN START
    setIsOpen: (state, action) => {
      state.isOpen = action.payload
    },
    // iSOPEN END
    // REID SNAPSHOT START
    fetchReIdVectorsRequested: (state, action) => {
      state.snapshotLoading = true
    },
    fetchReIdVectorsSucceeded: (state, action) => {
      state.snapshotData = action.payload
      state.snapshotLoading = false
    },
    fetchReIdVectorsFailed: (state, action) => {
      state.error = action.payload.error
      state.snapshotLoading = false
    },
    // REID SNAPSHOT END
    // // RESET START
    reset: (state, action) => {
      state.isOpen = false
      state.snapshotLoading = false
      state.snapshotData = []
      state.selectedIndex = null
      state.queryTs = null
    },
    // RESET END
    // SELECTED INDEX START
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload
    },
    // SELECTED INDEX END
    // HISTORY START
    setHistoryItem: (state, action) => {
      state.history.push(action.payload)
    },
    // HISTORY END
    // Modal START
    setSelectedModal: (state, action) => {
      state.selectedModal = action.payload
    },
    // Modal END
    // Query START
    setQueryTs: (state, action) => {
      state.queryTs = action.payload
    },
  },
})

export const {
  fetchReIdVectorsFailed,
  fetchReIdVectorsRequested,
  fetchReIdVectorsSucceeded,
  reset,
  setHistoryItem,
  setIsOpen,
  setQueryTs,
  setSelectedIndex,
  setSelectedModal,
} = reId.actions

export default reId.reducer

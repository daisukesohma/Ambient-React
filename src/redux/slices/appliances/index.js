/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import extend from 'lodash/extend'

const initialState = {
  collection: [],
  loading: false,
  error: null,
  siteUpTime: null,
  nodeStatistics: null,

  metadata: null,
  loadingMetadata: false,

  nodeRequestData: null,
  loadingNodeRequestData: false,

  loadingNodeCreation: false,

  associateNodeModal: {
    isOpen: false,
    serialNumber: null,
  },
  associateNodeToAccountLoading: false,
}

const slice = createSlice({
  name: 'appliances',
  initialState,
  reducers: {
    fetchNodesByAccountRequested: (state, action) => {
      state.loading = true
    },
    fetchNodesByAccountSucceeded: (state, action) => {
      state.loading = false
      state.collection = action.payload.nodes
    },
    fetchNodesByAccountFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.message
    },

    fetchNodeStatisticsByAccountRequested: (state, action) => {
      state.loading = true
    },
    fetchNodeStatisticsByAccountSucceeded: (state, action) => {
      state.loading = false
      state.nodeStatistics = action.payload.nodeStatistics
    },
    fetchNodeStatisticsByAccountFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.message
    },
    // FETCH_NODE_PACKAGE_METADATA
    fetchNodePackageMetadataRequested: (state, action) => {
      state.loadingMetadata = true
    },
    fetchNodePackageMetadataSucceeded: (state, action) => {
      state.loadingMetadata = false
      state.metadata = action.payload.metadata
    },
    fetchNodePackageMetadataFailed: (state, action) => {
      state.loadingMetadata = false
      state.error = action.payload.message
    },
    // FETCH_NODE_REQUEST_STATUS_BY_ACCOUNT
    fetchNodeRequestStatusByAccountRequested: (state, action) => {
      state.loadingNodeRequestData = true
    },
    fetchNodeRequestStatusByAccountSucceeded: (state, action) => {
      state.nodeRequestData = action.payload.nodeRequestData
      state.loadingNodeRequestData = false
    },
    fetchNodeRequestStatusByAccountFailed: (state, action) => {
      state.loadingNodeRequestData = false
      state.error = action.payload.message
    },
    // Node create
    nodeCreateRequested: (state, action) => {
      state.loadingNodeCreation = true
    },
    nodeCreateSucceeded: (state, action) => {
      state.loadingNodeCreation = false
    },
    nodeCreateFailed: (state, action) => {
      state.loadingNodeCreation = false
      state.error = action.payload.message
    },
    nodeCreateV2Requested: (state, action) => {},
    nodeCreateV2Succeeded: (state, action) => {},
    nodeCreateV2Failed: (state, action) => {},
    // ASSOCIATE NODE TO ACCOUNT
    associateNodeToAccountRequested: (state, action) => {
      state.associateNodeToAccountLoading = true
    },
    associateNodeToAccountSucceeded: (state, action) => {
      state.associateNodeToAccountLoading = false
      state.associateNodeModal.isOpen = false
    },
    associateNodeToAccountFailed: (state, action) => {
      state.associateNodeToAccountLoading = false
      state.error = action.payload.message
    },
    setSerialNumber: (state, action) => {
      if (typeof action.payload.serialNumber !== 'undefined') {
        state.associateNodeModal.serialNumber = action.payload.serialNumber
        state.associateNodeModal.isOpen = true
      }
    },
    setAssociateModalValue: (state, action) => {
      extend(state.associateNodeModal, action.payload)
    },
  },
})

export const {
  fetchNodesByAccountRequested,
  fetchNodesByAccountSucceeded,
  fetchNodesByAccountFailed,
  // END - COLLECTION FETCH
  fetchNodeStatisticsByAccountRequested,
  fetchNodeStatisticsByAccountSucceeded,
  fetchNodeStatisticsByAccountFailed,
  // FETCH_NODE_PACKAGE_METADATA
  fetchNodePackageMetadataRequested,
  fetchNodePackageMetadataSucceeded,
  fetchNodePackageMetadataFailed,
  // FETCH_NODE_REQUEST_STATUS_BY_ACCOUNT
  fetchNodeRequestStatusByAccountRequested,
  fetchNodeRequestStatusByAccountSucceeded,
  fetchNodeRequestStatusByAccountFailed,
  // Node create
  nodeCreateRequested,
  nodeCreateSucceeded,
  nodeCreateFailed,
  nodeCreateV2Requested,
  nodeCreateV2Succeeded,
  nodeCreateV2Failed,
  associateNodeToAccountRequested,
  associateNodeToAccountSucceeded,
  associateNodeToAccountFailed,
  setSerialNumber,
  setAssociateModalValue,
} = slice.actions

export default slice.reducer

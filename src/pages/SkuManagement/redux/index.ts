/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import extend from 'lodash/extend'

interface SkuProps {
  id: string
  hardwarePartner: {
    id: string
    name: string
    contactInfo: string
  }
  identifier: string
  hardwareInfo: string
  memory: number
  ssdStorage: number
  hddStorage: number
  cpuBaseClock: number
  cpuThreadCount: number
  gpu: {
    id: string
    name: string
  }
  numGpu: number
  available: boolean
  price: number
  capabilities: {
    id: string
    siteType: {
      id: string
      name: string
    }
    numStreams: number
    numViewers: number
    fullDaysRetention: number
    motionDaysRetention: number
  }
}

export interface SkuReducerProps {
  skuManagement: {
    collection: SkuProps[]
    loading: boolean
    error: string
    createNodeProvisionLoading: boolean
    createNodeProvisionSucceeded: boolean
    createNodeProvisionError: string
    createdNodeProvisionId: string
    provisionNewModal: {
      isOpen: boolean
      id: string
      tabIndex: number
    }
  }
}

const initialState = {
  collection: [],
  loading: false,
  error: null,
  createNodeProvisionLoading: false,
  createNodeProvisionSucceeded: false,
  createNodeProvisionError: null,
  createdNodeProvisionId: null,
  provisionNewModal: {
    isOpen: false,
    id: null,
    tabIndex: 0,
  },
}

const slice = createSlice({
  name: 'skuManagement',
  initialState,
  reducers: {
    createNodeProvisionRequested: (state, action) => {
      state.createNodeProvisionLoading = true
    },
    createNodeProvisionSucceeded: (state, action) => {
      state.createNodeProvisionLoading = false
      state.createNodeProvisionSucceeded = true
      state.createdNodeProvisionId = action.payload.id
    },
    createNodeProvisionFailed: (state, action) => {
      state.createNodeProvisionLoading = false
      state.createNodeProvisionSucceeded = false
      state.createNodeProvisionError = action.payload.message
    },
    resetNodeProvisionData: (state, action) => {
      state.createNodeProvisionSucceeded = false
      state.createdNodeProvisionId = null
    },
    fetchSkusRequested: (state, action) => {
      state.loading = true
    },
    fetchSkusSucceeded: (state, action) => {
      state.loading = false
      state.collection = action.payload
    },
    fetchSkusFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.message
    },
    setProvisionNewModalValue: (state, action) => {
      extend(state.provisionNewModal, action.payload)
    },
  },
})

export const {
  createNodeProvisionRequested,
  createNodeProvisionSucceeded,
  createNodeProvisionFailed,
  fetchSkusRequested,
  fetchSkusSucceeded,
  fetchSkusFailed,
  resetNodeProvisionData,
  setProvisionNewModalValue,
} = slice.actions

export default slice.reducer

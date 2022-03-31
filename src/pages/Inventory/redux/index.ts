/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */
import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import extend from 'lodash/extend'
import get from 'lodash/get'

interface NodeProvisionProps {
  id: string
  node: {
    identifier: string
    name: string
    token: string
    staticIp: string
    subnet: string
    gateway: string
    hardwareSerialNumber: string
    hardwareSku: {
      id: string
      hardwarePartner: {
        id: string
        name: string
        contactInfo: string
      }
      identifier: string
    }
    retentionMotionDays: number
    retentionNonmotionDays: number
  }
  status: number
  purchaseOrder: string
  shippingInfo: string
  comment: string
  shippingTrackingLink: string
  provisioningKey: string
  transitions: string[]
  welcomeUser: {
    id: string
    email: string
  }
}

interface StatusProps {
  id: string
  status: string
}

export interface InventoryReducerProps {
  inventory: {
    collection: NodeProvisionProps[]
    loading: boolean
    error: string
    lastUpdatedAt: string
    selectedNodeId: string
    collectionPages: number
    collectionCurrentPage: number
    collectionCount: number
    collectionLimit: number
    collectionQuery: string
    editModal: {
      isOpen: boolean
      id: string
      tabIndex: number
      isFormikDirty: boolean
      isConfirmOpen: boolean
      isConfirmTabChangeOpen: boolean
      nextTabIndex: number
      isNodeProvisionSetupLoading: boolean
      isNodeProvisionSetupVerified: boolean
      nodeProvisionSetupReason: string
      areFieldsDisabled: boolean
    }
    provisionStatuses: StatusProps[]
    selectedProvisionStatus: { id: string }
    ambientOsModal: {
      isOpen: boolean
      url: string
      expires: number
    }
  }
}

const initialState = {
  collection: [],
  loading: false,
  error: null,
  lastUpdatedAt: null,
  selectedNodeId: null,
  collectionPages: 0,
  collectionCurrentPage: 1,
  collectionCount: 0,
  collectionLimit: 10,
  collectionQuery: null,
  editModal: {
    isOpen: false,
    id: null,
    tabIndex: 0,
    // Since we have three formik objects and state, need to sync changes for being able to
    // know when formik is dirty across these formik objects and the tab handler
    isFormikDirty: false,
    isConfirmOpen: false,
    // separate confirm modal for tab change, so the close button can be different
    isConfirmTabChangeOpen: false,
    nextTabIndex: 0,
    // verifying status
    isNodeProvisionSetupLoading: false,
    isNodeProvisionSetupVerified: false,
    nodeProvisionSetupReason: '',
    areFieldsDisabled: false, // disable fields if in one of the statuses
  },
  provisionStatuses: [],
  selectedProvisionStatus: {
    id: null,
  },
  // download ambient os modal
  ambientOsModal: {
    isOpen: false,
    url: null,
    expires: null,
  },
}

const slice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    fetchInventoryRequested: (state, action) => {
      state.loading = true
    },
    fetchInventorySucceeded: (state, action) => {
      state.loading = false
      state.lastUpdatedAt = moment().unix()
      const { nodeProvisions, totalCount, pages, currentPage } = action.payload
      state.collection = nodeProvisions
      state.collectionCurrentPage = currentPage
      state.collectionPages = pages
      state.collectionCount = totalCount
    },
    fetchInventoryFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.message
    },

    fetchProvisionStatusesRequested: (state, action) => {
      state.loading = true
    },
    fetchProvisionStatusesSucceeded: (state, action) => {
      state.loading = false
      // CHECK this logic, not sure it ever gets triggered...
      if (Object.keys(state.selectedProvisionStatus).length === 0) {
        state.selectedProvisionStatus = action.payload[0]
      }
      state.provisionStatuses = action.payload
    },
    fetchProvisionStatusesFailed: (state, action) => {
      state.loading = false
      state.error = action.payload.message
    },

    selectNodeId: (state, action) => {
      state.selectedNodeId = action.payload
    },
    collectionSetLimit: (state, action) => {
      state.collectionLimit = action.payload.limit
    },
    collectionSetPage: (state, action) => {
      state.collectionCurrentPage = action.payload.page
    },
    collectionSetSearchQuery: (state, action) => {
      state.collectionQuery = action.payload.query
    },
    setEditModalValue: (state, action) => {
      extend(state.editModal, action.payload)
    },
    setProvisionStatus: (state, action) => {
      state.selectedProvisionStatus = action.payload.status
    },
    updateNodeProvisionRequested: () => {},
    updateNodeProvisionSucceeded: () => {},
    updateNodeProvisionFailed: () => {},
    updateNodeAdminRequested: () => {},
    updateNodeAdminSucceeded: () => {},
    updateNodeAdminFailed: () => {},
    fetchAmbientOsRequested: () => {},
    fetchAmbientOsSucceeded: (state, action) => {
      extend(state.ambientOsModal, action.payload)
    },
    setAmbientOsModalValue: (state, action) => {
      extend(state.ambientOsModal, action.payload)
    },
    fetchAmbientOsFailed: (state, action) => {},
    verifyNodeProvisionSetupRequested: (state, action) => {
      state.isNodeProvisionSetupLoading = true
    },
    verifyNodeProvisionSetupSucceeded: (state, action) => {
      state.isNodeProvisionSetupLoading = false
      state.editModal.isNodeProvisionSetupVerified = get(
        action.payload,
        'verified',
      )
      state.editModal.nodeProvisionSetupReason = get(action.payload, 'reason')
    },
    verifyNodeProvisionSetupFailed: (state, action) => {
      state.isNodeProvisionSetupLoading = false
    },
  },
})

export const {
  fetchAmbientOsRequested,
  fetchAmbientOsSucceeded,
  fetchAmbientOsFailed,
  fetchInventoryRequested,
  fetchInventorySucceeded,
  fetchInventoryFailed,
  fetchProvisionStatusesRequested,
  fetchProvisionStatusesSucceeded,
  fetchProvisionStatusesFailed,
  selectNodeId,
  collectionSetLimit,
  collectionSetSearchQuery,
  collectionSetPage,
  setEditModalValue,
  setAmbientOsModalValue,
  setProvisionStatus,
  updateNodeProvisionRequested,
  updateNodeProvisionSucceeded,
  updateNodeProvisionFailed,
  updateNodeAdminRequested,
  updateNodeAdminSucceeded,
  updateNodeAdminFailed,
  verifyNodeProvisionSetupRequested,
  verifyNodeProvisionSetupSucceeded,
  verifyNodeProvisionSetupFailed,
} = slice.actions

export default slice.reducer

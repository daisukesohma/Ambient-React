/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import findIndex from 'lodash/findIndex'
import getUnixTime from 'date-fns/getUnixTime'
import subDays from 'date-fns/subDays'

export interface AlertTypes {
  name: string
  id: number
  status: string
  verificationType: string
  severity: string
  performanceMetrics: {
    dismissedRatio: number
    numPositive: number
    numNegative: number
  }
  threatSignature: {
    id: number
    name: string
  }
  site: {
    name: string
    slug: string
    account: {
      name: string
      slug: string
    }
  }
  defaultAlert: {
    threatSignature: {
      id: number
      name: string
    }
    regions: {
      id: number
      name: string
    }[]
  }
  socRecall: {
    id: number
    tsEnd: number
  }
  canRecall: boolean
}

export interface AlertInternalSliceProps {
  alertsInternal: {
    allThreatSignatures: {
      value: number
      label: string
    }[]
    alerts: AlertTypes[]
    loading: boolean
    page: number
    pages: number
    limit: number
    totalCount: number
    threatSignatureFilters: {
      label: string
      value: number
    }[]
    statusFilters: {
      label: string
      value: string
    }[]
    verificationTypeFilter: string | null
    verificationTypeLoading: boolean
    verificationTypes: {
      label: string
      value: string
    }[]
    recallLoading: boolean
    recallModalOpened: boolean
    alertToRecall: number
    tsStart: number
    tsEnd: number
  }
}

const alertsInternalSlice = createSlice({
  name: 'alertsInternal',
  initialState: {
    alerts: [] as AlertTypes[],
    loading: false,
    page: 0,
    pages: 0,
    limit: 10,
    totalCount: 0,
    threatSignatureFilters: [],
    statusFilters: [],
    verificationTypeFilter: null,
    verificationTypes: [],
    verificationTypeLoading: false,
    allThreatSignatures: [],
    recallLoading: false,
    recallModalOpened: false,
    alertToRecall: null,
    tsStart: getUnixTime(subDays(new Date(), 7)),
    tsEnd: getUnixTime(new Date()),
  },
  reducers: {
    fetchAllAlertsPaginatedRequested: (state, action) => {
      state.loading = true
    },
    fetchAllAlertsPaginatedSucceeded: (state, action) => {
      state.loading = false
      state.alerts = action.payload.instances
      state.pages = action.payload.pages
      state.totalCount = action.payload.totalCount
      state.page = action.payload.currentPage - 1
    },
    fetchAllAlertsPaginatedFailed: (state, action) => {
      state.loading = false
    },
    fetchVerificationTypesRequested: state => {
      state.verificationTypeLoading = true
    },
    fetchVerificationTypesSucceeded: (state, action) => {
      state.verificationTypeLoading = false
      state.verificationTypes = action.payload.verificationTypes
    },
    fetchVerificationTypesFailed: (state, action) => {
      state.verificationTypeLoading = false
    },

    fetchThreatSignaturesRequested: state => {
      state.loading = true
    },
    fetchThreatSignaturesSucceeded: (state, action) => {
      state.allThreatSignatures = action.payload.allThreatSignatures
      state.loading = false
    },
    fetchThreatSignaturesFailed: (state, action) => {
      state.loading = false
    },

    setPage: (state, action) => {
      state.page = action.payload.page
    },
    setLimit: (state, action) => {
      state.limit = action.payload.limit
    },
    setThreatSignatureFilters: (state, action) => {
      state.threatSignatureFilters = action.payload.threatSignatures
    },
    setStatusFilter: (state, action) => {
      state.statusFilters = action.payload.status
    },
    setVerificationTypeFilter: (state, action) => {
      state.verificationTypeFilter = action.payload.verificationType
    },

    recallAlertToSOCRequested: (state, action) => {
      state.recallLoading = true
    },
    recallAlertToSOCSucceeded: (
      state,
      action: {
        payload: {
          alert: AlertTypes
        }
      },
    ) => {
      state.recallLoading = false
      const index = findIndex(state.alerts, ['id', action.payload.alert.id])
      if (index > -1) {
        state.alerts.splice(index, 1)
        state.alerts.push(action.payload.alert)
      }
    },
    recallAlertToSOCFailed: (state, action) => {
      state.recallLoading = false
    },

    setRecallModalOpen: (state, action) => {
      state.recallModalOpened = true
      state.alertToRecall = action.payload.alertId
    },
    setRecallModalClose: state => {
      state.recallModalOpened = false
      state.alertToRecall = null
    },

    setDates: (state, action) => {
      state.tsStart = action.payload.tsStart
      state.tsEnd = action.payload.tsEnd
    },
  },
})

export const {
  fetchAllAlertsPaginatedRequested,
  fetchAllAlertsPaginatedSucceeded,
  fetchAllAlertsPaginatedFailed,
  fetchVerificationTypesRequested,
  fetchVerificationTypesSucceeded,
  fetchVerificationTypesFailed,
  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,
  setPage,
  setLimit,

  setThreatSignatureFilters,
  setStatusFilter,
  setVerificationTypeFilter,

  recallAlertToSOCRequested,
  recallAlertToSOCSucceeded,
  recallAlertToSOCFailed,

  setRecallModalOpen,
  setRecallModalClose,

  setDates,
} = alertsInternalSlice.actions

export default alertsInternalSlice.reducer

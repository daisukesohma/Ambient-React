/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const internalSlice = createSlice({
  name: 'internal',
  initialState: {
    supportRequests: [],
    supportRequestPages: 1,
    supportRequestTotalCount: 0,
    supportRequestCurrentPage: 1,
    supportRequestLimit: 10,
    supportRequestSort: 1,

    modalOpened: false,

    accounts: [],

    loadingSupportRequests: false,
    requestLoading: false,
    error: null,
    refresh: false,
    accountFilter: null,
  },

  reducers: {
    setCurrentPage: (state, action) => {
      state.supportRequestCurrentPage = action.payload.page
    },
    setNewLimit: (state, action) => {
      state.supportRequestLimit = action.payload.limit
    },
    setSort: (state, action) => {
      state.supportRequestSort = action.payload.sort
    },
    fetchUserSupportRequestsRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    fetchUserSupportRequestsSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.supportRequests =
        action.payload.data.supportAccessRequestsByMePaginated.instances
      state.supportRequestPages =
        action.payload.data.supportAccessRequestsByMePaginated.pages
      state.supportRequestTotalCount =
        action.payload.data.supportAccessRequestsByMePaginated.totalCount
      state.supportRequestCurrentPage =
        action.payload.data.supportAccessRequestsByMePaginated.currentPage
      state.refresh = false
    },
    fetchUserSupportRequestsFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },

    fetchAdminSupportRequestsRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    fetchAdminSupportRequestsSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.supportRequests =
        action.payload.data.supportAccessRequestsForAdminPaginated.instances
      state.supportRequestPages =
        action.payload.data.supportAccessRequestsForAdminPaginated.pages
      state.supportRequestTotalCount =
        action.payload.data.supportAccessRequestsForAdminPaginated.totalCount
      state.supportRequestCurrentPage =
        action.payload.data.supportAccessRequestsForAdminPaginated.currentPage
      state.refresh = false
    },
    fetchAdminSupportRequestsFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },

    fetchAccountSupportRequestsRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    fetchAccountSupportRequestsSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.supportRequests =
        action.payload.data.supportAccessRequestsForAccountPaginated.instances
      state.supportRequestPages =
        action.payload.data.supportAccessRequestsForAccountPaginated.pages
      state.supportRequestTotalCount =
        action.payload.data.supportAccessRequestsForAccountPaginated.totalCount
      // current page is - 1 due to zero indexing on backend, returning + 1 on frontend
      state.supportRequestCurrentPage =
        action.payload.data.supportAccessRequestsForAccountPaginated
          .currentPage - 1
      state.refresh = false
    },
    fetchAccountSupportRequestsFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },

    requestSupportAccessRequested: (state, action) => {
      state.requestLoading = true
    },
    requestSupportAccessSucceeded: (state, action) => {
      state.requestLoading = false
      state.modalOpened = false
      state.refresh = true
    },
    requestSupportAccessFailed: (state, action) => {
      state.requestLoading = false
      state.error = action.payload.error
    },

    grantSupportAccessRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    grantSupportAccessSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.refresh = true
    },
    grantSupportAccessFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },

    denySupportAccessRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    denySupportAccessSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.refresh = true
    },
    denySupportAccessFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },

    withdrawSupportAccessRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    withdrawSupportAccessSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.refresh = true
    },
    withdrawSupportAccessFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },

    releaseSupportAccessRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    releaseSupportAccessSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.refresh = true
    },
    releaseSupportAccessFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },

    revokeSupportAccessRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    revokeSupportAccessSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.refresh = true
    },
    revokeSupportAccessFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },

    fetchAccountsRequested: (state, action) => {
      state.loadingSupportRequests = true
    },
    fetchAccountsSucceeded: (state, action) => {
      state.loadingSupportRequests = false
      state.accounts = action.payload.data.accountsForSupportAccess
    },
    fetchAccountsFailed: (state, action) => {
      state.loadingSupportRequests = false
      state.error = action.payload.error
    },
    resetSupportRequestDetails: state => {
      state.supportRequests = []
      state.supportRequestPages = 1
      state.supportRequestTotalCount = 0
      state.supportRequestCurrentPage = 1
      state.supportRequestLimit = 10
      state.supportRequestSort = 1
    },

    openModal: state => {
      state.modalOpened = true
    },
    closeModal: state => {
      state.modalOpened = false
    },

    setAccountFilter: (state, action) => {
      state.accountFilter = action.payload.accountFilter
    },
  },
})

export const {
  setCurrentPage,
  setNewLimit,
  setSort,

  fetchUserSupportRequestsRequested,
  fetchUserSupportRequestsSucceeded,
  fetchUserSupportRequestsFailed,

  fetchAdminSupportRequestsRequested,
  fetchAdminSupportRequestsSucceeded,
  fetchAdminSupportRequestsFailed,

  fetchAccountSupportRequestsRequested,
  fetchAccountSupportRequestsSucceeded,
  fetchAccountSupportRequestsFailed,

  requestSupportAccessRequested,
  requestSupportAccessSucceeded,
  requestSupportAccessFailed,

  grantSupportAccessRequested,
  grantSupportAccessSucceeded,
  grantSupportAccessFailed,

  denySupportAccessRequested,
  denySupportAccessSucceeded,
  denySupportAccessFailed,

  withdrawSupportAccessRequested,
  withdrawSupportAccessSucceeded,
  withdrawSupportAccessFailed,

  releaseSupportAccessRequested,
  releaseSupportAccessSucceeded,
  releaseSupportAccessFailed,

  revokeSupportAccessRequested,
  revokeSupportAccessSucceeded,
  revokeSupportAccessFailed,

  fetchAccountsRequested,
  fetchAccountsSucceeded,
  fetchAccountsFailed,

  resetSupportRequestDetails,

  openModal,
  closeModal,
  setAccountFilter,
} = internalSlice.actions

export default internalSlice.reducer

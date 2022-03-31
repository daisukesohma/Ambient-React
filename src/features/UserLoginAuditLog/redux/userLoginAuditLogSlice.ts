/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const userLoginAuditLogSlice = createSlice({
  name: 'userLoginAuditLog',
  initialState: {
    user: null,
    userLoginActivity: [],
    userLoginActivityPages: 1,
    userLoginActivityTotalCount: 0,
    userLoginActivityCurrentPage: 1,
    userLoginActivityLimit: 10,
    userLoginActivitySort: 1,

    isLoginHistoryOpen: false,

    loadingLoginActivity: false,
    error: null,
  },

  reducers: {
    openUserLoginAuditLog: (state, action) => {
      state.isLoginHistoryOpen = true
      state.user = action.payload.user
    },
    setCurrentPage: (state, action) => {
      state.userLoginActivityCurrentPage = action.payload.page
    },
    setNewLimit: (state, action) => {
      state.userLoginActivityLimit = action.payload.limit
    },
    setSort: (state, action) => {
      state.userLoginActivitySort = action.payload.sort
    },
    fetchUserLoginActivityRequested: (state, action) => {
      state.loadingLoginActivity = true
    },
    fetchUserLoginActivitySucceeded: (state, action) => {
      state.loadingLoginActivity = false
      state.userLoginActivity = action.payload.data.instances
      state.userLoginActivityPages = action.payload.data.pages
      state.userLoginActivityTotalCount = action.payload.data.totalCount
      state.userLoginActivityCurrentPage = action.payload.data.currentPage
    },
    fetchUserLoginActivityFailed: (state, action) => {
      state.loadingLoginActivity = false
      state.error = action.payload.error
    },
    resetUserLoginActivityDetails: state => {
      state.isLoginHistoryOpen = false
      state.user = null
      state.userLoginActivity = []
      state.userLoginActivityPages = 1
      state.userLoginActivityTotalCount = 0
      state.userLoginActivityCurrentPage = 1
      state.userLoginActivityLimit = 10
      state.userLoginActivitySort = 1
    },
  },
})

export const {
  openUserLoginAuditLog,
  setCurrentPage,
  setNewLimit,
  setSort,

  fetchUserLoginActivityRequested,
  fetchUserLoginActivitySucceeded,
  fetchUserLoginActivityFailed,
  resetUserLoginActivityDetails,
} = userLoginAuditLogSlice.actions

export default userLoginAuditLogSlice.reducer

/* eslint-disable no-param-reassign */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import findIndex from 'lodash/findIndex'

export interface AuthSliceProps {
  auth: {
    profile: {
      id: string | null
      phoneNumber: string | number
      countryCode: string
      isoCode: string
      mfaOptIn: boolean
      img: string
      hmNotificationsOptIn: boolean
      lastWorkShiftPeriod: number
      isSignedIn: boolean
      role: {
        role: string
        permissionList: []
      }
      internal: boolean
    }
    user: {
      firstName: string | null
      lastName: string | null
      email: string | null
      groups: []
    }
    loggedIn: boolean
    accounts: []
    sites: []
    token: string
  }
}

export const initialState = {
  profile: {
    id: null,
    phoneNumber: null,
    countryCode: null,
    isoCode: null,
    mfaOptIn: null,
    img: null,
    hmNotificationsOptIn: null,
    lastWorkShiftPeriod: null,
    isSignedIn: null,
    role: {
      role: null,
      permissionList: [],
    },
    internal: false,
  },
  payload: null,
  user: {
    firstName: null,
    lastName: null,
    email: null,
    groups: [],
  },
  accounts: [],
  sites: [],
  sitesLoading: false,
  nodes: [],
  loggedIn: false,
  loggingIn: false,
  verifyTokenLoading: true, // load by default
  error: null,
  // will need to remove if after first release
  apiToken: null,
  token: null,

  loggingOut: false,
  loggedOut: false,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested: (state, action) => {
      state.loggingIn = true
    },
    loginSucceeded: (state, action) => {
      state.loggedIn = true
      state.loggingIn = false
      state.accounts = action.payload.accounts
      state.payload = action.payload.payload
      state.profile = action.payload.profile
      state.user = action.payload.user
      state.sites = action.payload.sites
      state.nodes = action.payload.nodes
      // will need to remove if after first release
      state.apiToken = action.payload.apiToken
      state.token = action.payload.token
    },
    loginFailed: (state, action) => initialState,
    logoutRequested: (state, action) => initialState,
    logoutInitiateRequested: (state, action) => {
      state.loggingOut = true
    },
    logoutInitiateSucceeded: (state, action) => {
      state.loggingOut = false
      state.loggedOut = true
    },
    logoutInitiateFailed: (state, action) => {
      state.loggingOut = false
    },

    updateProfile: (state, action) => {
      state.user.firstName = action.payload.firstName
      state.user.lastName = action.payload.lastName
      state.user.email = action.payload.email
      state.profile.phoneNumber = action.payload.phoneNumber
      state.profile.countryCode = action.payload.countryCode
      state.profile.isoCode = action.payload.isoCode
      state.profile.mfaOptIn = action.payload.mfaOptIn
      state.profile.img = action.payload.img
      state.profile.hmNotificationsOptIn = action.payload.hmNotificationsOptIn
    },

    updateLastWorkShift: (state, action) => {
      state.profile.lastWorkShiftPeriod =
        action.payload.data.createOrEndWorkShift.workShiftPeriod
      state.profile.isSignedIn = action.payload.signIn
    },

    addSite: (state, action) => {
      // Find the Account
      // Add site to it
      // Looks overly verbose but required to ensure the array is a new one to enable component rerendering
      const { id, name, slug, accountSlug } = action.payload
      const updatedAccounts = [...state.accounts]

      const idx = findIndex(updatedAccounts, { slug: accountSlug })

      const updatedSites = [...updatedAccounts[idx].sites]
      updatedSites.push({ id, name, slug })

      updatedAccounts[idx].sites = updatedSites
      state.accounts = updatedAccounts
    },

    updateFederations: (state, action) => {
      state.profile = action.payload
    },

    verifyTokenRequested: (state, action) => {
      state.verifyTokenLoading = true
    },
    verifyTokenSucceeded: (state, action) => {
      state.loggedIn = true
      state.accounts = action.payload.accounts
      state.payload = action.payload.payload
      state.profile = action.payload.profile
      state.user = action.payload.user
      state.sites = action.payload.sites
      state.nodes = action.payload.nodes
      state.verifyTokenLoading = false
    },
    verifyTokenFailed: (state, action) => {
      state.error = action.payload.message
      state.verifyTokenLoading = false
    },

    verifyAccountsRequested: (state, action) => {},
    verifyAccountsSucceeded: (state, action) => {
      state.accounts = action.payload.accounts
    },
    verifyAccountsFailed: (state, action) => {},

    verifySitesRequested: (state, action) => {
      state.sitesLoading = true
    },
    verifySitesSucceeded: (state, action) => {
      state.sitesLoading = false
      state.sites = action.payload.sites
    },
    verifySitesFailed: (state, action) => {
      state.sitesLoading = false
    },
  },
})

export const {
  loginRequested,
  loginSucceeded,
  loginFailed,

  logoutRequested,
  logoutInitiateRequested,
  logoutInitiateSucceeded,
  logoutInitiateFailed,
  updateProfile,
  updateLastWorkShift,
  addSite,
  updateFederations,
  verifyTokenRequested,
  verifyTokenSucceeded,
  verifyTokenFailed,

  verifyAccountsRequested,
  verifyAccountsSucceeded,
  verifyAccountsFailed,

  verifySitesRequested,
  verifySitesSucceeded,
  verifySitesFailed,
} = slice.actions

export default slice.reducer

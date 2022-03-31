/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice } from '@reduxjs/toolkit'
import { SiteOption } from 'ambient_ui/components/menus/SearchableSelectDropdown/types'
import findIndex from 'lodash/findIndex'
import set from 'lodash/set'
import unset from 'lodash/unset'

import { SecurityProfileType } from '../types'

interface IObjectKeys {
  [key: string]: any
}

interface DefaultAlertType extends IObjectKeys {
  id: number
  name: string
}

export interface ContextGraphAuditViewSliceProps {
  contextGraphAuditView: {
    securityProfiles: SecurityProfileType
    securityProfilesLoading: boolean
    defaultAlerts: DefaultAlertType[]

    verificationTypes: SiteOption[]
    verificationTypeLoading: boolean

    updateLoading: boolean

    severities: SiteOption[]
    severitiesLoading: boolean

    createLoading: boolean
    deleteLoading: boolean

    confirmOpen: boolean
    confirmDialogText: string | null
    updateType: string | null
    status: string | null
    verification: string | null
    severity: string | null
    defaultAlertId: number | null
    alertId: number | null
    securityProfileId: number | null
  }
}

const contextGraphAuditView = createSlice({
  name: 'contextGraphAuditView',
  initialState: {
    securityProfiles: [],
    securityProfilesLoading: false,
    defaultAlerts: [],

    verificationTypes: [],
    verificationTypeLoading: false,

    updateLoading: false,

    severities: [],
    severitiesLoading: false,

    createLoading: false,
    deleteLoading: false,

    confirmOpen: false,
    confirmDialogText: null,
    updateType: null,
    status: null,
    verification: null,
    severity: null,
    defaultAlertId: null,
    alertId: null,
    securityProfileId: null,
  },

  reducers: {
    fetchSecurityProfilesRequested: (state, action) => {
      state.securityProfilesLoading = true
    },
    fetchSecurityProfilesSucceeded: (state, action) => {
      state.securityProfilesLoading = false
      state.securityProfiles = action.payload.securityProfiles
      state.defaultAlerts = action.payload.defaultAlerts
    },
    fetchSecurityProfilesFailed: (state, action) => {
      state.securityProfilesLoading = false
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

    fetchSeveritiesRequested: state => {
      state.severitiesLoading = true
    },
    fetchSeveritiesSucceeded: (state, action) => {
      state.severitiesLoading = false
      state.severities = action.payload.severities
    },
    fetchSeveritiesFailed: (state, action) => {
      state.severitiesLoading = false
    },

    updateVerificationTypeOnAlertRequested: (state, action) => {
      state.updateLoading = true
    },
    updateVerificationTypeOnAlertSucceeded: (state, action) => {
      state.updateLoading = false
      const index = findIndex(state.defaultAlerts, [
        'id',
        action.payload.defaultAlertId,
      ])
      if (index > -1) {
        const { securityProfileId } = action.payload
        set(
          state.defaultAlerts[index],
          `${securityProfileId}`,
          action.payload.alert,
        )
      }
    },
    updateVerificationTypeOnAlertFailed: (state, action) => {
      state.updateLoading = false
    },

    updateSevOnAlertRequested: (state, action) => {
      state.updateLoading = true
    },
    updateSevOnAlertSucceeded: (state, action) => {
      state.updateLoading = false
      const index = findIndex(state.defaultAlerts, [
        'id',
        action.payload.defaultAlertId,
      ])
      if (index > -1) {
        const { securityProfileId } = action.payload
        set(
          state.defaultAlerts[index],
          `${securityProfileId}`,
          action.payload.alert,
        )
      }
    },
    updateSevOnAlertFailed: (state, action) => {
      state.updateLoading = false
    },

    disableAlertRequested: (state, action) => {
      state.updateLoading = true
    },
    disableAlertSucceeded: (state, action) => {
      state.updateLoading = false
      const index = findIndex(state.defaultAlerts, [
        'id',
        action.payload.defaultAlertId,
      ])
      if (index > -1) {
        const { securityProfileId } = action.payload
        set(
          state.defaultAlerts[index],
          `${securityProfileId}`,
          action.payload.alert,
        )
      }
    },
    disableAlertFailed: (state, action) => {
      state.updateLoading = false
    },

    enableAlertRequested: (state, action) => {
      state.updateLoading = true
    },
    enableAlertSucceeded: (state, action) => {
      state.updateLoading = false
      const index = findIndex(state.defaultAlerts, [
        'id',
        action.payload.defaultAlertId,
      ])
      if (index > -1) {
        const { securityProfileId } = action.payload
        set(
          state.defaultAlerts[index],
          `${securityProfileId}`,
          action.payload.alert,
        )
      }
    },
    enableAlertFailed: (state, action) => {
      state.updateLoading = false
    },

    createAlertRequested: (state, action) => {
      state.updateLoading = true
    },
    createAlertSucceeded: (state, action) => {
      state.updateLoading = false
      const index = findIndex(state.defaultAlerts, [
        'id',
        action.payload.defaultAlertId,
      ])
      if (index > -1) {
        const { securityProfileId } = action.payload
        set(
          state.defaultAlerts[index],
          `${securityProfileId}`,
          action.payload.alert,
        )
      }
    },
    createAlertFailed: (state, action) => {
      state.updateLoading = false
    },

    deleteAlertRequested: (state, action) => {
      state.updateLoading = true
    },
    deleteAlertSucceeded: (state, action) => {
      state.updateLoading = false
      const index = findIndex(state.defaultAlerts, [
        'id',
        action.payload.defaultAlertId,
      ])
      if (index > -1) {
        const { securityProfileId } = action.payload
        unset(state.defaultAlerts[index], `${securityProfileId}`)
      }
    },
    deleteAlertFailed: (state, action) => {
      state.updateLoading = false
    },

    resetStates: state => {
      state.confirmOpen = false
      state.confirmDialogText = null
      state.updateType = null
      state.status = null
      state.verification = null
      state.severity = null
      state.defaultAlertId = null
      state.alertId = null
      state.securityProfileId = null
    },

    openConfirmDialog: state => {
      state.confirmOpen = true
    },
    setConfirmDialogText: (state, action) => {
      state.confirmDialogText = action.payload.confirmDialogText
    },
    setStatus: (state, action) => {
      state.status = action.payload.status
    },
    setUpdateType: (state, action) => {
      state.updateType = action.payload.updateType
    },
    setVerification: (state, action) => {
      state.verification = action.payload.verification
    },
    setSeverity: (state, action) => {
      state.severity = action.payload.severity
    },
    setDefaultAlertId: (state, action) => {
      state.defaultAlertId = action.payload.defaultAlertId
    },
    setAlertId: (state, action) => {
      state.alertId = action.payload.alertId
    },
    setSecurityProfileId: (state, action) => {
      state.securityProfileId = action.payload.securityProfileId
    },

    resetTable: state => {
      state.defaultAlerts = []
      state.securityProfiles = []
    },
  },
})

export const {
  fetchSecurityProfilesRequested,
  fetchSecurityProfilesSucceeded,
  fetchSecurityProfilesFailed,

  fetchVerificationTypesRequested,
  fetchVerificationTypesSucceeded,
  fetchVerificationTypesFailed,

  fetchSeveritiesRequested,
  fetchSeveritiesSucceeded,
  fetchSeveritiesFailed,

  updateVerificationTypeOnAlertRequested,
  updateVerificationTypeOnAlertSucceeded,
  updateVerificationTypeOnAlertFailed,

  updateSevOnAlertRequested,
  updateSevOnAlertSucceeded,
  updateSevOnAlertFailed,

  disableAlertRequested,
  disableAlertSucceeded,
  disableAlertFailed,

  enableAlertRequested,
  enableAlertSucceeded,
  enableAlertFailed,

  createAlertRequested,
  createAlertSucceeded,
  createAlertFailed,

  deleteAlertRequested,
  deleteAlertSucceeded,
  deleteAlertFailed,

  resetStates,
  openConfirmDialog,
  setConfirmDialogText,
  setVerification,
  setStatus,
  setUpdateType,
  setSeverity,
  setDefaultAlertId,
  setAlertId,
  setSecurityProfileId,
  resetTable,
} = contextGraphAuditView.actions

export default contextGraphAuditView.reducer

/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import tsAtMidnight from 'utils/dateTime/tsAtMidnight'
import accessAlarmDashboardMocker from './accessAlarmDashboardMocker'
import config from 'config'

const isDemo = config.settings.demo
const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

const initStartTs = tsAtMidnight(0, LOCAL_TIMEZONE)
const initEndTs = tsAtMidnight(1, LOCAL_TIMEZONE)

const MOCK_DATA = accessAlarmDashboardMocker(initStartTs, initEndTs)

const initialState = {
  loadingDistribution: false,
  accessAlarmDistributions: [],

  loadingTypeDistribution: false,
  accessAlarmTypeDistributions: isDemo
    ? MOCK_DATA.accessAlarmTypeDistributions
    : [],

  loadingReaderList: false,
  accessReaderList: isDemo ? MOCK_DATA.accessReaderList : {},

  loadingDoorPACSDistribution: false,
  doorPacsAlertEventDistribution: isDemo
    ? MOCK_DATA.doorPacsAlertEventDistribution
    : [],

  loadingInvalidBadgePACSDistribution: false,
  invalidBadgePacsAlertEventDistribution: isDemo
    ? MOCK_DATA.invalidBadgePacsAlertEventDistribution
    : [],

  loadingAccessNodesForAccount: false,
  accessNodesForAccount: [],

  error: null,
  startTs: initStartTs,
  endTs: initEndTs,
}

const archivesSlice = createSlice({
  name: 'accessAlarmDashboard',
  initialState,

  reducers: {
    fetchAccessAlarmTypeDistributionRequested: state => {
      state.loadingTypeDistribution = true
    },
    fetchAccessAlarmTypeDistributionSucceeded: (state, action) => {
      state.loadingTypeDistribution = false
      const { accessAlarmTypeDistributions } = action.payload
      state.accessAlarmTypeDistributions = accessAlarmTypeDistributions
    },
    fetchAccessAlarmTypeDistributionFailed: (state, action) => {
      state.loadingTypeDistribution = false
      state.error = action.payload.error
    },

    fetchAccessReaderListRequested: state => {
      state.loadingReaderList = true
    },
    fetchAccessReaderListSucceeded: (state, action) => {
      state.loadingReaderList = false
      const { accessReaderList, accessAlarmType } = action.payload
      state.accessReaderList = {
        ...state.accessReaderList,
        [accessAlarmType]: accessReaderList,
      }
    },
    fetchAccessReaderListFailed: (state, action) => {
      state.loadingReaderList = false
      state.error = action.payload.error
    },

    fetchDoorPACSAlertEventDistributionRequested: state => {
      state.loadingDoorPACSDistribution = true
    },
    fetchDoorPACSAlertEventDistributionSucceeded: (state, action) => {
      state.loadingDoorPACSDistribution = false
      const { _PACSAlertEventDistribution } = action.payload
      state.doorPacsAlertEventDistribution = _PACSAlertEventDistribution
    },
    fetchDoorPACSAlertEventDistributionFailed: (state, action) => {
      state.loadingDoorPACSDistribution = false
      state.error = action.payload.error
    },

    fetchInvalidBadgePACSAlertEventDistributionRequested: state => {
      state.loadingInvalidBadgePACSDistribution = true
    },
    fetchInvalidBadgePACSAlertEventDistributionSucceeded: (state, action) => {
      state.loadingInvalidBadgePACSDistribution = false
      const { _PACSAlertEventDistribution } = action.payload
      state.invalidBadgePacsAlertEventDistribution = _PACSAlertEventDistribution
    },
    fetchInvalidBadgePACSAlertEventDistributionFailed: (state, action) => {
      state.loadingInvalidBadgePACSDistribution = false
      state.error = action.payload.error
    },

    fetchAccessNodesForAccountRequested: state => {
      state.loadingAccessNodesForAccount = true
    },
    fetchAccessNodesForAccountSucceeded: (state, action) => {
      state.loadingAccessNodesForAccount = false
      const { accessNodesForAccount } = action.payload
      state.accessNodesForAccount = accessNodesForAccount
    },
    fetchAccessNodesForAccountFailed: (state, action) => {
      state.loadingAccessNodesForAccount = false
      state.error = action.payload.error
    },
    changeTsFilter: (state, action) => {
      const { startTs, endTs } = action.payload
      state.startTs = startTs
      state.endTs = endTs
    },
  },
})

export const {
  fetchAccessAlarmTypeDistributionRequested,
  fetchAccessAlarmTypeDistributionSucceeded,
  fetchAccessAlarmTypeDistributionFailed,
  fetchAccessReaderListRequested,
  fetchAccessReaderListSucceeded,
  fetchAccessReaderListFailed,
  fetchDoorPACSAlertEventDistributionRequested,
  fetchDoorPACSAlertEventDistributionSucceeded,
  fetchDoorPACSAlertEventDistributionFailed,
  fetchInvalidBadgePACSAlertEventDistributionRequested,
  fetchInvalidBadgePACSAlertEventDistributionSucceeded,
  fetchInvalidBadgePACSAlertEventDistributionFailed,
  fetchAccessNodesForAccountRequested,
  fetchAccessNodesForAccountSucceeded,
  fetchAccessNodesForAccountFailed,
  changeTsFilter,
} = archivesSlice.actions

export default archivesSlice.reducer

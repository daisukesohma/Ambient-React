/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough, no-console */
import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import assign from 'lodash/assign'
import getUnixTime from 'date-fns/getUnixTime'
import addDays from 'date-fns/addDays'

function failureModeToString(failureMode) {
  return `${failureMode.id}, ${failureMode.name}`
}

const getInitialFilter = () => {
  const today = new Date()
  const endTs = getUnixTime(today) * 1000
  const startTs = getUnixTime(addDays(today, -1)) * 1000
  return {
    startTs: String(startTs),
    endTs: String(endTs),
  }
}

const slice = createSlice({
  name: 'dataInfra',
  initialState: {
    lastUpdatedAt: null,

    campaignSwitch: false,

    allCampaigns: [],
    allCampaignsLoading: false,

    campaigns: [],
    campaignsLoading: false,
    campaignsLastUpdatedAt: null,
    campaignPages: 0,
    campaignCurrentPage: 1,
    campaignsCount: 0,
    campaignLimit: 10,
    createCampaignModalOpened: false,

    creatingCampaignLoading: false,
    confirmDialogOpened: false,
    campaignAction: null,
    campaignId: null,
    campaignLoading: false,

    dataPoints: [],
    dataPointsLoading: false,
    dataPointsLastUpdatedAt: null,
    dataPointsPages: 0,
    dataPointsPage: 1,
    dataPointsCount: 0,
    dataPointsActiveFilter: getInitialFilter(),

    updateDataPointEventAnnotationLoading: false,

    getEventAnnotationLoading: false,
    currentEventAnnotationLabel: false,
    currentEventAnnotationOther: null,
    currentEventAnnotationFailureModes: [],
    currentEventAnnotationValidFailureModes: [],
    currentEventAnnotationThreatSignature: {},

    selectedCampaign: {},
    isAnnotationModalOpen: false,
    currentDataPoint: {},

    error: null,

    threatSignatureLoading: false,
    threatSignatures: [],

    tabValue: 0,
    failureModeFilters: [],
    failureModeFilterAtLeastOne: true,
    isNormalView: true,
    videoComponentKey: 0,
  },
  reducers: {
    campaignSelected: (state, action) => {
      state.selectedCampaign = action.payload.campaign
    },
    campaignSetPage: (state, action) => {
      state.campaignCurrentPage = action.payload.page
    },
    campaignSetLimit: (state, action) => {
      state.campaignLimit = action.payload.limit
    },
    allCampaignsFetchRequested: (state, action) => {
      state.allCampaignsLoading = true
    },
    allCampaignsFetchSucceeded: (state, action) => {
      state.allCampaignsLoading = false
      const { dataCampaigns } = action.payload
      state.allCampaigns = dataCampaigns
      if (dataCampaigns.length > 0) {
        const [selectedCampaign] = dataCampaigns
        state.selectedCampaign = selectedCampaign
      }
      state.campaignsLastUpdatedAt = moment().unix()
    },
    allCampaignsFetchFailed: (state, action) => {
      state.allCampaignsLoading = false
      state.error = action.payload.message
    },
    campaignsFetchRequested: (state, action) => {
      state.campaignsLoading = true
    },
    campaignsFetchSucceeded: (state, action) => {
      state.campaignsLoading = false
      const { dataCampaigns, totalCount, pages, currentPage } = action.payload
      state.campaigns = dataCampaigns
      state.campaignCurrentPage = currentPage
      state.campaignPages = pages
      state.campaignsCount = totalCount
      state.campaignsLastUpdatedAt = moment().unix()
    },
    campaignsFetchFailed: (state, action) => {
      state.campaignsLoading = false
      state.error = action.payload.message
    },
    dataPointsFetchRequested: (state, action) => {
      state.dataPointsLoading = true
    },
    dataPointsFetchSucceeded: (state, action) => {
      state.dataPointsLoading = false
      const { dataPoints, totalCount, pages, currentPage } = action.payload
      state.dataPointsPage = currentPage
      state.dataPoints = dataPoints
      state.dataPointsPages = pages
      state.dataPointsCount = totalCount
      state.dataPointsLastUpdatedAt = moment().unix()
    },
    dataPointsFetchFailed: (state, action) => {
      state.dataPointsLoading = false
      state.error = action.payload.message
    },
    updateDataPointEventAnnotationFetchRequested: (state, action) => {
      state.updateDataPointEventAnnotationLoading = true
    },
    updateDataPointEventAnnotationFetchSucceeded: (state, action) => {
      state.updateDataPointEventAnnotationLoading = false
    },
    updateDataPointEventAnnotationFetchFailed: (state, action) => {
      state.updateDataPointEventAnnotationLoading = false
      state.error = action.payload.message
    },
    getEventAnnotationFetchRequested: (state, action) => {
      state.getEventAnnotationLoading = true
    },
    getEventAnnotationFetchSucceeded: (state, action) => {
      state.getEventAnnotationLoading = false
      state.currentEventAnnotationLabel = action.payload.label
      state.currentEventAnnotationOther = action.payload.other
      state.currentEventAnnotationFailureModes = action.payload.failureModes
      const arrayLength = state.currentEventAnnotationFailureModes.length
      for (let i = 0; i < arrayLength; i++) {
        state.currentEventAnnotationFailureModes[i] = failureModeToString(
          state.currentEventAnnotationFailureModes[i],
        )
      }
      state.currentEventAnnotationValidFailureModes =
        action.payload.validFailureModes
      state.currentEventAnnotationThreatSignature =
        action.payload.threatSignature
    },
    getEventAnnotationFetchFailed: (state, action) => {
      state.getEventAnnotationLoading = false
      state.error = action.payload.message
    },
    setCurrentEventAnnotationLabel: (state, action) => {
      state.currentEventAnnotationLabel = action.payload.label
    },
    setCurrentEventAnnotationFailureModes: (state, action) => {
      state.currentEventAnnotationFailureModes =
        action.payload.currentEventAnnotationFailureModes
    },
    setFailureModeFilters: (state, action) => {
      state.failureModeFilters = action.payload.failureModeFilters
    },
    setCurrentEventAnnotationOther: (state, action) => {
      state.currentEventAnnotationOther =
        action.payload.currentEventAnnotationOther
    },
    setSubProp: (state, action) => {
      assign(state.dataPointsActiveFilter, action.payload)
    },
    setAnnotationModalOpen: (state, action) => {
      state.isAnnotationModalOpen = action.payload.isAnnotationModalOpen
    },
    setCurrentDataPoint: (state, action) => {
      state.currentDataPoint = action.payload.currentDataPoint
    },
    createCampaignModalOpen: state => {
      state.createCampaignModalOpened = true
    },
    createCampaignModalClose: state => {
      state.createCampaignModalOpened = false
    },
    createCampaignRequested: state => {
      state.creatingCampaignLoading = true
    },
    createCampaignSucceeded: (state, action) => {
      state.creatingCampaignLoading = false
      state.createCampaignModalOpened = false
    },
    createCampaignFailed: state => {
      state.creatingCampaignLoading = false
      state.campaignModalOpen = false
    },
    confirmDialogOpen: state => {
      state.confirmDialogOpened = true
    },
    confirmDialogClose: state => {
      state.confirmDialogOpened = false
      state.campaignAction = null
      state.campaignId = null
    },
    setCampaignAction: (state, action) => {
      state.campaignAction = action.payload.action
      state.campaignId = action.payload.campaignId
    },
    archiveCampaignRequested: state => {
      state.campaignLoading = true
    },
    archiveCampaignSucceeded: state => {
      state.campaignLoading = false
      state.campaignAction = null
      state.campaignId = null
    },
    archiveCampaignFailed: state => {
      state.campaignLoading = false
      state.campaignAction = null
      state.campaignId = null
    },
    stopCampaignRequested: state => {
      state.campaignLoading = true
    },
    stopCampaignSucceeded: state => {
      state.campaignLoading = false
      state.campaignAction = null
      state.campaignId = null
    },
    stopCampaignFailed: state => {
      state.campaignLoading = false
      state.campaignAction = null
      state.campaignId = null
    },
    startCampaignRequested: state => {
      state.campaignLoading = true
    },
    startCampaignSucceeded: state => {
      state.campaignLoading = false
      state.campaignAction = null
      state.campaignId = null
    },
    startCampaignFailed: state => {
      state.campaignLoading = false
      state.campaignAction = null
      state.campaignId = null
    },
    deleteCampaignRequested: state => {
      state.campaignLoading = true
    },
    deleteCampaignSucceeded: state => {
      state.campaignLoading = false
      state.campaignAction = null
      state.campaignId = null
    },
    deleteCampaignFailed: state => {
      state.campaignLoading = false
      state.campaignAction = null
      state.campaignId = null
    },
    fetchAllThreatSignaturesRequested: state => {
      state.threatSignatureLoading = true
    },
    fetchAllThreatSignaturesSucceeded: (state, action) => {
      state.threatSignatureLoading = false
      state.threatSignatures = action.payload.threatSignatures
    },
    fetchAllThreatSignaturesFailed: state => {
      state.threatSignatureLoading = false
    },
    toggleSlider: state => {
      state.campaignSwitch = !state.campaignSwitch
      state.campaignCurrentPage = 1
    },
    updateTabValue: (state, action) => {
      state.tabValue = action.payload.tabValue
    },
    setFailureModeFilterAtLeastOne: (state, action) => {
      state.failureModeFilterAtLeastOne =
        action.payload.failureModeFilterAtLeastOne
    },
    setIsNormalView: (state, action) => {
      state.isNormalView = action.payload.isNormalView
      state.videoComponentKey += 1
    },
  },
})

export const {
  campaignSetPage,
  campaignSetLimit,

  campaignsFetchRequested,
  campaignsFetchSucceeded,
  campaignsFetchFailed,

  allCampaignsFetchRequested,
  allCampaignsFetchSucceeded,
  allCampaignsFetchFailed,

  dataPointsFetchRequested,
  dataPointsFetchSucceeded,
  dataPointsFetchFailed,

  updateDataPointEventAnnotationFetchRequested,
  updateDataPointEventAnnotationFetchSucceeded,
  updateDataPointEventAnnotationFetchFailed,

  getEventAnnotationFetchRequested,
  getEventAnnotationFetchSucceeded,
  getEventAnnotationFetchFailed,

  campaignSelected,
  setCurrentEventAnnotationLabel,
  setCurrentEventAnnotationFailureModes,
  setCurrentEventAnnotationOther,
  setAnnotationModalOpen,
  setCurrentDataPoint,
  setSubProp,

  createCampaignModalOpen,
  createCampaignModalClose,

  createCampaignRequested,
  createCampaignSucceeded,
  createCampaignFailed,

  archiveCampaignRequested,
  archiveCampaignSucceeded,
  archiveCampaignFailed,

  stopCampaignRequested,
  stopCampaignSucceeded,
  stopCampaignFailed,

  startCampaignRequested,
  startCampaignSucceeded,
  startCampaignFailed,

  deleteCampaignRequested,
  deleteCampaignSucceeded,
  deleteCampaignFailed,

  confirmDialogOpen,
  confirmDialogClose,
  setCampaignAction,

  fetchAllThreatSignaturesRequested,
  fetchAllThreatSignaturesSucceeded,
  fetchAllThreatSignaturesFailed,

  toggleSlider,
  updateTabValue,
  setFailureModeFilters,
  setFailureModeFilterAtLeastOne,
  setIsNormalView,
} = slice.actions

export default slice.reducer

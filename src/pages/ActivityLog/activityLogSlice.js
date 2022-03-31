/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { get, findIndex, assign, map, each, isNumber, isEmpty } from 'lodash'
import moment from 'moment'
import { ActivityTypeEnum } from 'enums'

export const UI_FILTER_PROPS = [
  'active',
  'activeCommon',
  'selectedSites',
  'selectedSeverities',

  'threatSignatures',
  'selectedThreatSignatures',

  'streams',
  'selectedStreams',

  'securityProfiles',
  'selectedSecurityProfiles',

  'selectedAccessAlarmTypes',
]

const startTs = moment()
  .subtract(3, 'days')
  .unix()
const endTs = moment().unix()

export const sharedFilters = {
  startTs,
  endTs,
  searchQuery: '',
  siteSlugs: [],
}

const commonFilterProps = {
  ...sharedFilters,
  // UI
  activeCommon: false,
  selectedSites: [],
  selectedStreams: [],
  selectedSeverities: [],
  selectedAccessAlarmTypes: [],
  streams: [],
}

export const ACTIVITIES_SUB_FILTERS_MAP = {
  [ActivityTypeEnum.AlertEventType]: [
    'threatSignatureIds',
    'severities',
    'streamIds',
    'hasStream',
  ],
  [ActivityTypeEnum.AccessAlarmType]: [
    'streamIds',
    'accessAlarmTypes',
    'hasStream',
  ],
  [ActivityTypeEnum.ProfileOverrideLogType]: ['securityProfileIds'],
  [ActivityTypeEnum.WorkShiftType]: ['signIn'],
}

const filtersInitialState = [
  {
    active: true,
    type: ActivityTypeEnum.AlertEventType,
    ...commonFilterProps,
    threatSignatureIds: null,
    severities: null,
    streamIds: null,
    hasStream: null,
  },
  {
    active: false,
    type: ActivityTypeEnum.AccessAlarmType,
    ...commonFilterProps,
    streamIds: null,
    hasStream: null,
    accessAlarmTypes: null,
  },
  {
    active: false,
    type: ActivityTypeEnum.ProfileOverrideLogType,
    ...commonFilterProps,
    securityProfileIds: null,
  },
  {
    active: false,
    type: ActivityTypeEnum.WorkShiftType,
    ...commonFilterProps,
    signIn: null,
  },
  {
    active: false,
    type: ActivityTypeEnum.ThreatSignaturePausePeriodType,
    ...commonFilterProps,
  },
]

const initialState = {
  activities: [],
  error: null,
  loading: false,
  pages: 0,
  page: 0,
  totalCount: 0,

  loadingAccessAlarmTypeCast: false,
  accessAlarmTypeCast: null,

  activeFilter: {},
  selectedSites: [],
  securityProfiles: [],
  threatSignatures: [],
  streams: [],
  searchQuery: '',
  startTs,
  endTs,
  siteSlugs: [],
  filters: filtersInitialState,

  regexLoading: false,
  regexAccessAlarms: [],
  regexAccessAlarmsPages: 0,

  updatingAccessAlarmTypeCast: false,
  updateRes: null,

  loadingAccessAlarmTypes: false,
  accessAlarmTypes: [],

  loadingStreams: false,

  loadingDownload: false,
  downloadLink: null,
}

const slice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {
    setState: (state, action) => {
      const { filters, page } = action.payload
      assign(state, filters)
      each(state.filters, (filter, index) => {
        assign(state.filters[index], filters)
      })
      if (isNumber(page)) state.page = page
    },
    activityLogsFetchRequested: state => {
      state.loading = true
      // state.pages = 0
    },
    activityLogsFetchSucceeded: (state, action) => {
      state.loading = false
      state.activities = action.payload.instances
      state.pages = action.payload.pages
      state.totalCount = action.payload.totalCount
    },
    activityLogsFetchFailed: (state, action) => {
      state.loading = false
      state.activities = initialState.activities
      state.pages = initialState.pages
      state.totalCount = initialState.totalCount
      state.error = action.payload.error
    },

    createOrUpdateActivity: (state, action) => {
      const newItemIndex = findIndex(state.activities, {
        id: get(action.payload, 'activity.id'),
        __typename: get(action.payload, 'activity.__typename'),
      })
      if (newItemIndex !== -1) {
        state.activities[newItemIndex] = get(action.payload, 'activity')
      } else {
        state.activities.unshift(get(action.payload, 'activity'))
      }
    },

    applyFilter: (state, action) => {
      const { filter } = action.payload
      const index = findIndex(state.filters, { type: filter.type })
      state.filters[index] = filter
      state.page = 0
    },
    setSubProp: (state, action) => {
      assign(state.activeFilter, action.payload)
      state.page = 0
    },

    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload.activeFilter
    },
    resetFilters: state => {
      each(state.filters, (filter, index) => {
        state.filters[index] = assign({}, filtersInitialState[index], {
          active: false,
          securityProfiles: state.securityProfiles,
          streams: state.streams,
          startTs: state.startTs,
          endTs: state.endTs,
          selectedSites: state.selectedSites,
          siteSlugs: map(state.selectedSites, 'slug'),
        })
      })
      state.page = 0
    },

    accessAlarmsRegexFetchRequested: state => {
      state.regexLoading = true
    },

    accessAlarmsRegexFetchSucceeded: (state, action) => {
      state.regexLoading = false
      state.regexAccessAlarms = action.payload.instances
      state.regexAccessAlarmsPages = action.payload.pages
    },

    accessAlarmsRegexFetchFailed: (state, action) => {
      state.regexLoading = false
      state.error = action.payload.error
    },

    createAccessAlarmTypeCastRequested: state => {
      state.updatingAccessAlarmTypeCast = true
    },

    createAccessAlarmTypeCastSucceeded: (state, action) => {
      state.updatingAccessAlarmTypeCast = false
      state.updateRes = action.payload.updateRes
    },

    createAccessAlarmTypeCastFailed: (state, action) => {
      state.updatingAccessAlarmTypeCast = false
      state.error = action.payload.error
    },

    updateAccessAlarmTypeCastRequested: state => {
      state.updatingAccessAlarmTypeCast = true
    },

    updateAccessAlarmTypeCastSucceeded: (state, action) => {
      state.updatingAccessAlarmTypeCast = false
      state.updateRes = action.payload.updateRes
    },

    updateAccessAlarmTypeCastFailed: (state, action) => {
      state.updatingAccessAlarmTypeCast = false
      state.error = action.payload.error
    },

    clearUpdateRes: state => {
      state.updateRes = null
    },

    getAccessAlarmTypeCastByIdRequested: state => {
      state.loadingAccessAlarmTypeCast = true
    },

    getAccessAlarmTypeCastByIdSucceeded: (state, action) => {
      state.loadingAccessAlarmTypeCast = false
      state.accessAlarmTypeCast = action.payload
    },

    getAccessAlarmTypeCastByIdFailed: (state, action) => {
      state.loadingAccessAlarmTypeCast = false
      state.error = action.payload.error
    },

    getStreamsRequested: state => {
      state.loadingStreams = true
    },

    getStreamsSucceeded: (state, action) => {
      const { streams, appointment } = action.payload
      state.loadingStreams = false
      if (appointment === 'main') {
        state.streams = streams
        each(state.filters, (filter, index) => {
          assign(state.filters[index], { streams })
        })
      }
      if (appointment === 'sub' && !isEmpty(state.activeFilter)) {
        state.activeFilter.streams = streams
      }
    },

    getStreamsFailed: (state, action) => {
      state.loadingStreams = false
      state.error = action.payload.error
    },

    getSecurityProfilesRequested: state => {
      state.loadingSecurityProfiles = true
    },

    getSecurityProfilesSucceeded: (state, action) => {
      const { securityProfiles, appointment } = action.payload
      state.loadingSecurityProfiles = false
      if (appointment === 'main') {
        state.securityProfiles = securityProfiles
        each(state.filters, (filter, index) => {
          assign(state.filters[index], { securityProfiles })
        })
      }
      if (appointment === 'sub' && !isEmpty(state.activeFilter)) {
        state.activeFilter.securityProfiles = securityProfiles
      }
    },

    getSecurityProfilesFailed: (state, action) => {
      state.loadingSecurityProfiles = false
      state.error = action.payload.error
    },

    fetchDownloadLinkRequested: state => {
      state.loadingDownload = true
    },

    fetchDownloadLinkSucceeded: (state, action) => {
      state.loadingDownload = false
      state.downloadLink = action.payload.link
    },

    fetchDownloadReset: state => {
      state.loadingDownload = false
      state.downloadLink = null
    },

    fetchThreatSignaturesRequested: state => {
      state.loadingThreatSignatures = true
    },
    fetchThreatSignaturesSucceeded: (state, action) => {
      const { threatSignatures } = action.payload
      state.loadingThreatSignatures = false
      state.threatSignatures = threatSignatures
    },
    fetchThreatSignaturesFailed: state => {
      state.loadingThreatSignatures = false
    },

    fetchAccessAlarmTypesRequested: state => {
      state.loadingAccessAlarmTypes = true
    },
    fetchAccessAlarmTypesSucceeded: (state, action) => {
      state.loadingAccessAlarmTypes = false
      state.accessAlarmTypes = action.payload
    },
    fetchAccessAlarmTypesFailed: state => {
      state.loadingAccessAlarmTypes = false
    },
  },
})

export const {
  activityLogsFetchRequested,
  activityLogsFetchSucceeded,
  activityLogsFetchFailed,
  createOrUpdateActivity,
  setState,
  applyFilter,
  setSubProp,
  setActiveFilter,
  resetFilters,
  accessAlarmsRegexFetchRequested,
  accessAlarmsRegexFetchSucceeded,
  accessAlarmsRegexFetchFailed,
  createAccessAlarmTypeCastRequested,
  createAccessAlarmTypeCastSucceeded,
  createAccessAlarmTypeCastFailed,
  updateAccessAlarmTypeCastRequested,
  updateAccessAlarmTypeCastSucceeded,
  updateAccessAlarmTypeCastFailed,
  clearUpdateRes,
  getAccessAlarmTypeCastByIdRequested,
  getAccessAlarmTypeCastByIdSucceeded,
  getAccessAlarmTypeCastByIdFailed,
  getStreamsRequested,
  getStreamsSucceeded,
  getStreamsFailed,

  getSecurityProfilesRequested,
  getSecurityProfilesSucceeded,
  getSecurityProfilesFailed,

  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,

  fetchDownloadLinkRequested,
  fetchDownloadLinkSucceeded,
  fetchDownloadReset,

  fetchAccessAlarmTypesRequested,
  fetchAccessAlarmTypesSucceeded,
  fetchAccessAlarmTypesFailed,
} = slice.actions

export default slice.reducer

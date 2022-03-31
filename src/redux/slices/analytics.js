/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
// Primarily for handling video streams
import { createSlice } from '@reduxjs/toolkit'
import findIndex from 'lodash/findIndex'
import keyBy from 'lodash/keyBy'
import set from 'lodash/set'
import moment from 'moment'

import AnalyticsMetricTypeEnum from '../../enums/AnalyticsMetricTypeEnum'
import datesSet from '../../containers/Reports/AnalyticsReport/components/MetricContainer/datesSet'

const newMetricState = metric => {
  const endTs = moment().unix()
  const diff =
    metric.metricType === AnalyticsMetricTypeEnum.OCCUPANCY
      ? datesSet[2].getValue()
      : datesSet[5].getValue()
  return {
    id: metric.id,
    loading: false,
    deleting: false,
    startTs: endTs - diff,
    endTs,
    dows: -1,
    hods: -1,
    data: null,
  }
}

const mapNewMetrics = metrics =>
  keyBy(metrics.map(m => newMetricState(m)), 'id')

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    dashboards: [],
    // Currently selected dashboard's metrics
    // List[{ loading, data: GQL }]
    metrics: [],
    metricTypes: [],
    conditionTypes: [],
    entities: [],
    sites: [],
    // Chart types are for the currenty selected metric during creation
    // List[{ metricType: [chartTypes]}]
    chartTypes: {},
    loadingDashboards: false,
    selectedDashboard: null,
    refreshFrequency: null,
    arrangeLoading: false,
    // Last 30 minutes. null means static range chosen.
    loadingMetricTypes: false,
    loadingConditionTypes: false,
    loadingEntities: false,
    // Common load for all
    loadingCreateMetric: false,
    loadingCreateDashboard: false,
    loadingSites: false,
    deletingDashboard: false,
    createDashboardOpen: false,

    threatSignatures: [],
    loadingThreatSignatures: false,
    zones: [],
    loadingZones: false,
    loadingCreateAnalyticsCondition: false,
    loadingDeleteAnalyticsCondition: false,
    loadingDeleteAnalyticsAlert: false,
  },
  reducers: {
    dashboardsFetchRequested: (state, action) => {
      state.loadingDashboards = true
    },
    dashboardsFetchSucceeded: (state, action) => {
      state.dashboards = action.payload.dashboards
      state.loadingDashboards = false
    },
    dashboardsFetchFailed: (state, action) => {
      state.loadingDashboards = false
    },

    metricDataFetchRequested: (state, action) => {
      const { metricId } = action.payload
      set(state, `metrics.${metricId}.loading`, true)
    },
    metricDataFetchSucceeded: (state, action) => {
      const { metricId, data } = action.payload
      set(state, `metrics.${metricId}.loading`, false)
      set(state, `metrics.${metricId}.data`, data)
    },
    metricDataFetchFailed: (state, action) => {
      const { metricId } = action.payload
      set(state, `metrics.${metricId}.loading`, false)
    },

    metricTypesFetchRequested: (state, action) => {
      state.loadingMetricTypes = true
    },
    metricTypesFetchSucceeded: (state, action) => {
      state.loadingMetricTypes = false
      state.metricTypes = action.payload.analyticsMetricTypes
    },
    metricTypesFetchFailed: (state, action) => {
      state.loadingMetricTypes = false
    },

    entitiesFetchRequested: (state, action) => {
      state.loadingEntities = true
    },
    entitiesFetchSucceeded: (state, action) => {
      state.loadingEntities = false
      state.entities = action.payload.entities
    },
    entitiesFetchFailed: (state, action) => {
      state.loadingEntities = false
    },

    createAnalyticsMetricRequested: (state, action) => {
      state.loadingCreateMetric = true
    },
    createAnalyticsMetricSucceeded: (state, action) => {
      state.loadingCreateMetric = false
      state.selectedDashboard.metrics.push(action.payload.metric)
      // Add metrics
      state.metrics[action.payload.metric.id] = newMetricState(
        action.payload.metric,
      )
    },
    createAnalyticsMetricFailed: (state, action) => {
      state.loadingCreateMetric = false
    },

    deleteMetricRequested: (state, action) => {
      const { id } = action.payload
      set(state, `metrics.${id}.deleting`, true)
    },
    deleteMetricSucceeded: (state, action) => {
      const { id } = action.payload
      set(state, `metrics.${id}.deleting`, false)
      const removeDeleteMetricIndex = findIndex(
        state.selectedDashboard.metrics,
        { id },
      )

      if (removeDeleteMetricIndex > -1) {
        state.selectedDashboard.metrics.splice(removeDeleteMetricIndex, 1)
        // Remove
        delete state.metrics[id]
      }
    },
    deleteMetricFailed: (state, action) => {
      const { id } = action.payload
      set(state, `metrics.${id}.deleting`, false)
    },

    sitesFetchRequested: (state, action) => {
      state.loadingSites = true
    },
    sitesFetchSucceeded: (state, action) => {
      state.sites = action.payload.sites
      state.loadingSites = false
    },
    sitesFetchFailed: (state, action) => {
      state.loadingSites = false
    },

    createAnalyticsDashboardRequested: (state, action) => {
      state.loadingCreateDashboard = true
    },
    createAnalyticsDashboardSucceeded: (state, action) => {
      state.loadingCreateDashboard = false
      state.dashboards.push(action.payload.dashboard)
      state.selectedDashboard = action.payload.dashboard
      // Overwrite metrics
      state.metrics = mapNewMetrics(state.selectedDashboard.metrics)
    },
    createAnalyticsDashboardFailed: (state, action) => {
      state.loadingCreateDashboard = false
    },

    deleteAnalyticsDashboardRequested: (state, action) => {
      state.deletingDashboard = true
    },
    deleteAnalyticsDashboardSucceeded: (state, action) => {
      state.deletingDashboard = false
      const dashboardToDeleteIndex = findIndex(state.dashboards, {
        id: action.payload.id,
      })
      state.dashboards.splice(dashboardToDeleteIndex, 1)
      // Update selectedDashboard
      if (state.dashboards.length > 0) {
        ;[state.selectedDashboard] = state.dashboards
        // Overwrite
        state.metrics = mapNewMetrics(state.selectedDashboard.metrics)
      } else {
        state.selectedDashboard = null
        state.metrics = []
      }
    },
    deleteAnalyticsDashboardFailed: (state, action) => {
      state.deletingDashboard = false
    },

    arrangeAnalyticsDashboardRequested: (state, action) => {
      state.arrangeLoading = true
      if (state.selectedDashboard.id === action.payload.id) {
        state.selectedDashboard.metrics = action.payload.order.map(metricId => {
          const index = findIndex(state.selectedDashboard.metrics, {
            id: metricId,
          })
          return state.selectedDashboard.metrics[index]
        })
      }
    },
    arrangeAnalyticsDashboardSucceeded: (state, action) => {
      state.arrangeLoading = false
    },
    arrangeAnalyticsDashboardFailed: (state, action) => {
      state.arrangeLoading = false
    },

    selectDashboard: (state, action) => {
      const { id } = action.payload

      if (!state.selectedDashboard || state.selectedDashboard.id !== id) {
        state.selectedDashboard = state.dashboards.find(
          dashboard => dashboard.id === id,
        )
        state.metrics = mapNewMetrics(state.selectedDashboard.metrics)
      }
    },
    setRefreshRange: (state, action) => {
      // Empty
    },
    setRefreshFrequency: (state, action) => {
      state.refreshFrequency = action.payload.refreshFrequency
    },
    setCreateDashboardOpen: (state, action) => {
      state.createDashboardOpen = action.payload.createDashboardOpen
    },

    setMetricValues: (state, action) => {
      const { metric, props } = action.payload
      if (state.metrics[metric.id]) {
        state.metrics[metric.id] = { ...state.metrics[metric.id], ...props }
      }
    },

    toggleStream: (state, action) => {
      const { metric, stream } = action.payload
      const metricIndex = findIndex(state.selectedDashboard.metrics, {
        id: metric.id,
      })

      const streamIndex = findIndex(
        state.selectedDashboard.metrics[metricIndex].streams,
        { id: stream.id },
      )
      if (streamIndex === -1) {
        state.selectedDashboard.metrics[metricIndex].streams.push(stream)
      } else {
        state.selectedDashboard.metrics[metricIndex].streams.splice(
          streamIndex,
          1,
        )
      }
    },

    setStreams: (state, action) => {
      const { metric, streams } = action.payload
      const metricIndex = findIndex(state.selectedDashboard.metrics, {
        id: metric.id,
      })

      state.selectedDashboard.metrics[metricIndex].streams = streams
    },

    threatSignaturesFetchRequested: (state, action) => {
      state.loadingThreatSignatures = true
    },
    threatSignaturesFetchSucceeded: (state, action) => {
      state.loadingThreatSignatures = false
      state.threatSignatures = action.payload.threatSignatures
    },
    threatSignaturesFetchFailed: (state, action) => {
      state.loadingThreatSignatures = false
    },

    zonesFetchRequested: (state, action) => {
      state.loadingZones = true
    },
    zonesFetchSucceeded: (state, action) => {
      state.loadingZones = false
      state.zones = action.payload.zones
    },
    zonesFetchFailed: (state, action) => {
      state.loadingZones = false
    },

    createAnalyticsConditionRequested: (state, action) => {
      state.loadingCreateAnalyticsCondition = true
    },
    createAnalyticsConditionSucceeded: (state, action) => {
      const {
        id: metricId,
        threshold,
        condition,
        alert,
      } = action.payload.metric
      const index = findIndex(state.selectedDashboard.metrics, { id: metricId })
      const metric = state.selectedDashboard.metrics[index]

      metric.threshold = threshold
      metric.condition = condition
      metric.alert = alert
      state.loadingCreateAnalyticsCondition = false
    },
    createAnalyticsConditionFailed: (state, action) => {
      state.loadingCreateAnalyticsCondition = false
    },

    deleteAnalyticsConditionRequested: (state, action) => {
      state.loadingDeleteAnalyticsCondition = true
    },
    deleteAnalyticsConditionSucceeded: (state, action) => {
      // TODO: Implement
      state.loadingDeleteAnalyticsCondition = false
    },
    deleteAnalyticsConditionFailed: (state, action) => {
      state.loadingDeleteAnalyticsCondition = false
    },

    deleteAnalyticsAlertRequested: (state, action) => {
      state.loadingDeleteAnalyticsAlert = true
    },
    deleteAnalyticsAlertSucceeded: (state, action) => {
      const { metricId } = action.payload
      const index = findIndex(state.selectedDashboard.metrics, { id: metricId })
      state.selectedDashboard.metrics[index].alert = null
      state.loadingDeleteAnalyticsAlert = false
    },
    deleteAnalyticsAlertFailed: (state, action) => {
      state.loadingDeleteAnalyticsAlert = false
    },

    conditionTypesFetchRequested: (state, action) => {
      state.loadingConditionTypes = true
    },
    conditionTypesFetchSucceeded: (state, action) => {
      state.loadingConditionTypes = false
      state.conditionTypes = action.payload.conditionTypes
    },
    conditionTypesFetchFailed: (state, action) => {
      state.loadingConditionTypes = false
    },
  },
})

export const {
  dashboardsFetchRequested,
  dashboardsFetchSucceeded,
  dashboardsFetchFailed,

  metricDataFetchRequested,
  metricDataFetchSucceeded,
  metricDataFetchFailed,

  metricTypesFetchRequested,
  metricTypesFetchSucceeded,
  metricTypesFetchFailed,

  entitiesFetchRequested,
  entitiesFetchSucceeded,
  entitiesFetchFailed,

  createAnalyticsMetricRequested,
  createAnalyticsMetricSucceeded,
  createAnalyticsMetricFailed,

  deleteMetricRequested,
  deleteMetricSucceeded,
  deleteMetricFailed,

  sitesFetchRequested,
  sitesFetchSucceeded,
  sitesFetchFailed,

  createAnalyticsDashboardRequested,
  createAnalyticsDashboardSucceeded,
  createAnalyticsDashboardFailed,

  deleteAnalyticsDashboardRequested,
  deleteAnalyticsDashboardSucceeded,
  deleteAnalyticsDashboardFailed,

  arrangeAnalyticsDashboardRequested,
  arrangeAnalyticsDashboardSucceeded,
  arrangeAnalyticsDashboardFailed,

  selectDashboard,
  setRefreshRange,
  setRefreshFrequency,
  setCreateDashboardOpen,
  setMetricValues,
  toggleStream,
  setStreams,

  threatSignaturesFetchRequested,
  threatSignaturesFetchFailed,
  threatSignaturesFetchSucceeded,

  zonesFetchRequested,
  zonesFetchSucceeded,
  zonesFetchFailed,

  createAnalyticsConditionRequested,
  createAnalyticsConditionSucceeded,
  createAnalyticsConditionFailed,

  deleteAnalyticsConditionRequested,
  deleteAnalyticsConditionSucceeded,
  deleteAnalyticsConditionFailed,

  deleteAnalyticsAlertRequested,
  deleteAnalyticsAlertSucceeded,
  deleteAnalyticsAlertFailed,

  conditionTypesFetchRequested,
  conditionTypesFetchSucceeded,
  conditionTypesFetchFailed,
} = analyticsSlice.actions

export default analyticsSlice.reducer

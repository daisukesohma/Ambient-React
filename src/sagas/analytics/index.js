import {
  call,
  put,
  takeLatest,
  takeEvery,
  select,
  cancel,
  fork,
} from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
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
  sitesFetchRequested,
  sitesFetchSucceeded,
  sitesFetchFailed,
  createAnalyticsMetricRequested,
  createAnalyticsMetricSucceeded,
  createAnalyticsMetricFailed,
  createAnalyticsDashboardRequested,
  createAnalyticsDashboardSucceeded,
  createAnalyticsDashboardFailed,
  deleteAnalyticsDashboardRequested,
  deleteAnalyticsDashboardSucceeded,
  deleteAnalyticsDashboardFailed,
  deleteMetricRequested,
  deleteMetricSucceeded,
  deleteMetricFailed,
  arrangeAnalyticsDashboardRequested,
  arrangeAnalyticsDashboardSucceeded,
  arrangeAnalyticsDashboardFailed,
  threatSignaturesFetchRequested,
  threatSignaturesFetchSucceeded,
  threatSignaturesFetchFailed,
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
} from 'redux/slices/analytics'

import config from 'config'
import { mockData } from './mockData'
import {
  ANALYTICS_DASHBOARDS_FOR_ACCOUNT,
  ANALYTICS_METRIC_DATA,
  ANALYTICS_METRIC_TYPES,
  ANALYTICS_CONDITION_TYPES,
  CREATE_ANALYTICS_METRIC,
  GET_ENTITIES,
  GET_SITES_BY_ACCOUNT,
  DELETE_ANALYTICS_METRIC,
  CREATE_ANALYTICS_DASHBOARD,
  DELETE_ANALYTICS_DASHBOARD,
  ARRANGE_ANALYTICS_DASHBOARD,
  GET_THREAT_SIGNATURES,
  GET_ZONES,
  CREATE_ANALYTICS_CONDITION,
  DELETE_ANALYTICS_CONDITION,
  DELETE_ANALYTICS_ALERT,
} from './gql'

const isDemo = config.settings.demo

function* fetchDashboards(action) {
  if (isDemo) {
    yield put(dashboardsFetchSucceeded({ dashboards: mockData.dashboards }))
    return
  }

  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, ANALYTICS_DASHBOARDS_FOR_ACCOUNT, {
      accountSlug,
    })
    yield put(
      dashboardsFetchSucceeded({
        dashboards: response.data.analyticsDashboardsForAccount,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(dashboardsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchMetricTypes() {
  try {
    const response = yield call(createQuery, ANALYTICS_METRIC_TYPES)
    yield put(
      metricTypesFetchSucceeded({
        analyticsMetricTypes: response.data.analyticsMetricTypes,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(metricTypesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchConditionTypes() {
  try {
    const response = yield call(createQuery, ANALYTICS_CONDITION_TYPES)
    yield put(
      conditionTypesFetchSucceeded({
        conditionTypes: response.data.analyticsConditionTypes,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(conditionTypesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchMetricData(action) {
  const {
    metricId,
    startTs,
    endTs,
    streamIds,
    compareOffset,
    breakdown,
    dows,
    hods,
  } = action.payload

  if (isDemo) {
    const mockMetric = mockData.metrics.find(metric => metric.id === metricId)
    yield put(
      metricDataFetchSucceeded({
        metricId,
        data: mockMetric.data({ startTs, endTs, breakdown, compareOffset }),
      }),
    )
    return
  }

  try {
    const response = yield call(createQuery, ANALYTICS_METRIC_DATA, {
      metricId,
      startTs,
      endTs,
      breakdown,
      mock: false,
      compareOffset,
      streamIds,
      dows,
      hods,
    })
    yield put(
      metricDataFetchSucceeded({
        metricId,
        data: response.data.analyticsMetricData,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(metricDataFetchFailed({ metricId, error }))
    yield put(createNotification({ message }))
  }
}

function* fetchEntities() {
  try {
    const response = yield call(createQuery, GET_ENTITIES, {
      allowSearch: true,
    })
    yield put(entitiesFetchSucceeded({ entities: response.data.getEntities }))
  } catch (error) {
    const { message } = error
    yield put(entitiesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchSitesByAccount(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    yield put(
      sitesFetchSucceeded({
        sites: response.data.allSitesByAccount,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(sitesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createAnalyticsMetric(action) {
  try {
    const {
      dashboardId,
      siteId,
      metricType,
      chartType,
      query,
      streamIds,
      name,
      description,
      includeZones,
      excludeZones,
    } = action.payload
    const response = yield call(createMutation, CREATE_ANALYTICS_METRIC, {
      dashboardId,
      siteId,
      metricType,
      chartType,
      query,
      streamIds,
      name,
      description,
      includeZones,
      excludeZones,
    })
    yield put(
      createAnalyticsMetricSucceeded({
        metric: response.data.createAnalyticsMetric.metric,
      }),
    )
    yield put(createNotification({ message: 'Metric created successfully' }))
  } catch (error) {
    const { message } = error
    yield put(createAnalyticsMetricFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createAnalyticsDashboard(action) {
  try {
    const { accountSlug, name, description } = action.payload
    const response = yield call(createMutation, CREATE_ANALYTICS_DASHBOARD, {
      accountSlug,
      name,
      description,
    })
    yield put(
      createAnalyticsDashboardSucceeded({
        dashboard: response.data.createAnalyticsDashboard.dashboard,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(createAnalyticsDashboardFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteAnalyticsMetric(action) {
  const { id } = action.payload
  try {
    yield call(createMutation, DELETE_ANALYTICS_METRIC, { id })
    yield put(deleteMetricSucceeded({ id }))
  } catch (error) {
    const { message } = error
    yield put(deleteMetricFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteAnalyticsDashboard(action) {
  const { id } = action.payload
  try {
    yield call(createMutation, DELETE_ANALYTICS_DASHBOARD, { id })
    yield put(deleteAnalyticsDashboardSucceeded({ id }))
  } catch (error) {
    const { message } = error
    yield put(deleteAnalyticsDashboardFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* arrangeAnalyticsDashboard(action) {
  const { id, order } = action.payload
  try {
    yield call(createMutation, ARRANGE_ANALYTICS_DASHBOARD, { id, order })
    yield put(arrangeAnalyticsDashboardSucceeded({ id, order }))
  } catch (error) {
    const { message } = error
    yield put(arrangeAnalyticsDashboardFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchThreatSignatures(action) {
  try {
    const response = yield call(createQuery, GET_THREAT_SIGNATURES)
    yield put(
      threatSignaturesFetchSucceeded({
        threatSignatures: response.data.allThreatSignatures,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(threatSignaturesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchZones(action) {
  try {
    const response = yield call(createQuery, GET_ZONES)
    yield put(
      zonesFetchSucceeded({
        zones: response.data.getZones,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(zonesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createAnalyticsCondition(action) {
  try {
    const {
      metricId,
      threshold,
      condition,
      raiseAlert,
      alertName,
      alertSeverity,
      alertIsTest,
    } = action.payload
    const response = yield call(createMutation, CREATE_ANALYTICS_CONDITION, {
      metricId,
      threshold,
      condition,
      raiseAlert,
      alertName,
      alertSeverity,
      alertIsTest,
    })
    yield put(
      createAnalyticsConditionSucceeded({
        metric: response.data.createAnalyticsCondition.metric,
      }),
    )
    yield put(
      createNotification({
        message: 'Metric condition created successfully',
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(createAnalyticsConditionFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteAnalyticsCondition(action) {
  try {
    const { metricId } = action.payload
    const response = yield call(createMutation, DELETE_ANALYTICS_CONDITION, {
      metricId,
    })
    yield put(
      deleteAnalyticsConditionSucceeded({
        metricId: response.data.deleteAnalyticsConditionFailed.metric.id,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(deleteAnalyticsConditionFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteAnalyticsAlert(action) {
  try {
    const { metricId } = action.payload
    yield call(createMutation, DELETE_ANALYTICS_ALERT, { metricId })
    yield put(
      deleteAnalyticsAlertSucceeded({
        metricId,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(deleteAnalyticsAlertFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

const metricMap = {
  dashboardId: null,
  metrics: {},
}

function* fetchMetricDataWrapper(action) {
  const { dashboardId, metricId } = action.payload

  // Cancel the previous tasks of the previous dashboards
  if (metricMap.dashboardId !== dashboardId) {
    const tasks = Object.values(metricMap.metrics)

    // Cancel all ongoing tasks from previous dashboard
    yield cancel([...tasks])
    metricMap.dashboardId = dashboardId
  }

  const metricTask = yield fork(fetchMetricData, action)

  metricMap.metrics[metricId] = metricTask
}

function* analyticsSaga() {
  yield takeLatest(dashboardsFetchRequested, fetchDashboards)
  yield takeEvery(metricDataFetchRequested, fetchMetricDataWrapper)
  yield takeEvery(metricTypesFetchRequested, fetchMetricTypes)
  yield takeEvery(entitiesFetchRequested, fetchEntities)
  yield takeEvery(deleteMetricRequested, deleteAnalyticsMetric)
  yield takeLatest(createAnalyticsMetricRequested, createAnalyticsMetric)
  yield takeLatest(createAnalyticsDashboardRequested, createAnalyticsDashboard)
  yield takeLatest(sitesFetchRequested, fetchSitesByAccount)
  yield takeLatest(deleteAnalyticsDashboardRequested, deleteAnalyticsDashboard)
  yield takeLatest(
    arrangeAnalyticsDashboardRequested,
    arrangeAnalyticsDashboard,
  )
  yield takeLatest(threatSignaturesFetchRequested, fetchThreatSignatures)
  yield takeLatest(zonesFetchRequested, fetchZones)
  yield takeLatest(createAnalyticsConditionRequested, createAnalyticsCondition)
  yield takeLatest(deleteAnalyticsConditionRequested, deleteAnalyticsCondition)
  yield takeLatest(deleteAnalyticsAlertRequested, deleteAnalyticsAlert)
  yield takeLatest(conditionTypesFetchRequested, fetchConditionTypes)
}

export default analyticsSaga

import { createSelector } from '@reduxjs/toolkit'
import some from 'lodash/some'

export default createSelector(
  [
    state => state.analytics.loadingDashboards,
    state => state.analytics.loadingMetricTypes,
    state => state.analytics.loadingThreatSignatures,
    state => state.analytics.loadingZones,
    state => state.analytics.loadingSites,
    state => state.analytics.loadingConditionTypes,
  ],
  (
    loadingDashboards,
    loadingMetricTypes,
    loadingThreatSignatures,
    loadingZones,
    loadingSites,
    loadingConditionTypes,
  ) =>
    some([
      loadingDashboards,
      loadingMetricTypes,
      loadingThreatSignatures,
      loadingZones,
      loadingSites,
      loadingConditionTypes,
    ]),
)

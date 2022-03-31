import { select, call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import map from 'lodash/map'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import differenceWith from 'lodash/differenceWith'
// src
import { createNotification } from 'redux/slices/notifications'
import { ActivityTypeEnum, SeverityTypeEnum } from 'enums'
import { pickKeyValues, msToUnix } from 'utils'
import {
  // alerts
  fetchAlertEventsRequested,
  fetchAlertEventsFetchSucceeded,
  fetchAlertEventsFetchFailed,
  fetchAlertEventRequested,
  fetchAlertEventFetchSucceeded,
  fetchAlertEventFetchFailed,
  acknowledgeRequested,
  acknowledgeRequestSucceeded,
  acknowledgeRequestFailed,
  acknowledgeEscalationRequested,
  acknowledgeEscalationSucceeded,
  acknowledgeEscalationFailed,
  resolveRequested,
  resolveSucceeded,
  resolveFailed,
  dismissAlertEventRequested,
  dismissAlertEventSucceeded,
  dismissAlertEventFailed,
  // setDismissModalClose,
  simulateAlertEventRequested,
  simulateAlertEventSucceeded,
  simulateAlertEventFailed,
  // activity logs
  fetchActivityLogsFetchRequested,
  fetchActivityLogsFetchSucceeded,
  fetchActivityLogsFetchFailed,
  // pulses
  alertEventsPulseRequested,
  alertEventsPulseSucceeded,
  alertEventsPulseFailed,
  activityLogsPulseFetchRequested,
  activityLogsPulseFetchSucceeded,
  activityLogsPulseFetchFailed,
} from 'components/NewsFeed/feedSlice'
import { createMutation, createQuery } from 'providers/apollo'

import {
  // ALERTS
  GET_ALERT_EVENTS,
  GET_ALERT_EVENT,
  ACKNOWLEDGE_ALERT_EVENT,
  ACKNOWLEDGE_ALERT_EVENT_ESCALATION,
  RESOLVE_ALERT_EVENT,
  SIMULATE_ALERT_EVENT,
  // ACTIVITY LOGS
  GET_ACTIVITY_LOGS,
  // POLL PULSES
  GET_ACTIVITY_LOGS_PULSE,
  GET_ALERTS_PULSE,
  DISMISS_ALERT_EVENT,
} from './gql'
import trackEventToMixpanel from '../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../enums'

function* fetchAlertEvents(action) {
  try {
    const { accountSlug, status, limit, severities, siteSlugs } = action.payload
    const response = yield call(createQuery, GET_ALERT_EVENTS, {
      accountSlug,
      siteSlugs,
      status,
      limit,
      severities,
    })

    yield put(
      fetchAlertEventsFetchSucceeded(response.data.alertEventsPaginated),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchAlertEventsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchAlertEvent(action) {
  try {
    const { alertEventId } = action.payload
    const response = yield call(createQuery, GET_ALERT_EVENT, { alertEventId })
    const alertEvent = get(response, 'data.getAlertEvent', {})
    yield put(fetchAlertEventFetchSucceeded({ alertEvent }))
  } catch (error) {
    const { message } = error
    yield put(fetchAlertEventFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* requestAcknowledge(action) {
  try {
    const { alertEventId, alertEventHash } = action.payload
    const response = yield call(createMutation, ACKNOWLEDGE_ALERT_EVENT, {
      alertEventId,
      alertEventHash,
    })
    const { ok, message } = response.data.acknowledgeAlertEvent
    yield put(acknowledgeRequestSucceeded({ ok, message, id: alertEventId }))
  } catch (error) {
    const { message } = error
    yield put(acknowledgeRequestFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* requestAcknowledgeEscalation(action) {
  try {
    const {
      alertEventId,
      alertEventHash,
      escalationLevelId,
      escalationContactId,
    } = action.payload

    yield call(createMutation, ACKNOWLEDGE_ALERT_EVENT_ESCALATION, {
      alertEventId,
      alertEventHash,
      escalationLevelId,
      escalationContactId,
    })
    yield put(acknowledgeEscalationSucceeded(alertEventId))
  } catch (error) {
    const { message } = error
    yield put(acknowledgeEscalationFailed(message))
    yield put(createNotification({ message }))
  }
}

function* resolveAlertEvent(action) {
  const {
    alertEventId,
    alertEventHash,
    escalationLevelId,
    escalationContactId,
  } = action.payload
  try {
    const response = yield call(createMutation, RESOLVE_ALERT_EVENT, {
      alertEventId,
      alertEventHash,
      escalationLevelId,
      escalationContactId,
    })
    const { message } = response.data.resolveAlertEvent
    yield put(resolveSucceeded({ alertEventId }))
    yield put(createNotification({ message }))
    yield call(trackEventToMixpanel, MixPanelEventEnum.ALERT_RESOLVED)
  } catch (error) {
    const { message } = error
    yield put(resolveFailed({ alertEventId, error: message }))
    yield put(createNotification({ message }))
  }
}

function* dismissAlertEvent(action) {
  try {
    const {
      alertEventId,
      alertEventHash,
      escalationLevelId,
      escalationContactId,
    } = action.payload
    const response = yield call(createMutation, DISMISS_ALERT_EVENT, {
      alertEventId,
      alertEventHash,
      escalationLevelId,
      escalationContactId,
    })
    const { message } = response.data.dismissAlertEvent
    yield put(dismissAlertEventSucceeded({ alertEventId }))
    // yield put(setDismissModalClose())
    yield put(createNotification({ message }))
    yield call(trackEventToMixpanel, MixPanelEventEnum.ALERT_DISMISSED)
  } catch (error) {
    const { message } = error
    yield put(dismissAlertEventFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* requestSimulateAlertEvent(action) {
  try {
    const {
      accountSlug,
      siteSlug,
      alertId,
      clip,
      autoVerify,
      audience,
    } = action.payload
    const response = yield call(createMutation, SIMULATE_ALERT_EVENT, {
      accountSlug,
      siteSlug,
      alertId,
      clip,
      autoVerify,
      audience,
    })
    const { ok, message } = response.data.simulateAlertEvent
    yield put(simulateAlertEventSucceeded({ ok, message }))
    if (action.notify) {
      yield put(createNotification({ message }))
    }
  } catch (error) {
    const { message } = error
    yield put(simulateAlertEventFailed({ message }))
    yield put(createNotification({ message }))
  }
}

// ACTIVITY LOGS

const buildActivitiesFilters = payload => {
  const { accountSlug, siteSlugs } = payload
  const severities = [
    SeverityTypeEnum.SEV_0,
    SeverityTypeEnum.SEV_1,
    SeverityTypeEnum.SEV_2,
  ]
  const endTs = msToUnix(Date.now())
  const startTs = endTs - 86400 // One Day
  return map(ActivityTypeEnum, type => ({
    accountSlug,
    siteSlugs,
    startTs,
    endTs,
    type,
    severities,
    maxItems: 10,
  }))
}

function* fetchActivities(action) {
  try {
    const { page, limit } = action.payload
    const response = yield call(createQuery, GET_ACTIVITY_LOGS, {
      page,
      limit,
      descending: true,
      filters: buildActivitiesFilters(action.payload),
    })
    yield put(
      fetchActivityLogsFetchSucceeded({
        ...response.data.activitiesPaginatedV2,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchActivityLogsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// PULSES

function* fetchAlertEventsPulse(action) {
  try {
    const alertEvents = yield select(state => state.feed.alertEvents)
    const { accountSlug, status, limit, severities, siteSlugs } = action.payload
    const response = yield call(createQuery, GET_ALERTS_PULSE, {
      accountSlug,
      siteSlugs,
      status,
      limit,
      severities,
    })

    const compareKeys = ['id']
    const existed = pickKeyValues(alertEvents, compareKeys)
    const newItems = pickKeyValues(
      get(response, 'data.alertEventsPaginated.alertEvents', []),
      compareKeys,
    )
    const diff = differenceWith(newItems, existed, isEqual)
    yield put(alertEventsPulseSucceeded())
    if (isEmpty(newItems)) {
      yield put(fetchAlertEventsFetchSucceeded({ alertEvents: [] }))
    } else if (!isEmpty(diff)) {
      yield put(fetchAlertEventsRequested(action.payload))
    }
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(alertEventsPulseFailed())
  }
}

function* fetchActivitiesPulse(action) {
  try {
    const activities = yield select(state => state.feed.activities)
    const { page, limit } = action.payload
    const response = yield call(createQuery, GET_ACTIVITY_LOGS_PULSE, {
      page,
      limit,
      descending: true,
      filters: buildActivitiesFilters(action.payload),
    })
    const compareKeys = ['id', '__typename']
    const existed = pickKeyValues(activities, compareKeys)
    const newItems = pickKeyValues(
      get(response, 'data.activitiesPaginatedV2.instances', []),
      compareKeys,
    )
    const diff = differenceWith(newItems, existed, isEqual)
    yield put(activityLogsPulseFetchSucceeded())
    if (isEmpty(newItems)) {
      yield put(fetchActivityLogsFetchSucceeded({ instances: [] }))
    } else if (!isEmpty(diff)) {
      yield put(fetchActivityLogsFetchRequested(action.payload))
    }
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(activityLogsPulseFetchFailed())
  }
}

function* feedSaga() {
  // ALERT EVENTS
  yield takeLatest(fetchAlertEventsRequested, fetchAlertEvents)
  yield takeLatest(fetchAlertEventRequested, fetchAlertEvent)
  yield takeEvery(acknowledgeRequested, requestAcknowledge)
  yield takeEvery(acknowledgeEscalationRequested, requestAcknowledgeEscalation)
  yield takeLatest(resolveRequested, resolveAlertEvent)
  yield takeLatest(dismissAlertEventRequested, dismissAlertEvent)
  // Allow concurrent requests
  yield takeEvery(simulateAlertEventRequested, requestSimulateAlertEvent)
  // ACTIVITY LOG
  yield takeLatest(fetchActivityLogsFetchRequested, fetchActivities)
  // PULSES
  yield takeLatest(alertEventsPulseRequested, fetchAlertEventsPulse)
  yield takeLatest(activityLogsPulseFetchRequested, fetchActivitiesPulse)
}

export default feedSaga

/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import findIndex from 'lodash/findIndex'
import omit from 'lodash/omit'
import get from 'lodash/get'
import { PANEL_ITEMS_LIMIT } from '../constants'

// import activities from './mock'

export const initialState = {
  // ALERT EVENTS
  alertEvents: [],
  alertsLoading: false,
  alertsPulseLoading: false,
  acknowledgeLoading: false,
  dismissLoading: false,
  dismissOpened: false,
  alertEventIdToDismiss: null,
  alertEventHashToDismiss: null,
  // ACTIVITY LOGS
  // activities,
  activities: [],
  activitiesLoading: false,
  activitiesPulseLoading: false,
  error: null,
}

const slice = createSlice({
  name: 'feed',
  initialState,

  reducers: {
    // alerts
    fetchAlertEventsRequested: state => {
      state.alertsLoading = true
    },
    fetchAlertEventsFetchSucceeded: (state, action) => {
      state.alertEvents = get(action.payload, 'alertEvents', [])
      state.alertsLoading = false
    },
    fetchAlertEventsFetchFailed: (state, action) => {
      state.alertsLoading = false
      state.error = action.payload.error
    },

    // alerts
    fetchAlertEventRequested: () => {},
    fetchAlertEventFetchSucceeded: (state, action) => {
      const newIndex = findIndex(state.alertEvents, {
        id: action.payload.alertEvent.id,
      })
      if (newIndex === -1) state.alertEvents.unshift(action.payload.alertEvent)
      if (state.alertEvents.length > PANEL_ITEMS_LIMIT) state.alertEvents.pop()
    },
    fetchAlertEventFetchFailed: () => {},

    acknowledgeRequested: state => {
      state.acknowledgeLoading = true
    },
    acknowledgeRequestSucceeded: () => {},
    acknowledgeRequestFailed: (state, action) => {
      state.acknowledgeLoading = false
      state.error = action.payload.error
    },

    acknowledgeEscalationRequested: state => {
      state.acknowledgeLoading = true
    },
    acknowledgeEscalationSucceeded: () => {},
    acknowledgeEscalationFailed: state => {
      state.acknowledgeLoading = false
    },

    resolveRequested: (state, action) => {
      const id = action.payload.alertEventId
      const index = findIndex(state.alertEvents, { id })
      state.alertEvents[index].resolveLoading = true
    },
    resolveSucceeded: (state, action) => {
      const id = action.payload.alertEventId
      const index = findIndex(state.alertEvents, { id })
      state.alertEvents.splice(index, 1)
    },
    resolveFailed: (state, action) => {
      const id = action.payload.alertEventId
      const index = findIndex(state.alertEvents, { id })
      state.alertEvents[index].resolveLoading = false
      state.error = action.payload.error
    },

    dismissAlertEventRequested: (state, action) => {
      state.dismissLoading = true
    },
    dismissAlertEventSucceeded: (state, action) => {
      const index = findIndex(state.alertEvents, {
        id: action.payload.alertEventId,
      })
      state.alertEvents.splice(index, 1)
      state.dismissLoading = false
    },
    dismissAlertEventFailed: (state, action) => {
      state.dismissLoading = false
      state.error = action.payload.error
    },

    // setDismissModalOpen: (state, action) => {
    //   state.dismissOpened = true
    //   state.alertEventIdToDismiss = action.payload.alertEventId
    //   state.alertEventHashToDismiss = action.payload.alertEventHash
    // },
    // setDismissModalClose: (state, action) => {
    //   state.dismissOpened = false
    //   state.alertEventIdToDismiss = null
    //   state.alertEventHashToDismiss = null
    // },

    simulateAlertEventRequested: () => {},
    simulateAlertEventSucceeded: () => {},
    simulateAlertEventFailed: () => {},

    removeAlert: (state, action) => {
      state.alertEvents = state.alertEvents.filter(
        alertEvent => alertEvent.id !== action.payload.alertEventId,
      )
    },

    // activity logs
    fetchActivityLogsFetchRequested: state => {
      state.activitiesLoading = true
    },
    fetchActivityLogsFetchSucceeded: (state, action) => {
      state.activitiesLoading = false
      state.activities = action.payload.instances
    },
    fetchActivityLogsFetchFailed: (state, action) => {
      state.activitiesLoading = false
      state.error = get(action, 'payload.error')
    },

    removeHighlight: (state, action) => {
      const indexHighlight = findIndex(state.activities, {
        id: get(action, 'payload.activity.id'),
        __typename: get(action, 'payload.activity.__typename'),
      })
      state.activities[indexHighlight] = omit(
        state.activities[indexHighlight],
        'highlightDuration',
      )
    },
    createOrUpdateActivity: (state, action) => {
      const newItemIndex = findIndex(state.activities, {
        id: get(action, 'payload.activity.id'),
        __typename: get(action, 'payload.activity.__typename'),
      })

      if (newItemIndex !== -1) {
        state.activities[newItemIndex] = get(action, 'payload.activity')
      } else {
        state.activities.unshift(get(action, 'payload.activity'))
      }
    },
    // pulses
    alertEventsPulseRequested: state => {
      state.alertsPulseLoading = true
    },
    alertEventsPulseSucceeded: state => {
      state.alertsPulseLoading = false
    },
    alertEventsPulseFailed: state => {
      state.alertsPulseLoading = false
    },

    activityLogsPulseFetchRequested: state => {
      state.activitiesPulseLoading = true
    },
    activityLogsPulseFetchSucceeded: state => {
      state.activitiesPulseLoading = false
    },
    activityLogsPulseFetchFailed: state => {
      state.activitiesPulseLoading = false
    },
  },
})

export const {
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

  // setDismissModalOpen,
  // setDismissModalClose,

  simulateAlertEventRequested,
  simulateAlertEventSucceeded,
  simulateAlertEventFailed,

  removeAlert,

  // activity logs
  fetchActivityLogsFetchRequested,
  fetchActivityLogsFetchSucceeded,
  fetchActivityLogsFetchFailed,

  removeHighlight,
  createOrUpdateActivity,

  // pulse
  alertEventsPulseRequested,
  alertEventsPulseSucceeded,
  alertEventsPulseFailed,

  activityLogsPulseFetchRequested,
  activityLogsPulseFetchSucceeded,
  activityLogsPulseFetchFailed,
} = slice.actions

export default slice.reducer

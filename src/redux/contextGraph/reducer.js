/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'
import {
  findIndex,
  isEmpty,
  filter,
  remove,
  reject,
  first,
  find,
  get,
  map,
} from 'lodash'

import {
  // ALERTS
  FETCH_ALERTS_REQUEST,
  FETCH_ALERTS_SUCCEEDED,
  FETCH_DEFAULT_ALERTS_REQUEST,
  FETCH_DEFAULT_ALERTS_SUCCEEDED,
  FETCH_DEFAULT_ALERTS_FAILED,
  FILTER_SEVERITY,
  FILTER_ACTIVE,
  THREAT_SIGNATURE_AUTOCOMPLETE_REQUEST,
  THREAT_SIGNATURE_AUTOCOMPLETE_SUCCEEDED,
  THREAT_SIGNATURE_AUTOCOMPLETE_FAILED,
  CREATE_ALERT_REQUEST,
  CREATE_ALERT_SUCCEEDED,
  CREATE_ALERT_FAILED,
  CREATE_DEFAULT_ALERT_REQUEST,
  CREATE_DEFAULT_ALERT_SUCCEEDED,
  DELETE_ALERT_REQUEST,
  DELETE_ALERT_SUCCEEDED,
  DELETE_ALERT_FAILED,
  TOGGLE_ALERT_STATUS_REQUEST,
  TOGGLE_ALERT_STATUS_SUCCEEDED,
  TOGGLE_ALERT_STATUS_FAILED,
  SET_CREATE_DEFAULT_ALERT_OPEN,
  SET_SEARCH,
  SET_HOVERED,
  TOGGLE_ACTIVE,
  SET_DETAILED,
  SET_CREATE_ALERT_OPEN,
  SET_THREAT_SIGNATURE_AUTOCOMPLETE_FLAT,
  TOGGLE_EDGES,
  UPDATE_ALERT_SNOOZE_SUCCEEDED,
  UPDATE_ALERT_STREAMS_SUCCEEDED,

  // SITES
  FETCH_SITES_REQUESTED,
  FETCH_SITES_SUCCEEDED,
  FETCH_SITES_FAILED,

  // STREAMS
  FETCH_STREAMS_REQUESTED,
  FETCH_STREAMS_SUCCEEDED,
  FETCH_STREAMS_FAILED,

  // REGIONS
  FETCH_REGIONS_REQUESTED,
  FETCH_REGIONS_SUCCEEDED,
  FETCH_REGIONS_FAILED,
  SET_HOVERED_REGION,
  TOGGLE_ACTIVE_REGION,

  // SECURITY PROFILES
  FETCH_REQUESTED,
  FETCH_SUCCEEDED,
  FETCH_FAILED,
  FETCH_DEFAULTS_REQUESTED,
  FETCH_DEFAULTS_SUCCEEDED,
  FETCH_DEFAULTS_FAILED,
  CREATE_REQUESTED,
  CREATE_SUCCEEDED,
  CREATE_FAILED,
  UPDATE_REQUESTED,
  UPDATE_SUCCEEDED,
  UPDATE_FAILED,
  REMOVE_REQUESTED,
  REMOVE_SUCCEEDED,
  REMOVE_FAILED,
  SAVE_THREAT_MODEL_REQUESTED,
  SAVE_THREAT_MODEL_SUCCEEDED,
  SAVE_THREAT_MODEL_FAILED,
  DELETE_ALERT,
  SELECT_SECURITY_PROFILE,
  SET_PREVIEW,
  UN_SET_PREVIEW,
} from './actionTypes'

export const initialState = {
  // ALERTS
  alerts: [],
  autocompleteFlat: true,
  autocompleteLoading: false,
  autocompleteTerms: [], // List of next terms you can type
  autocompleteThreatSignature: null, // If threat signature is "completed", this stores that object.

  createAlertOpen: false,
  createDefaultAlertOpen: false,
  createLoading: false,
  defaultAlerts: [],
  deleteLoading: false,
  detailed: null,
  editLoading: false,
  error: null,
  hoveredAlert: null,
  activeAlert: null,
  loading: false,
  search: '',
  siteSlug: null,
  showEdges: true,

  // FILTERS
  filterSeveritySelected: 'all',
  filterActiveSelected: 'all',

  // SITES
  sites: [],
  loadingSites: false,

  // STREAMS
  streams: [],
  loadingStreams: false,

  // REGIONS
  regions: [],
  loadingRegions: false,
  hoveredRegion: null,
  activeRegion: null,

  // SECURITY PROFILES
  securityProfiles: [],
  defaultProfiles: [],
  activeProfile: null,
  previewMode: false,
  creationLoading: false,
  updateLoading: false,
  saveThreatModelLoading: false,

  loadingSP: false,
  deleteSPLoading: false,
}

const contextGraphReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    // fetch alerts
    case FETCH_ALERTS_REQUEST:
      draft.loading = true
      return draft

    case FETCH_ALERTS_SUCCEEDED:
      draft.loading = false
      draft.alerts = action.payload.alerts
      return draft

    case FETCH_DEFAULT_ALERTS_REQUEST:
      draft.loading = true
      return draft

    case FETCH_DEFAULT_ALERTS_SUCCEEDED:
      draft.loading = false
      draft.defaultAlerts = action.payload.defaultAlerts
      return draft

    case FETCH_DEFAULT_ALERTS_FAILED:
      draft.loading = false
      return draft

    case FILTER_SEVERITY:
      draft.filterSeveritySelected = action.payload.value
      return draft

    case FILTER_ACTIVE:
      draft.filterActiveSelected = action.payload.value
      return draft

    case THREAT_SIGNATURE_AUTOCOMPLETE_REQUEST:
      draft.autocompleteLoading = true
      return draft

    case THREAT_SIGNATURE_AUTOCOMPLETE_SUCCEEDED:
      draft.autocompleteLoading = false
      draft.autocompleteTerms = action.payload.terms
      draft.autocompleteThreatSignature = action.payload.threatSignature
      return draft

    case THREAT_SIGNATURE_AUTOCOMPLETE_FAILED:
      draft.autocompleteLoading = false
      draft.error = action.payload.error
      return draft

    // alert edit
    case CREATE_ALERT_REQUEST:
      draft.createLoading = true
      return draft

    case CREATE_ALERT_SUCCEEDED:
      const tsAlert = get(action.payload, 'alert')
      if (tsAlert) {
        draft.alerts = draft.alerts.concat(tsAlert)
      }
      draft.createLoading = false
      return draft

    case CREATE_ALERT_FAILED:
      draft.createLoading = false
      return draft

    case CREATE_DEFAULT_ALERT_REQUEST:
      draft.loading = true
      return draft

    case CREATE_DEFAULT_ALERT_SUCCEEDED:
      draft.loading = false
      draft.createDefaultAlertOpen = false
      if (!isEmpty(action.payload.defaultAlert)) {
        draft.defaultAlerts.push(action.payload.defaultAlert)
      }
      return draft

    // alert delete
    case DELETE_ALERT_REQUEST:
      draft.deleteLoading = true
      return draft

    case DELETE_ALERT_SUCCEEDED:
      draft.deleteLoading = false
      draft.alerts = filter(
        draft.alerts,
        alert => alert.id !== action.payload.alert.id,
      )
      return draft

    case DELETE_ALERT_FAILED:
      draft.error = action.payload.error
      draft.deleteLoading = false
      return draft

    case TOGGLE_ALERT_STATUS_REQUEST:
      draft.editLoading = true
      return draft

    case TOGGLE_ALERT_STATUS_SUCCEEDED:
      draft.editLoading = false
      const toggleAlertStatusIndex = findIndex(draft.alerts, {
        id: action.payload.alert.id,
      })

      if (toggleAlertStatusIndex >= 0) {
        draft.alerts[toggleAlertStatusIndex].status =
          action.payload.alert.status
        draft.detailed = draft.alerts[toggleAlertStatusIndex]
      }
      return draft

    case TOGGLE_ALERT_STATUS_FAILED:
      draft.editLoading = false
      return draft

    case SET_SEARCH:
      draft.search = action.payload.search
      return draft

    case SET_HOVERED:
      draft.hoveredAlert = action.payload.threatSignatureId
      return draft

    case SET_DETAILED:
      const detailedIndex = findIndex(draft.alerts, {
        id: action.payload.id,
      })

      if (detailedIndex >= 0) {
        draft.detailed = draft.alerts[detailedIndex]
      }

      return draft

    case SET_CREATE_ALERT_OPEN:
      draft.createAlertOpen = action.payload.open
      return draft

    case SET_CREATE_DEFAULT_ALERT_OPEN:
      draft.createDefaultAlertOpen = action.payload.open
      return draft

    case TOGGLE_ACTIVE:
      if (action.payload.threatSignatureId === draft.active) {
        draft.activeAlert = null
      } else {
        draft.activeAlert = action.payload.threatSignatureId
      }
      return draft

    case SET_THREAT_SIGNATURE_AUTOCOMPLETE_FLAT:
      draft.autocompleteFlat = action.payload
      return draft

    case TOGGLE_EDGES:
      draft.showEdges = !draft.showEdges
      return draft

    case UPDATE_ALERT_SNOOZE_SUCCEEDED:
      const snoozeIndex = findIndex(draft.alerts, {
        id: action.payload.alert.id,
      })

      if (snoozeIndex >= 0) {
        draft.alerts[snoozeIndex].autoSnoozeSecs =
          action.payload.alert.autoSnoozeSecs
        draft.detailed.autoSnoozeSecs = action.payload.alert.autoSnoozeSecs
      }
      return draft

    case UPDATE_ALERT_STREAMS_SUCCEEDED:
      const streamIndex = findIndex(draft.alerts, {
        id: action.payload.alert.id,
      })

      if (streamIndex >= 0) {
        draft.alerts[streamIndex].defaultAlert.regions =
          action.payload.alert.defaultAlert.regions
        draft.alerts[streamIndex].streams = action.payload.alert.streams

        draft.detailed.defaultAlert.regions =
          action.payload.alert.defaultAlert.regions
        draft.detailed.streams = action.payload.alert.streams
      }
      return draft

    // SITES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    case FETCH_SITES_REQUESTED:
      draft.loadingSites = true
      return draft

    case FETCH_SITES_SUCCEEDED:
      draft.sites = action.payload.sites
      draft.loadingSites = false
      return draft

    case FETCH_SITES_FAILED:
      draft.loadingSites = false
      draft.error = action.payload.error
      return draft

    // STREAMS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    case FETCH_STREAMS_REQUESTED:
      draft.loadingStreams = true
      return draft

    case FETCH_STREAMS_SUCCEEDED:
      draft.streams = action.payload.streams
      draft.loadingStreams = false
      return draft

    case FETCH_STREAMS_FAILED:
      draft.loadingStreams = false
      draft.error = action.payload.error
      return draft

    // REGIONS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    case FETCH_REGIONS_REQUESTED:
      draft.loadingRegions = true
      return draft

    case FETCH_REGIONS_SUCCEEDED:
      draft.regions = action.payload.regions
      draft.loadingRegions = false
      return draft

    case FETCH_REGIONS_FAILED:
      draft.error = action.payload.error
      draft.loadingRegions = false
      return draft

    case SET_HOVERED_REGION:
      draft.hoveredRegion = action.payload.regionId
      return draft

    case TOGGLE_ACTIVE_REGION:
      if (action.payload.regionId === draft.active) {
        draft.activeRegion = null
      } else {
        draft.activeRegion = action.payload.regionId
      }
      return draft

    // SP ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // FETCH
    case FETCH_REQUESTED:
      draft.previewMode = false
      draft.loading = true
      return draft

    case FETCH_SUCCEEDED:
      draft.securityProfiles = action.payload.securityProfiles
      draft.activeProfile =
        find(action.payload.securityProfiles, { active: true }) ||
        first(action.payload.securityProfiles)
      draft.loading = false
      return draft

    case FETCH_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    // FETCH Default profiles
    case FETCH_DEFAULTS_REQUESTED:
      draft.loading = true
      return draft

    case FETCH_DEFAULTS_SUCCEEDED:
      draft.defaultProfiles = action.payload.defaultSecurityProfiles
      draft.loading = false
      return draft

    case FETCH_DEFAULTS_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    // CREATE
    case CREATE_REQUESTED:
      draft.creationLoading = true
      return draft

    case CREATE_SUCCEEDED:
      draft.securityProfiles.push(action.payload.securityProfile)
      draft.activeProfile = action.payload.securityProfile
      draft.creationLoading = false
      draft.previewMode = false
      return draft

    case CREATE_FAILED:
      draft.error = action.payload.error
      draft.creationLoading = false
      return draft

    // UPDATE
    case UPDATE_REQUESTED:
      draft.updateLoading = true
      return draft

    case UPDATE_SUCCEEDED:
      const index = findIndex(draft.securityProfiles, {
        id: get(action, 'payload.securityProfile.id'),
      })
      if (index !== -1) {
        draft.securityProfiles[index] = action.payload.securityProfile
        draft.activeProfile = action.payload.securityProfile
        draft.updateLoading = false
      }
      return draft

    case UPDATE_FAILED:
      draft.error = action.payload.error
      draft.updateLoading = false
      return draft

    // DELETE
    case REMOVE_REQUESTED:
      draft.deleteLoading = true
      return draft

    case REMOVE_SUCCEEDED:
      remove(draft.securityProfiles, { id: action.payload.id })
      draft.activeProfile = first(draft.securityProfiles)
      draft.deleteLoading = false
      return draft

    case REMOVE_FAILED:
      draft.deleteLoading = false
      return draft

    case SAVE_THREAT_MODEL_REQUESTED:
      draft.saveThreatModelLoading = true
      return draft

    case SAVE_THREAT_MODEL_SUCCEEDED:
      draft.saveThreatModelLoading = false
      draft.defaultProfiles.push({
        ...action.payload.defaultSecurityProfile,
        defaultAlerts: map(draft.alerts, 'defaultAlert'),
      })
      return draft

    case SAVE_THREAT_MODEL_FAILED:
      draft.saveThreatModelLoading = false
      return draft

    // other actions

    case DELETE_ALERT:
      const deleteAlertProfile = find(draft.securityProfiles, {
        id: draft.activeProfile.id,
      })
      deleteAlertProfile.alerts = reject(deleteAlertProfile.alerts, {
        id: action.payload.alert.id,
      })
      draft.activeProfile.alerts = reject(draft.activeProfile.alerts, {
        id: action.payload.alert.id,
      })
      return draft

    case SELECT_SECURITY_PROFILE:
      draft.activeProfile = action.payload.activeProfile
      return draft

    // SET PREVIEW
    case SET_PREVIEW:
      draft.activeProfile = action.payload.securityProfile
      draft.previewMode = true
      return draft

    case UN_SET_PREVIEW:
      draft.activeProfile =
        find(draft.securityProfiles, { active: true }) ||
        first(draft.securityProfiles)
      draft.previewMode = false
      return draft

    default:
      return draft
  }
})

export default contextGraphReducer

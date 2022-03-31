import {
  FETCH_ALERTS_REQUEST,
  FETCH_ALERTS_SUCCEEDED,
  FETCH_ALERTS_FAILED,
  FETCH_DEFAULT_ALERTS_REQUEST,
  FETCH_DEFAULT_ALERTS_SUCCEEDED,
  FETCH_DEFAULT_ALERTS_FAILED,
  FILTER_ACTIVE,
  FILTER_SEVERITY,
  THREAT_SIGNATURE_AUTOCOMPLETE_REQUEST,
  THREAT_SIGNATURE_AUTOCOMPLETE_SUCCEEDED,
  THREAT_SIGNATURE_AUTOCOMPLETE_FAILED,
  CREATE_DEFAULT_ALERT_REQUEST,
  CREATE_DEFAULT_ALERT_SUCCEEDED,
  CREATE_ALERT_REQUEST,
  CREATE_ALERT_SUCCEEDED,
  CREATE_ALERT_FAILED,
  DELETE_ALERT_REQUEST,
  DELETE_ALERT_SUCCEEDED,
  DELETE_ALERT_FAILED,
  TOGGLE_ALERT_STATUS_REQUEST,
  TOGGLE_ALERT_STATUS_SUCCEEDED,
  TOGGLE_ALERT_STATUS_FAILED,
  SET_SEARCH,
  SET_HOVERED,
  TOGGLE_ACTIVE,
  SET_DETAILED,
  SET_CREATE_ALERT_OPEN,
  SET_CREATE_DEFAULT_ALERT_OPEN,
  SET_THREAT_SIGNATURE_AUTOCOMPLETE_FLAT,
  TOGGLE_EDGES,
  UPDATE_ALERT_SNOOZE_REQUEST,
  UPDATE_ALERT_SNOOZE_SUCCEEDED,
  UPDATE_ALERT_STREAMS_REQUEST,
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
  FETCH_REGIONS_FAILED,
  FETCH_REGIONS_REQUESTED,
  FETCH_REGIONS_SUCCEEDED,
  SET_HOVERED_REGION,
  TOGGLE_ACTIVE_REGION,

  // SP
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

// START - COLLECTION FETCH
export const alertsFetchRequested = ({
  accountSlug,
  siteSlug,
  securityProfileId,
}) => {
  return {
    type: FETCH_ALERTS_REQUEST,
    payload: {
      accountSlug,
      siteSlug,
      securityProfileId,
    },
  }
}

export const alertsFetchSucceeded = alerts => {
  return {
    type: FETCH_ALERTS_SUCCEEDED,
    payload: {
      alerts,
    },
  }
}

export const alertsFetchFailed = payload => {
  return {
    type: FETCH_ALERTS_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const defaultAlertsFetchRequested = accountSlug => {
  return {
    type: FETCH_DEFAULT_ALERTS_REQUEST,
    payload: {
      accountSlug,
    },
  }
}

export const defaultAlertsFetchSucceeded = defaultAlerts => {
  return {
    type: FETCH_DEFAULT_ALERTS_SUCCEEDED,
    payload: {
      defaultAlerts,
    },
  }
}

export const defaultAlertsFetchFailed = ({ error }) => {
  return {
    type: FETCH_DEFAULT_ALERTS_FAILED,
    payload: {
      error,
    },
    error: true,
  }
}

export const filterActive = ({ value }) => {
  return {
    type: FILTER_ACTIVE,
    payload: { value },
  }
}

export const filterSeverity = ({ value }) => {
  return {
    type: FILTER_SEVERITY,
    payload: {
      value,
    },
  }
}

export const threatSignatureAutocompleteRequest = ({ terms, flat }) => {
  return {
    type: THREAT_SIGNATURE_AUTOCOMPLETE_REQUEST,
    payload: {
      terms,
      flat,
    },
  }
}

export const threatSignatureAutocompleteSucceeded = ({
  terms,
  threatSignature,
}) => {
  return {
    type: THREAT_SIGNATURE_AUTOCOMPLETE_SUCCEEDED,
    payload: {
      terms,
      threatSignature,
    },
  }
}

export const threatSignatureAutocompleteFailed = ({ error }) => {
  return {
    type: THREAT_SIGNATURE_AUTOCOMPLETE_FAILED,
    payload: {
      error,
    },
  }
}

// END - COLLECTION FETCH

// START - ALERT EDIT
export const createDefaultAlertRequested = ({
  accountSlug,
  regionIds,
  severity,
  threatSignatureId,
}) => {
  return {
    type: CREATE_DEFAULT_ALERT_REQUEST,
    payload: {
      accountSlug,
      regionIds,
      severity,
      threatSignatureId,
    },
  }
}

export const createDefaultAlertSucceeded = ({ defaultAlert, message }) => {
  return {
    type: CREATE_DEFAULT_ALERT_SUCCEEDED,
    payload: {
      defaultAlert,
      message,
    },
  }
}

export const createDefaultAlertFailed = ({ error }) => {
  return {
    type: CREATE_ALERT_FAILED,
    payload: {
      payload: error,
      error: true,
    },
  }
}

export const createAlertRequested = ({ defaultAlertId, securityProfileId }) => {
  return {
    type: CREATE_ALERT_REQUEST,
    payload: {
      defaultAlertId,
      securityProfileId,
    },
  }
}

export const createAlertSucceeded = alert => {
  return {
    type: CREATE_ALERT_SUCCEEDED,
    payload: {
      alert,
    },
  }
}

export const createAlertFailed = ({ error }) => {
  return {
    type: CREATE_ALERT_FAILED,
    payload: {
      error,
    },
  }
}
// END - ALERT EDIT

// START - ALERT DELETE
export const deleteAlertRequested = ({ id }) => {
  return {
    type: DELETE_ALERT_REQUEST,
    payload: {
      id,
    },
  }
}

export const deleteAlertSucceeded = ({ alert }) => {
  return {
    type: DELETE_ALERT_SUCCEEDED,
    payload: {
      alert,
    },
  }
}

export const deleteAlertFailed = ({ error }) => {
  return {
    type: DELETE_ALERT_FAILED,
    payload: {
      error,
    },
  }
}

export const toggleAlertStatusRequested = ({ id }) => {
  return {
    type: TOGGLE_ALERT_STATUS_REQUEST,
    payload: {
      id,
    },
  }
}

export const toggleAlertStatusSucceeded = ({ alert }) => {
  return {
    type: TOGGLE_ALERT_STATUS_SUCCEEDED,
    payload: {
      alert,
    },
  }
}

export const toggleAlertStatusFailed = ({ error }) => {
  return {
    type: TOGGLE_ALERT_STATUS_FAILED,
    payload: {
      error,
    },
  }
}

// END - ALERT DELETE

export const threatSignaturesSetSearch = ({ search }) => {
  return {
    type: SET_SEARCH,
    payload: {
      search,
    },
  }
}

export const threatSignatureAlertsSetHovered = threatSignatureId => {
  return {
    type: SET_HOVERED,
    payload: {
      threatSignatureId,
    },
  }
}

export const threatSignaturesToggleActive = threatSignatureId => {
  return {
    type: TOGGLE_ACTIVE,
    payload: {
      threatSignatureId,
    },
  }
}

export const threatSignatureAlertsSetDetailedView = id => {
  return {
    type: SET_DETAILED,
    payload: {
      id,
    },
  }
}

export const setThreatSignatureAutocompleteFlat = flat => {
  return {
    type: SET_THREAT_SIGNATURE_AUTOCOMPLETE_FLAT,
    payload: flat,
  }
}

export const setCreateAlertOpen = open => {
  return {
    type: SET_CREATE_ALERT_OPEN,
    payload: { open },
  }
}

export const setCreateDefaultAlertOpen = open => {
  return {
    type: SET_CREATE_DEFAULT_ALERT_OPEN,
    payload: { open },
  }
}

export const toggleEdges = () => {
  return {
    type: TOGGLE_EDGES,
  }
}

export const updateAlertSnoozeRequest = ({ alertId, autoSnoozeSecs }) => {
  return {
    type: UPDATE_ALERT_SNOOZE_REQUEST,
    payload: {
      alertId,
      autoSnoozeSecs,
    },
  }
}

export const updateAlertSnoozeSucceeded = alert => {
  return {
    type: UPDATE_ALERT_SNOOZE_SUCCEEDED,
    payload: {
      alert,
    },
  }
}

export const updateAlertStreamsRequest = ({
  alertId,
  securityProfileId,
  regions,
}) => {
  return {
    type: UPDATE_ALERT_STREAMS_REQUEST,
    payload: {
      alertId,
      securityProfileId,
      regions,
    },
  }
}

export const updateAlertStreamsSucceeded = alert => {
  return {
    type: UPDATE_ALERT_STREAMS_SUCCEEDED,
    payload: {
      alert,
    },
  }
}

// SITES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const fetchSitesRequested = (accountSlug = '') => {
  return {
    type: FETCH_SITES_REQUESTED,
    payload: {
      accountSlug,
    },
  }
}

export const fetchSitesSucceeded = sites => {
  return {
    type: FETCH_SITES_SUCCEEDED,
    payload: {
      sites,
    },
  }
}

export const fetchSitesFailed = payload => {
  return {
    type: FETCH_SITES_FAILED,
    payload: payload.error,
    error: true,
  }
}

// STREAMS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const streamsBySiteFetchRequested = ({
  accountSlug,
  siteSlug,
  regionId,
}) => {
  return {
    type: FETCH_STREAMS_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
      regionId,
    },
  }
}

export const streamsFetchSucceeded = streams => {
  return {
    type: FETCH_STREAMS_SUCCEEDED,
    payload: {
      streams,
    },
  }
}

export const streamsFetchFailed = payload => {
  return {
    type: FETCH_STREAMS_FAILED,
    payload: payload.error,
    error: true,
  }
}

// REGIONS ++++++++++++++++++++++++++++++

// START - COLLECTION FETCH
export const regionsFetchRequested = payload => {
  return {
    type: FETCH_REGIONS_REQUESTED,
    payload,
  }
}

export const regionsFetchSucceeded = regions => {
  return {
    type: FETCH_REGIONS_SUCCEEDED,
    payload: {
      regions,
    },
  }
}

export const regionsFetchFailed = payload => {
  return {
    type: FETCH_REGIONS_FAILED,
    payload: payload.error,
    error: true,
  }
}
// END - COLLECTION FETCH

export const regionsSetHovered = regionId => {
  return {
    type: SET_HOVERED_REGION,
    payload: {
      regionId,
    },
  }
}

export const regionsToggleActive = regionId => {
  return {
    type: TOGGLE_ACTIVE_REGION,
    payload: {
      regionId,
    },
  }
}

// SP ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// START - COLLECTION FETCH

export const securityProfilesFetchRequested = ({
  accountSlug,
  siteSlug,
  status,
}) => {
  return {
    type: FETCH_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
      status,
    },
  }
}

export const securityProfilesFetchSucceeded = securityProfiles => {
  return {
    type: FETCH_SUCCEEDED,
    payload: {
      securityProfiles,
    },
  }
}

export const securityProfilesFetchFailed = payload => {
  return {
    type: FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}

// END - COLLECTION FETCH

// START - DEFAULT FETCH

export const defaultSecurityProfilesFetchRequested = variables => {
  return {
    type: FETCH_DEFAULTS_REQUESTED,
    payload: {
      variables,
    },
  }
}

export const defaultSecurityProfilesFetchSucceeded = defaultSecurityProfiles => {
  return {
    type: FETCH_DEFAULTS_SUCCEEDED,
    payload: {
      defaultSecurityProfiles,
    },
  }
}

export const defaultSecurityProfilesFetchFailed = payload => {
  return {
    type: FETCH_DEFAULTS_FAILED,
    payload: payload.error,
    error: true,
  }
}

// END - DEFAULT FETCH

// START - CREATE ITEM

export const setPreview = securityProfile => {
  return {
    type: SET_PREVIEW,
    payload: {
      securityProfile,
    },
  }
}

export const unSetPreviewMode = () => {
  return {
    type: UN_SET_PREVIEW,
  }
}

export const securityProfileCreateRequested = ({
  accountSlug,
  siteSlug,
  name,
  status,
  defaultSecurityProfileId,
}) => {
  return {
    type: CREATE_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
      name,
      status,
      defaultSecurityProfileId,
    },
  }
}

export const securityProfileCreateSucceeded = ({ securityProfile }) => {
  return {
    type: CREATE_SUCCEEDED,
    payload: {
      securityProfile,
    },
  }
}

export const securityProfileCreateFailed = payload => {
  return {
    type: CREATE_FAILED,
    payload: payload.error,
    error: true,
  }
}
// END - CREATE ITEM

// START - UPDATE ITEM
export const securityProfileUpdateRequested = ({
  securityProfileId,
  name,
  status,
}) => {
  return {
    type: UPDATE_REQUESTED,
    payload: {
      securityProfileId,
      name,
      status,
    },
  }
}

export const securityProfileUpdateSucceeded = ({ securityProfile }) => {
  return {
    type: UPDATE_SUCCEEDED,
    payload: {
      securityProfile,
    },
  }
}

export const securityProfileUpdateFailed = payload => {
  return {
    type: UPDATE_FAILED,
    payload: payload.error,
    error: true,
  }
}
// END - UPDATE ITEM

// START - VIDEO WALL DESTROY
export const securityProfileDestroyRequested = id => {
  return {
    type: REMOVE_REQUESTED,
    payload: {
      id,
    },
  }
}

export const securityProfileDestroySucceeded = id => {
  return {
    type: REMOVE_SUCCEEDED,
    payload: {
      id,
    },
  }
}

export const securityProfileDestroyFailed = payload => {
  return {
    type: REMOVE_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const saveThreatModelRequested = ({
  securityProfileId,
  name,
  isPublic,
}) => {
  return {
    type: SAVE_THREAT_MODEL_REQUESTED,
    payload: {
      securityProfileId,
      name,
      isPublic,
    },
  }
}

export const saveThreatModelSucceeded = ({ defaultSecurityProfile }) => {
  return {
    type: SAVE_THREAT_MODEL_SUCCEEDED,
    payload: {
      defaultSecurityProfile,
    },
  }
}

export const saveThreatModelFailed = ({ error }) => {
  return {
    type: SAVE_THREAT_MODEL_FAILED,
    payload: { error },
    error: true,
  }
}
// START - VIDEO WALL DESTROY

export const deleteAlert = alert => {
  return {
    type: DELETE_ALERT,
    payload: {
      alert,
    },
  }
}

export const selectSecurityProfile = activeProfile => {
  return {
    type: SELECT_SECURITY_PROFILE,
    payload: {
      activeProfile,
    },
  }
}

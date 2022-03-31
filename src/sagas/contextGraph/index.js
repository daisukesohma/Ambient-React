import { call, put, takeLatest, debounce } from 'redux-saga/effects'

// src
import { createQuery, createMutation } from 'providers/apollo'
import {
  // ALERTS
  alertsFetchSucceeded,
  alertsFetchFailed,
  defaultAlertsFetchSucceeded,
  defaultAlertsFetchFailed,
  threatSignatureAutocompleteSucceeded,
  threatSignatureAutocompleteFailed,
  createAlertSucceeded,
  createAlertFailed,
  createDefaultAlertSucceeded,
  createDefaultAlertFailed,
  deleteAlertSucceeded,
  deleteAlertFailed,
  toggleAlertStatusSucceeded,
  toggleAlertStatusFailed,
  updateAlertSnoozeSucceeded,
  updateAlertStreamsSucceeded,
  // SITES
  fetchSitesSucceeded,
  fetchSitesFailed,
  // STREAMS
  streamsFetchSucceeded,
  streamsFetchFailed,
  // REGIONS
  regionsFetchSucceeded,
  regionsFetchFailed,
  // SP
  securityProfilesFetchSucceeded,
  securityProfilesFetchFailed,
  defaultSecurityProfilesFetchSucceeded,
  defaultSecurityProfilesFetchFailed,
  securityProfileCreateSucceeded,
  securityProfileCreateFailed,
  securityProfileUpdateSucceeded,
  securityProfileUpdateFailed,
  securityProfileDestroySucceeded,
  securityProfileDestroyFailed,
  deleteAlert as deleteAlertAction,
  saveThreatModelSucceeded,
  saveThreatModelFailed,
} from 'redux/contextGraph/actions'
import {
  // ALERTS
  FETCH_ALERTS_REQUEST,
  FETCH_DEFAULT_ALERTS_REQUEST,
  THREAT_SIGNATURE_AUTOCOMPLETE_REQUEST,
  CREATE_ALERT_REQUEST,
  CREATE_DEFAULT_ALERT_REQUEST,
  DELETE_ALERT_REQUEST,
  TOGGLE_ALERT_STATUS_REQUEST,
  UPDATE_ALERT_SNOOZE_REQUEST,
  UPDATE_ALERT_STREAMS_REQUEST,
  // SITES
  FETCH_SITES_REQUESTED,
  // STREAMS
  FETCH_STREAMS_REQUESTED,
  // REGIONS
  FETCH_REGIONS_REQUESTED,
  // SP
  FETCH_REQUESTED,
  FETCH_DEFAULTS_REQUESTED,
  SAVE_THREAT_MODEL_REQUESTED,
  CREATE_REQUESTED,
  UPDATE_REQUESTED,
  REMOVE_REQUESTED,
} from 'redux/contextGraph/actionTypes'
import { createNotification } from 'redux/slices/notifications'

import {
  // ALERTS
  GET_ALERTS,
  GET_DEFAULT_ALERTS,
  THREAT_SIGNATURE_AUTOCOMPLETE,
  CREATE_ALERT,
  CREATE_DEFAULT_ALERT,
  DELETE_ALERT,
  TOGGLE_ALERT_STATUS,
  UPDATE_ALERT_SNOOZE,
  UPDATE_ALERT_STREAMS,
  // SITES
  GET_SITES_BY_ACCOUNT,
  // STREAMS
  GET_STREAMS_BY_SITE,
  // REGIONS
  GET_ALL_REGIONS,
  // SP
  GET_SECURITY_PROFILES,
  GET_DEFAULT_PROFILES,
  CREATE_SECURITY_PROFILE,
  UPDATE_SECURITY_PROFILE,
  DELETE_SECURITY_PROFILE,
  SAVE_THREAT_MODEL,
} from './gql'

// ALERTS

function* fetchAlerts(action) {
  try {
    const { accountSlug, siteSlug, securityProfileId } = action.payload
    const response = yield call(createQuery, GET_ALERTS, {
      accountSlug,
      siteSlug,
      securityProfileId,
    })
    yield put(alertsFetchSucceeded(response.data.alerts))
  } catch (error) {
    const { message } = error
    yield put(alertsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchDefaultAlerts(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_DEFAULT_ALERTS, {
      accountSlug,
    })
    const { defaultAlerts } = response.data
    yield put(defaultAlertsFetchSucceeded(defaultAlerts))
  } catch (error) {
    const { message } = error
    yield put(defaultAlertsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* threatSignatureAutocomplete(action) {
  try {
    const { terms, flat } = action.payload
    const response = yield call(createQuery, THREAT_SIGNATURE_AUTOCOMPLETE, {
      terms,
      flat,
    })
    const data = response.data.threatSignatureAutocomplete
    yield put(
      threatSignatureAutocompleteSucceeded({
        terms: data.terms,
        threatSignature: data.threatSignature,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(threatSignatureAutocompleteFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createAlert(action) {
  try {
    const { defaultAlertId, securityProfileId } = action.payload
    const response = yield call(createMutation, CREATE_ALERT, {
      defaultAlertId,
      securityProfileId,
    })
    const { message } = response.data.createAlert
    yield put(createAlertSucceeded(response.data.createAlert.alert))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(createAlertFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createDefaultAlert(action) {
  try {
    const { threatSignatureId, regionIds, severity } = action.payload
    const response = yield call(createMutation, CREATE_DEFAULT_ALERT, {
      threatSignatureId,
      regionIds,
      severity,
    })
    const { defaultAlert, message } = response.data.createDefaultAlert
    yield put(createDefaultAlertSucceeded({ defaultAlert, message }))
    yield put(createNotification({ message }))
  } catch (error) {
    const { message } = error
    yield put(createDefaultAlertFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteAlert(action) {
  try {
    const { id } = action.payload
    const response = yield call(createMutation, DELETE_ALERT, { id })
    yield put(deleteAlertSucceeded({ alert: response.data.deleteAlert.alert }))
    yield put(
      createNotification({ message: response.data.deleteAlert.message }),
    )

    // TODO: check it
    yield put(deleteAlertAction(response.data.deleteAlert.alert))
  } catch (error) {
    const { message } = error
    yield put(deleteAlertFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* toggleAlertStatus(action) {
  try {
    const { id } = action.payload
    const response = yield call(createQuery, TOGGLE_ALERT_STATUS, { id })
    yield put(
      toggleAlertStatusSucceeded({
        alert: response.data.toggleAlertStatus.alert,
      }),
    )
    yield put(
      createNotification({
        message: response.data.toggleAlertStatus.message,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(toggleAlertStatusFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateAlertSnooze(action) {
  try {
    const response = yield call(
      createQuery,
      UPDATE_ALERT_SNOOZE,
      action.payload,
    )
    yield put(
      updateAlertSnoozeSucceeded(response.data.updateSnoozeOnAlert.alert),
    )
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
  }
}

function* updateAlertStreams(action) {
  try {
    const response = yield call(
      createQuery,
      UPDATE_ALERT_STREAMS,
      action.payload,
    )

    // get better message from backend
    if (response.data.updateRegionsOnAlert.ok) {
      yield put(
        updateAlertStreamsSucceeded(response.data.updateRegionsOnAlert.alert),
      )
    } else {
      yield put(
        createNotification({
          message: response.data.updateRegionsOnAlert.message,
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
  }
}

// SITES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function* fetchSites(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    yield put(fetchSitesSucceeded(response.data.allSitesByAccount))
  } catch (error) {
    const { message } = error
    yield put(fetchSitesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// STREAMS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function* fetchStreamsBySiteAndRegion(action) {
  try {
    const response = yield call(
      createQuery,
      GET_STREAMS_BY_SITE,
      action.payload,
    )
    yield put(streamsFetchSucceeded(response.data.streamsBySite))
  } catch (error) {
    const { message } = error
    yield put(streamsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// REGIONS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function* fetchResources(action) {
  try {
    const response = yield call(createQuery, GET_ALL_REGIONS, action.payload)
    yield put(regionsFetchSucceeded(response.data.allRegions || []))
  } catch (error) {
    const { message } = error
    yield put(regionsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// SP ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function* fetchSecurityProfiles(action) {
  try {
    const response = yield call(
      createQuery,
      GET_SECURITY_PROFILES,
      action.payload,
    )
    yield put(securityProfilesFetchSucceeded(response.data.securityProfiles))
  } catch (error) {
    const { message } = error
    yield put(securityProfilesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchDefaultSecurityProfiles(action) {
  try {
    if (action.payload.variables !== null) {
      const response = yield call(
        createQuery,
        GET_DEFAULT_PROFILES,
        action.payload.variables,
      )
      yield put(
        defaultSecurityProfilesFetchSucceeded(
          response.data.defaultSecurityProfiles,
        ),
      )
    } else {
      yield put(defaultSecurityProfilesFetchSucceeded([]))
    }
  } catch (error) {
    const { message } = error
    yield put(defaultSecurityProfilesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createSecurityProfile(action) {
  try {
    const response = yield call(
      createMutation,
      CREATE_SECURITY_PROFILE,
      action.payload,
    )
    yield put(
      securityProfileCreateSucceeded({
        securityProfile: response.data.createSecurityProfile.securityProfile,
      }),
    )
    yield put(
      createNotification({
        message: response.data.createSecurityProfile.message,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(securityProfileCreateFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateSecurityProfile(action) {
  try {
    const { securityProfileId, name, status } = action.payload
    const response = yield call(createMutation, UPDATE_SECURITY_PROFILE, {
      securityProfileId,
      name,
      status,
    })
    yield put(
      securityProfileUpdateSucceeded(response.data.updateSecurityProfile),
    )
  } catch (error) {
    const { message } = error
    yield put(securityProfileUpdateFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteSecurityProfile(action) {
  try {
    const { id } = action.payload
    const response = yield call(createMutation, DELETE_SECURITY_PROFILE, {
      securityProfileId: id,
    })
    yield put(securityProfileDestroySucceeded(id))
    yield put(
      createNotification({
        message: response.data.deleteSecurityProfile.message,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(securityProfileDestroyFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* saveThreatModel(action) {
  try {
    const { securityProfileId, name, isPublic } = action.payload
    const response = yield call(createMutation, SAVE_THREAT_MODEL, {
      securityProfileId,
      name,
      public: isPublic,
    })

    yield put(
      saveThreatModelSucceeded({
        defaultSecurityProfile:
          response.data.saveThreatModel.defaultSecurityProfile,
      }),
    )

    yield put(
      createNotification({
        message: response.data.saveThreatModel.message,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(saveThreatModelFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* threatSignatureSaga() {
  // ALERTS
  yield takeLatest(FETCH_ALERTS_REQUEST, fetchAlerts)
  yield takeLatest(FETCH_DEFAULT_ALERTS_REQUEST, fetchDefaultAlerts)
  yield takeLatest(
    THREAT_SIGNATURE_AUTOCOMPLETE_REQUEST,
    threatSignatureAutocomplete,
  )
  yield takeLatest(DELETE_ALERT_REQUEST, deleteAlert)
  yield takeLatest(CREATE_ALERT_REQUEST, createAlert)
  yield takeLatest(CREATE_DEFAULT_ALERT_REQUEST, createDefaultAlert)
  yield takeLatest(TOGGLE_ALERT_STATUS_REQUEST, toggleAlertStatus)

  yield debounce(500, UPDATE_ALERT_SNOOZE_REQUEST, updateAlertSnooze)
  yield takeLatest(UPDATE_ALERT_STREAMS_REQUEST, updateAlertStreams)

  // SITES
  yield takeLatest(FETCH_SITES_REQUESTED, fetchSites)

  // STREAMS
  yield takeLatest(FETCH_STREAMS_REQUESTED, fetchStreamsBySiteAndRegion)

  // REGIONS
  yield takeLatest(FETCH_REGIONS_REQUESTED, fetchResources)

  // SP
  yield takeLatest(FETCH_REQUESTED, fetchSecurityProfiles)
  yield takeLatest(FETCH_DEFAULTS_REQUESTED, fetchDefaultSecurityProfiles)
  yield takeLatest(CREATE_REQUESTED, createSecurityProfile)
  yield takeLatest(UPDATE_REQUESTED, updateSecurityProfile)
  yield takeLatest(REMOVE_REQUESTED, deleteSecurityProfile)
  yield takeLatest(SAVE_THREAT_MODEL_REQUESTED, saveThreatModel)
}

export default threatSignatureSaga

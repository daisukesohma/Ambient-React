import { call, put, takeLatest } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import map from 'lodash/map'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'

import {
  fetchSecurityProfilesRequested,
  fetchSecurityProfilesSucceeded,
  fetchSecurityProfilesFailed,
  fetchVerificationTypesRequested,
  fetchVerificationTypesSucceeded,
  fetchVerificationTypesFailed,
  fetchSeveritiesRequested,
  fetchSeveritiesSucceeded,
  fetchSeveritiesFailed,
  updateVerificationTypeOnAlertRequested,
  updateVerificationTypeOnAlertSucceeded,
  updateVerificationTypeOnAlertFailed,
  updateSevOnAlertRequested,
  updateSevOnAlertSucceeded,
  updateSevOnAlertFailed,
  disableAlertRequested,
  disableAlertSucceeded,
  disableAlertFailed,
  enableAlertRequested,
  enableAlertSucceeded,
  enableAlertFailed,
  createAlertRequested,
  createAlertSucceeded,
  createAlertFailed,
  deleteAlertRequested,
  deleteAlertSucceeded,
  deleteAlertFailed,
  resetStates,
} from '../redux/contextGraphAuditViewSlice'

import {
  CREATE_ALERT,
  DELETE_ALERT,
  DISABLE_ALERT,
  ENABLE_ALERT,
  GET_SECURITY_PROFILES,
  GET_SEVERITIES,
  GET_VERIFICATION_TYPES,
  UPDATE_SEV_ON_ALERT,
  UPDATE_VERIFICATION_TYPE,
} from './gql'

interface ActionType {
  payload: {
    accountSlug: string
    siteSlugs: string[] | null
  }
}

interface SecurityProfileType {
  id: number
  name: string
  alerts: {
    id: number
    severity: string
    verificationType: string
    verificationTypeOverride: string | null
    threatSignature: {
      verificationType: string
    }
    status: string
    defaultAlert: {
      id: number
      name: string
      severity: string
      threatSignature: {
        id: number
        name: string
      }
      regions: {
        id: number
        name: string
      }[]
    }
  }[]
}

function mergeDefaultAlerts(arr: any) {
  const grouped = groupBy(arr, 'id')
  const merged = map(grouped, g => {
    return reduce(g, (accumulated, current) => {
      return { ...accumulated, ...current }
    })
  })
  return merged
}

function* fetchSecurityProfiles(action: ActionType): SagaIterator {
  try {
    const { accountSlug, siteSlugs } = action.payload
    const { data } = yield call(createQuery, GET_SECURITY_PROFILES, {
      accountSlug,
      siteSlugs,
    })
    // gets all alerts from security profiles
    // filters out all security profile with empty alerts and security profiles with all alerts having no default alerts
    const filteredSecurityProfiles = filter(
      data.securityProfilesV2,
      (sp: SecurityProfileType) =>
        !isEmpty(sp.alerts) &&
        !isEmpty(filter(sp.alerts, alert => !isEmpty(alert.defaultAlert))),
    )
    const processedAlerts = map(
      filteredSecurityProfiles,
      (sp: SecurityProfileType) =>
        map(
          filter(sp.alerts, alert => !isEmpty(alert.defaultAlert)),
          alert => {
            const object: any = {}
            object.id = alert.defaultAlert.id
            object.name = alert.defaultAlert.name
            object.regions = alert.defaultAlert.regions
            object.severity = alert.defaultAlert.severity
            object.alertId = alert.id
            object[`${sp.id}`] = {
              verificationType: alert.verificationType,
              verificationTypeOverride: alert.verificationTypeOverride,
              id: alert.id,
              threatSignature: alert.threatSignature,
              severity: alert.severity,
              status: alert.status,
            }
            object.securityProfileId = sp.id
            return object
          },
        ),
    )
    const alerts = ([] as boolean[]).concat.apply([], processedAlerts)
    const defaultAlerts = mergeDefaultAlerts(alerts)
    yield put(
      fetchSecurityProfilesSucceeded({
        securityProfiles: data.securityProfilesV2,
        defaultAlerts,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchSecurityProfilesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchVerificationTypes(): SagaIterator {
  try {
    const { data } = yield call(createQuery, GET_VERIFICATION_TYPES)
    const vt = map(data.verificationTypes, sev => {
      return {
        label: sev.name,
        value: sev.key,
      }
    })
    yield put(
      fetchVerificationTypesSucceeded({
        verificationTypes: vt,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchVerificationTypesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchSeverities(): SagaIterator {
  try {
    const { data } = yield call(createQuery, GET_SEVERITIES)
    const sevs = map(data.severities, sev => {
      return {
        label: sev.name,
        value: sev.key,
      }
    })
    yield put(fetchSeveritiesSucceeded({ severities: sevs }))
  } catch (error) {
    const { message } = error
    yield put(fetchSeveritiesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateSevOnAlert(action: {
  payload: {
    alertId: number
    severity: string
    securityProfileId: number
  }
}): SagaIterator {
  try {
    const { alertId, severity, securityProfileId } = action.payload
    const { data } = yield call(createMutation, UPDATE_SEV_ON_ALERT, {
      alertId,
      severity,
      securityProfileId,
    })
    if (data.updateSevOnAlert.ok) {
      const {
        verificationType,
        verificationTypeOverride,
        id,
        threatSignature,
        severity: updatedSeverity,
        status,
      } = data.updateSevOnAlert.alert
      const alert = {
        verificationType,
        id,
        verificationTypeOverride,
        threatSignature,
        severity: updatedSeverity,
        status,
      }
      yield put(
        updateSevOnAlertSucceeded({
          defaultAlertId: data.updateSevOnAlert.alert.defaultAlert.id,
          alert,
          securityProfileId,
        }),
      )
      yield put(resetStates())
    } else {
      yield put(
        updateSevOnAlertFailed({ error: data.updateSevOnAlert.message }),
      )
      yield put(resetStates())
      yield put(createNotification({ message: data.updateSevOnAlert.message }))
    }
  } catch (error) {
    const { message } = error
    yield put(updateSevOnAlertFailed({ error: message }))
    yield put(resetStates())
    yield put(createNotification({ message }))
  }
}

function* updateVerificationTypeOnAlert(action: {
  payload: {
    alertId: number
    verificationType: string | null
    securityProfileId: number
  }
}): SagaIterator {
  try {
    const { alertId, verificationType, securityProfileId } = action.payload
    const { data } = yield call(createMutation, UPDATE_VERIFICATION_TYPE, {
      alertId,
      verificationTypeOverride: verificationType,
    })
    if (data.updateVerificationTypeOnAlert.ok) {
      const {
        verificationType: updatedVerificationType,
        id,
        threatSignature,
        severity,
        status,
        verificationTypeOverride,
      } = data.updateVerificationTypeOnAlert.alert
      const alert = {
        verificationType: updatedVerificationType,
        id,
        threatSignature,
        severity,
        status,
        verificationTypeOverride,
      }
      yield put(
        updateVerificationTypeOnAlertSucceeded({
          defaultAlertId:
            data.updateVerificationTypeOnAlert.alert.defaultAlert.id,
          alert,
          securityProfileId,
        }),
      )
      yield put(resetStates())
    } else {
      yield put(
        updateVerificationTypeOnAlertFailed({
          error: data.updateVerificationTypeOnAlert.message,
        }),
      )
      yield put(resetStates())
      yield put(
        createNotification({
          message: data.updateVerificationTypeOnAlert.message,
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(updateVerificationTypeOnAlertFailed({ error: message }))
    yield put(resetStates())
    yield put(createNotification({ message }))
  }
}

function* enableAlert(action: {
  payload: { id: number; status: string; securityProfileId: number }
}): SagaIterator {
  try {
    const { id, status, securityProfileId } = action.payload
    const { data } = yield call(createMutation, ENABLE_ALERT, {
      id,
      status,
    })
    if (data.enableAlert.ok) {
      const {
        verificationType,
        id: enabledId,
        threatSignature,
        severity,
        status: enabledStatus,
        verificationTypeOverride,
      } = data.enableAlert.alert
      const alert = {
        verificationType,
        id: enabledId,
        threatSignature,
        severity,
        status: enabledStatus,
        verificationTypeOverride,
      }
      yield put(
        enableAlertSucceeded({
          defaultAlertId: data.enableAlert.alert.defaultAlert.id,
          alert,
          securityProfileId,
        }),
      )
      yield put(resetStates())
    } else {
      yield put(enableAlertFailed({ error: data.enableAlert.message }))
      yield put(resetStates())
      yield put(createNotification({ message: data.enableAlert.message }))
    }
  } catch (error) {
    const { message } = error
    yield put(enableAlertFailed({ error: message }))
    yield put(resetStates())
    yield put(createNotification({ message }))
  }
}

function* disableAlert(action: {
  payload: { id: number; securityProfileId: number }
}): SagaIterator {
  try {
    const { id, securityProfileId } = action.payload
    const { data } = yield call(createMutation, DISABLE_ALERT, {
      id,
    })
    if (data.disableAlert.ok) {
      const {
        verificationType,
        id: disabledId,
        threatSignature,
        severity,
        status,
        verificationTypeOverride,
      } = data.disableAlert.alert
      const alert = {
        verificationType,
        id: disabledId,
        threatSignature,
        severity,
        status,
        verificationTypeOverride,
      }
      yield put(
        disableAlertSucceeded({
          defaultAlertId: data.disableAlert.alert.defaultAlert.id,
          alert,
          securityProfileId,
        }),
      )
      yield put(resetStates())
    } else {
      yield put(disableAlertFailed({ error: data.disableAlert.message }))
      yield put(resetStates())
      yield put(createNotification({ message: data.disableAlert.message }))
    }
  } catch (error) {
    const { message } = error
    yield put(disableAlertFailed({ error: message }))
    yield put(resetStates())
    yield put(createNotification({ message }))
  }
}

function* createAlert(action: {
  payload: {
    defaultAlertId: number
    securityProfileId: number
  }
}): SagaIterator {
  try {
    const { defaultAlertId, securityProfileId } = action.payload
    const { data } = yield call(createMutation, CREATE_ALERT, {
      defaultAlertId,
      securityProfileId,
    })
    if (data.createAlert.ok) {
      const {
        verificationType,
        id,
        threatSignature,
        severity,
        status,
        verificationTypeOverride,
      } = data.createAlert.alert
      const alert = {
        verificationType,
        id,
        threatSignature,
        severity,
        status,
        verificationTypeOverride,
      }
      yield put(
        createAlertSucceeded({
          defaultAlertId: data.createAlert.alert.defaultAlert.id,
          alert,
          securityProfileId,
        }),
      )
      yield put(resetStates())
    } else {
      yield put(createAlertFailed({ error: data.createAlert.message }))
      yield put(resetStates())
      yield put(createNotification({ message: data.createAlert.message }))
    }
  } catch (error) {
    const { message } = error
    yield put(createAlertFailed({ error: message }))
    yield put(resetStates())
    yield put(createNotification({ message }))
  }
}

function* deleteAlert(action: {
  payload: { id: number; securityProfileId: number }
}): SagaIterator {
  try {
    const { id, securityProfileId } = action.payload
    const { data } = yield call(createMutation, DELETE_ALERT, {
      id,
    })
    if (data.deleteAlert.ok) {
      const {
        verificationType,
        id: deletedAlert,
        threatSignature,
        severity,
        status,
        verificationTypeOverride,
      } = data.deleteAlert.alert
      const alert = {
        verificationType,
        id: deletedAlert,
        threatSignature,
        severity,
        status,
        verificationTypeOverride,
      }
      yield put(
        deleteAlertSucceeded({
          defaultAlertId: data.deleteAlert.alert.defaultAlert.id,
          alert,
          securityProfileId,
        }),
      )
      yield put(resetStates())
    } else {
      yield put(deleteAlertFailed({ error: data.deleteAlert.message }))
      yield put(resetStates())
      yield put(createNotification({ message: data.deleteAlert.message }))
    }
  } catch (error) {
    const { message } = error
    yield put(deleteAlertFailed({ error: message }))
    yield put(resetStates())
    yield put(createNotification({ message }))
  }
}

function* contextGraphAuditViewSaga(): SagaIterator {
  yield takeLatest(fetchSecurityProfilesRequested, fetchSecurityProfiles)
  yield takeLatest(fetchVerificationTypesRequested, fetchVerificationTypes)
  yield takeLatest(fetchSeveritiesRequested, fetchSeverities)
  yield takeLatest(updateSevOnAlertRequested, updateSevOnAlert)
  yield takeLatest(
    updateVerificationTypeOnAlertRequested,
    updateVerificationTypeOnAlert,
  )
  yield takeLatest(enableAlertRequested, enableAlert)
  yield takeLatest(disableAlertRequested, disableAlert)
  yield takeLatest(createAlertRequested, createAlert)
  yield takeLatest(deleteAlertRequested, deleteAlert)
}

export default contextGraphAuditViewSaga

/* eslint-disable no-throw-literal */
import { select, call, put, takeLatest } from 'redux-saga/effects'
import map from 'lodash/map'
import _filter from 'lodash/filter'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
// src
import { createQueryV2, createMutationV2 } from 'providers/apollo'
import {
  activityLogsFetchRequested,
  activityLogsFetchSucceeded,
  activityLogsFetchFailed,
  fetchDownloadLinkRequested,
  fetchDownloadLinkSucceeded,
  fetchDownloadReset,
  accessAlarmsRegexFetchRequested,
  accessAlarmsRegexFetchSucceeded,
  accessAlarmsRegexFetchFailed,
  createAccessAlarmTypeCastRequested,
  createAccessAlarmTypeCastSucceeded,
  createAccessAlarmTypeCastFailed,
  updateAccessAlarmTypeCastRequested,
  updateAccessAlarmTypeCastSucceeded,
  updateAccessAlarmTypeCastFailed,
  getAccessAlarmTypeCastByIdRequested,
  getAccessAlarmTypeCastByIdSucceeded,
  getAccessAlarmTypeCastByIdFailed,
  getStreamsRequested,
  getStreamsSucceeded,
  getStreamsFailed,
  getSecurityProfilesRequested,
  getSecurityProfilesSucceeded,
  getSecurityProfilesFailed,
  fetchAccessAlarmTypesRequested,
  fetchAccessAlarmTypesSucceeded,
  fetchAccessAlarmTypesFailed,
  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,
  UI_FILTER_PROPS,
} from 'pages/ActivityLog/activityLogSlice'
import { createNotification } from 'redux/slices/notifications'

import {
  GET_ACTIVITY_LOGS,
  DOWNLOAD_ACTIVITY_LOGS,
  GET_ACCESS_ALARMS_REGEX,
  CREATE_ACCESS_ALARM_TYPE_CAST,
  UPDATE_ACCESS_ALARM_TYPE_CAST,
  GET_ACCESS_ALARM_TYPE_CAST_BY_ID,
  GET_STREAMS,
  GET_ACCESS_ALARM_TYPES,
  GET_THREAT_SIGNATURES,
  GET_SECURITY_PROFILES,
} from './gql'

function* fetchActivityLogs(action) {
  const { accountSlug, limit } = action.payload
  try {
    const page = yield select(state => state.activityLog.page)
    const storedFilters = yield select(state => state.activityLog.filters)
    const filters = map(_filter(storedFilters, { active: true }), filter => {
      const res = omit(filter, UI_FILTER_PROPS)
      res.accountSlug = accountSlug
      return res
    })
    if (isEmpty(filters)) {
      yield put(activityLogsFetchFailed({ error: null }))
    } else {
      const response = yield call(createQueryV2, GET_ACTIVITY_LOGS, {
        page: page + 1,
        limit,
        filters,
        descending: true,
      })
      yield put(activityLogsFetchSucceeded(response.data.activitiesPaginatedV2))
    }
  } catch (error) {
    const { message } = error
    yield put(activityLogsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchDownloadLink(action) {
  const { accountSlug } = action.payload

  try {
    const storedFilters = yield select(state => state.activityLog.filters)
    const filters = map(_filter(storedFilters, { active: true }), filter => {
      const res = omit(filter, UI_FILTER_PROPS)
      res.accountSlug = accountSlug
      return res
    })
    const response = yield call(createMutationV2, DOWNLOAD_ACTIVITY_LOGS, {
      data: { filters },
    })
    const { link } = response.data.downloadActivities
    if (link) {
      yield put(fetchDownloadLinkSucceeded({ link }))
    } else {
      const message = 'Failed to download data. Please try again later.'
      yield put(fetchDownloadReset())
      yield put(createNotification({ message }))
    }
  } catch (error) {
    const { message } = error
    yield put(fetchDownloadReset())
    yield put(createNotification({ message }))
  }
}

function* fetchAccessAlarmsRegex(action) {
  const { accountSlug, regex, page, limit } = action.payload
  try {
    const response = yield call(createQueryV2, GET_ACCESS_ALARMS_REGEX, {
      accountSlug,
      regex,
      page,
      limit,
    })
    yield put(
      accessAlarmsRegexFetchSucceeded(
        response.data.getAccessAlarmsMatchingRegexPaginated,
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(accessAlarmsRegexFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createAccessAlarmTypeCast(action) {
  const { accountSlug, regex, accessAlarmType } = action.payload
  try {
    yield call(createMutationV2, CREATE_ACCESS_ALARM_TYPE_CAST, {
      input: { accountSlug, regex, accessAlarmType },
    })
    yield put(createAccessAlarmTypeCastSucceeded({ ok: true }))
    yield put(
      createNotification({
        message: 'Created access alarm type cast successfully!',
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(createAccessAlarmTypeCastFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateAccessAlarmTypeCast(action) {
  const {
    accountSlug,
    regex,
    accessAlarmType,
    accessAlarmTypeCastId,
  } = action.payload
  try {
    yield call(createMutationV2, UPDATE_ACCESS_ALARM_TYPE_CAST, {
      input: {
        accountSlug,
        regex,
        accessAlarmType,
        accessAlarmTypeCastId,
      },
    })
    yield put(updateAccessAlarmTypeCastSucceeded({ ok: true }))
    yield put(
      createNotification({
        message: 'Updated access alarm type cast successfully!',
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(updateAccessAlarmTypeCastFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* requestAccessAlarmTypes() {
  try {
    const response = yield call(createQueryV2, GET_ACCESS_ALARM_TYPES)
    yield put(fetchAccessAlarmTypesSucceeded(response.data.getAccessAlarmTypes))
  } catch (error) {
    const { message } = error
    yield put(fetchAccessAlarmTypesFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* getAccessAlarmTypeCastById(action) {
  const { accessAlarmTypeCastId } = action.payload
  try {
    const response = yield call(
      createQueryV2,
      GET_ACCESS_ALARM_TYPE_CAST_BY_ID,
      {
        accessAlarmTypeCastId,
      },
    )
    yield put(
      getAccessAlarmTypeCastByIdSucceeded(response.data.getAccessAlarmTypeCast),
    )
  } catch (error) {
    const { message } = error
    yield put(getAccessAlarmTypeCastByIdFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* requestStreams(action) {
  const { accountSlug, siteSlugs, appointment } = action.payload
  try {
    let streams
    if (isEmpty(siteSlugs)) {
      streams = []
    } else {
      const responses = yield call(createQueryV2, GET_STREAMS, {
        accountSlug,
        siteSlugs,
        incognito: false,
      })
      streams = responses.data.streamsV2
    }

    yield put(getStreamsSucceeded({ streams, appointment }))
  } catch (error) {
    const { message } = error
    yield put(getStreamsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* requestThreatSignatures(action) {
  const { accountSlug } = action.payload
  try {
    const responses = yield call(createQueryV2, GET_THREAT_SIGNATURES, {
      accountSlug,
      alertStatusTypes: ['ACTIVE', 'DELETED', 'DISABLED'],
    })
    const threatSignatures = responses.data.getDeployedThreatSignatures
    yield put(fetchThreatSignaturesSucceeded({ threatSignatures }))
  } catch (error) {
    const { message } = error
    yield put(fetchThreatSignaturesFailed({ message }))
    yield put(createNotification({ message }))
  }
}

function* requestSecurityProfiles(action) {
  const { accountSlug, siteSlugs, appointment } = action.payload
  try {
    const responses = yield call(createQueryV2, GET_SECURITY_PROFILES, {
      accountSlug,
      siteSlugs,
    })
    const securityProfiles = responses.data.securityProfilesV2
    yield put(getSecurityProfilesSucceeded({ securityProfiles, appointment }))
  } catch (error) {
    const { message } = error
    yield put(getSecurityProfilesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* activityLogSaga() {
  yield takeLatest(activityLogsFetchRequested, fetchActivityLogs)
  yield takeLatest(fetchDownloadLinkRequested, fetchDownloadLink)
  yield takeLatest(accessAlarmsRegexFetchRequested, fetchAccessAlarmsRegex)
  yield takeLatest(
    createAccessAlarmTypeCastRequested,
    createAccessAlarmTypeCast,
  )
  yield takeLatest(
    updateAccessAlarmTypeCastRequested,
    updateAccessAlarmTypeCast,
  )
  yield takeLatest(
    getAccessAlarmTypeCastByIdRequested,
    getAccessAlarmTypeCastById,
  )
  yield takeLatest(getStreamsRequested, requestStreams)
  yield takeLatest(getSecurityProfilesRequested, requestSecurityProfiles)
  yield takeLatest(fetchAccessAlarmTypesRequested, requestAccessAlarmTypes)
  yield takeLatest(fetchThreatSignaturesRequested, requestThreatSignatures)
}

export default activityLogSaga

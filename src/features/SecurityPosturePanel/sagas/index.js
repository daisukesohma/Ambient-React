import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'

import {
  createThreatSignaturePausePeriodRequested,
  createThreatSignaturePausePeriodSucceeded,
  createThreatSignaturePausePeriodFailed,
  getThreatSignaturePausePeriodsRequested,
  getThreatSignaturePausePeriodsSucceeded,
  getThreatSignaturePausePeriodsFailed,
  getThreatSignaturePausePeriodRequested,
  getThreatSignaturePausePeriodSucceeded,
  getThreatSignaturePausePeriodFailed,
  cancelThreatSignaturePausePeriodRequested,
  cancelThreatSignaturePausePeriodSucceeded,
  cancelThreatSignaturePausePeriodFailed,
  getStreamsWithThreatSignatureRequested,
  getStreamsWithThreatSignatureSucceeded,
  getStreamsWithThreatSignatureFailed,
  getAllThreatSignaturesBySiteRequested,
  getAllThreatSignaturesBySiteSucceeded,
  getAllThreatSignaturesBySiteFailed,
  clearOptions,
  toggleModal,
  closeModal,
} from '../securityPosturePanelSlice'

import {
  CREATE_THREAT_SIGNATURE_PAUSE_PERIOD,
  GET_THREAT_SIGNATURE_PAUSE_PERIODS,
  GET_THREAT_SIGNATURE_PAUSE_PERIOD,
  CANCEL_THREAT_SIGNATURE_PAUSE_PERIOD,
  GET_STREAMS_WITH_THREAT_SIGNATURE,
  GET_DEPLOYED_THREAT_SIGNATURES,
} from './gql'

function* createThreatSignaturePausePeriod(action) {
  try {
    const {
      streamIds,
      threatSignatureId,
      accountSlug,
      siteSlug,
      duration,
      description,
    } = action.payload

    const response = yield call(
      createMutation,
      CREATE_THREAT_SIGNATURE_PAUSE_PERIOD,
      {
        input: {
          streamIds,
          threatSignatureId,
          siteSlug,
          accountSlug,
          duration,
          description,
        },
      },
    )
    yield put(
      createThreatSignaturePausePeriodSucceeded(
        response.data.createThreatSignaturePausePeriod,
      ),
    )
    yield put(
      getThreatSignaturePausePeriodsRequested({
        accountSlug,
        afterCreation: true,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(createThreatSignaturePausePeriodFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* getThreatSignaturePausePeriods(action) {
  try {
    const { accountSlug, afterCreation } = action.payload
    const response = yield call(
      createQuery,
      GET_THREAT_SIGNATURE_PAUSE_PERIODS,
      {
        accountSlug,
      },
    )
    yield put(
      getThreatSignaturePausePeriodsSucceeded(
        response.data.getThreatSignaturePausePeriods,
      ),
    )
    // Close modal if it is after creation
    if (afterCreation) {
      yield put(closeModal())
      yield put(clearOptions())
    }
  } catch (error) {
    const { message } = error
    yield put(getThreatSignaturePausePeriodsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* getThreatSignaturePausePeriod(action) {
  try {
    const { threatSignaturePausePeriodId } = action.payload
    const response = yield call(
      createQuery,
      GET_THREAT_SIGNATURE_PAUSE_PERIOD,
      {
        threatSignaturePausePeriodId,
      },
    )
    yield put(
      getThreatSignaturePausePeriodSucceeded(
        response.data.getThreatSignaturePausePeriod,
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(getThreatSignaturePausePeriodFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* cancelThreatSignaturePausePeriod(action) {
  try {
    const {
      threatSignaturePausePeriodId,
      cancelledDescription,
    } = action.payload
    const { accountSlug } = action.payload
    const response = yield call(
      createMutation,
      CANCEL_THREAT_SIGNATURE_PAUSE_PERIOD,
      {
        input: {
          threatSignaturePausePeriodId,
          cancelledDescription,
        },
      },
    )
    yield put(
      cancelThreatSignaturePausePeriodSucceeded(
        response.data.cancelThreatSignaturePausePeriod,
      ),
    )
    yield put(getThreatSignaturePausePeriodsRequested({ accountSlug }))
  } catch (error) {
    const { message } = error
    yield put(
      cancelThreatSignaturePausePeriodFailed({
        error: message,
        id: action.payload.threatSignaturePausePeriodId,
      }),
    )
    yield put(createNotification({ message }))
  }
}

function* getStreamsWithThreatSignature(action) {
  try {
    const { threatSignatureId, accountSlug, siteSlugs } = action.payload
    const response = yield call(
      createQuery,
      GET_STREAMS_WITH_THREAT_SIGNATURE,
      {
        threatSignatureId,
        accountSlug,
        siteSlugs,
      },
    )
    yield put(
      getStreamsWithThreatSignatureSucceeded(
        response.data.getStreamsWithThreatSignature,
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(getStreamsWithThreatSignatureFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* getAllThreatSignaturesBySite(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const response = yield call(createQuery, GET_DEPLOYED_THREAT_SIGNATURES, {
      accountSlug,
      siteSlug,
    })
    yield put(
      getAllThreatSignaturesBySiteSucceeded(
        response.data.getDeployedThreatSignatures,
      ),
    )
  } catch (error) {
    const { message } = error
    yield put(getAllThreatSignaturesBySiteFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* securityPosterPanel() {
  yield takeLatest(
    createThreatSignaturePausePeriodRequested,
    createThreatSignaturePausePeriod,
  )
  yield takeLatest(
    getThreatSignaturePausePeriodsRequested,
    getThreatSignaturePausePeriods,
  )
  yield takeLatest(
    getThreatSignaturePausePeriodRequested,
    getThreatSignaturePausePeriod,
  )
  yield takeLatest(
    cancelThreatSignaturePausePeriodRequested,
    cancelThreatSignaturePausePeriod,
  )
  yield takeLatest(
    getStreamsWithThreatSignatureRequested,
    getStreamsWithThreatSignature,
  )
  yield takeLatest(
    getAllThreatSignaturesBySiteRequested,
    getAllThreatSignaturesBySite,
  )
}

export default securityPosterPanel

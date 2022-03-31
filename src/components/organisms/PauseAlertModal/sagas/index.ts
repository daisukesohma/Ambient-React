import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects'
// src
import { createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import { getThreatSignaturePausePeriodsRequested } from 'features/SecurityPosturePanel/securityPosturePanelSlice'
import { openAlertSnackbar } from 'components/organisms/AlertSnackbar/redux/alertSnackbarSlice'
import { get } from 'lodash'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import MixPanelEventEnum from 'enums/MixPanelEventEnum'

import {
  pauseAlertThreatSignaturePeriodRequested,
  pauseAlertThreatSignaturePeriodSucceeded,
  pauseAlertThreatSignaturePeriodFailed,
  closeModal,
} from '../redux/pauseAlertModalSlice'

import { CREATE_THREAT_SIGNATURE_PAUSE_PERIOD } from './gql'

interface ActionType {
  payload: {
    streamIds: string | null
    threatSignatureId: string | null
    accountSlug: string | null
    siteSlug: string | null
    duration: number
    description: string | null
    threatSignatureName: string | null
  }
}

interface ResponseType {
  data: {
    ok: boolean
    message: string
    threatSignaturePausePeriod: {
      id: number
    }
  }
}

function* pauseAlertThreatSignaturePeriod(action: ActionType) {
  try {
    const {
      streamIds,
      threatSignatureId,
      accountSlug,
      siteSlug,
      duration,
      description,
      threatSignatureName,
    } = action.payload

    const response: ResponseType = yield call(
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
    yield put(pauseAlertThreatSignaturePeriodSucceeded())
    yield put(closeModal())
    yield put(
      openAlertSnackbar({
        threatSignaturePausePeriodId: get(
          response,
          'data.createThreatSignaturePausePeriod.threatSignaturePausePeriod.id',
          null,
        ),
        message: `The alert: '${threatSignatureName}' has been successfully paused on this stream for ${duration /
          60} minutes.`,
      }),
    )
    yield call(trackEventToMixpanel, MixPanelEventEnum.ALERT_PAUSE)
    // Refreshes pause panel
    yield put(
      getThreatSignaturePausePeriodsRequested({
        accountSlug,
        afterCreation: true,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(pauseAlertThreatSignaturePeriodFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// TODO AMB-2279 create type for this
function* pauseAlertModal(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest(
    pauseAlertThreatSignaturePeriodRequested,
    pauseAlertThreatSignaturePeriod,
  )
}

export default pauseAlertModal

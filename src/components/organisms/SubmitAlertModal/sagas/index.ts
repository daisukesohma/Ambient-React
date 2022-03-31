import {
  all,
  call,
  ForkEffect,
  put,
  takeLatest,
  select,
} from 'redux-saga/effects'
// src
import { createMutation, createMutationV2 } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import { openAlertSnackbar } from 'components/organisms/AlertSnackbar/redux/alertSnackbarSlice'
import { openModal as openNoFacialRecognitionModal } from 'components/organisms/modals/NoFacialRecognitionModal/redux/noFacialRecognitionModalSlice'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import MixPanelEventEnum from 'enums/MixPanelEventEnum'

import { CreateAlertErrorReportRequestedActionType } from '../types'
import {
  createAlertErrorReportRequested,
  createAlertErrorReportSucceeded,
  createAlertErrorReportFailed,
  recallAlertToSOCFailed,
  recallAlertToSOCRequested,
  recallAlertToSOCSucceeded,
  closeModal,
} from '../redux/submitAlertModalSlice'
import { EVENT_NOT_TAKEN_PLACE } from '../components/radioButtonOptionValues'
import { getSubmitAlertModal } from '../selectors'

import { CREATE_ALERT_ERROR_REPORT, RECALL_ALERT_TO_SOC } from './gql'

/**
 * createAlertErrorReport is the entry point to alert error report flow.
 * If the reason is EVENT_NOT_TAKEN_PLACE, it should recall to SOC and display success message.
 * If the reason is PEOPLE_NOT_SUSPICIOUS, it should present another modal to pause an alert.
 */
function* createAlertErrorReport(
  action: CreateAlertErrorReportRequestedActionType,
) {
  try {
    const { reason, description } = action.payload
    const { profileId, alertId, streamId } = yield select(getSubmitAlertModal)
    // Create alert report
    yield call(createMutation, CREATE_ALERT_ERROR_REPORT, {
      input: {
        alertId,
        streamId,
        profileId,
        reason,
        description,
      },
    })
    yield all([
      put(createAlertErrorReportSucceeded()),
      call(trackEventToMixpanel, MixPanelEventEnum.ALERT_REPORT),
      put(closeModal()),
    ])
    if (reason === EVENT_NOT_TAKEN_PLACE) {
      yield all([
        put(recallAlertToSOCRequested({ alertId })),
        put(
          openAlertSnackbar({
            threatSignaturePausePeriodId: null,
            message:
              'Thank you for your feedback. Your report has been submitted successfully.',
          }),
        ),
      ])
    } else {
      // Otherwise, the reason is PEOPLE_NOT_SUSPICIOUS.
      yield put(openNoFacialRecognitionModal())
    }
  } catch (error) {
    const { message } = error
    yield all([
      createAlertErrorReportFailed({ error: message }),
      createNotification({ message }),
    ])
  }
}

interface ActionType {
  payload: {
    profileId: number
    alertId: number
    streamId: number
    reason: string
    description: string
  }
}

function* recallAlertToSOC(action: ActionType) {
  try {
    const { alertId } = action.payload

    yield call(createMutationV2, RECALL_ALERT_TO_SOC, {
      alertId,
    })
    yield put(recallAlertToSOCSucceeded())
    yield call(trackEventToMixpanel, MixPanelEventEnum.ALERT_RECALL)
  } catch (error) {
    const { message } = error
    yield put(recallAlertToSOCFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// TODO AMB-2279 create type for this
function* submitAlertModal(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest(createAlertErrorReportRequested, createAlertErrorReport)
  yield takeLatest(recallAlertToSOCRequested, recallAlertToSOC)
}

export default submitAlertModal

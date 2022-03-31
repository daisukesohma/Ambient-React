import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import {
  SECURITY_PROFILE_SCHEDULE_FETCH_REQUESTED,
  SECURITY_PROFILE_SCHEDULE_UPDATE_REQUESTED,
} from 'redux/securityProfileSchedule/actionTypes'
import {
  securityProfileScheduleFetchSucceeded,
  securityProfileScheduleFetchFailed,
  securityProfileScheduleUpdateSucceeded,
  securityProfileScheduleUpdateFailed,
} from 'redux/securityProfileSchedule/actions'
import { createNotification } from 'redux/slices/notifications'

import {
  GET_SECURITY_PROFILE_SCHEDULE,
  UPDATE_SECURITY_PROFILE_SCHEDULE,
} from './gql'

function* fetchResources(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const response = yield call(createQuery, GET_SECURITY_PROFILE_SCHEDULE, {
      accountSlug,
      siteSlug,
    })
    const { securityProfileSchedule } = response.data
    yield put(
      securityProfileScheduleFetchSucceeded({ securityProfileSchedule }),
    )
  } catch (error) {
    const { message } = error
    yield put(securityProfileScheduleFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateResources(action) {
  try {
    const { accountSlug, siteSlug, schedule } = action.payload
    const updatedSchedule = schedule.map(scheduleDay => {
      // need to remove securityProfileName field
      const { startSecs, endSecs, day, securityProfileId } = scheduleDay
      return { startSecs, endSecs, day, securityProfileId }
    })
    const response = yield call(
      createMutation,
      UPDATE_SECURITY_PROFILE_SCHEDULE,
      {
        accountSlug,
        siteSlug,
        schedule: updatedSchedule,
      },
    )
    const { updateSecurityProfileSchedule } = response.data
    yield put(
      createNotification({ message: updateSecurityProfileSchedule.message }),
    )
    yield put(securityProfileScheduleUpdateSucceeded({ schedule }))
  } catch (error) {
    const { message } = error
    yield put(securityProfileScheduleUpdateFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* securityProfileScheduleSaga() {
  yield takeLatest(SECURITY_PROFILE_SCHEDULE_FETCH_REQUESTED, fetchResources)
  yield takeLatest(SECURITY_PROFILE_SCHEDULE_UPDATE_REQUESTED, updateResources)
}

export default securityProfileScheduleSaga

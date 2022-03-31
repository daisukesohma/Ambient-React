/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'

import {
  SECURITY_PROFILE_SCHEDULE_FETCH_REQUESTED,
  SECURITY_PROFILE_SCHEDULE_FETCH_SUCCEEDED,
  SECURITY_PROFILE_SCHEDULE_FETCH_FAILED,
  SECURITY_PROFILE_SCHEDULE_UPDATE_SUCCEEDED,
  SECURITY_PROFILE_SCHEDULE_UPDATE_REQUESTED,
  SECURITY_PROFILE_SCHEDULE_UPDATE_FAILED,
} from './actionTypes'

const initialState = {
  collection: [],
  error: null,
  loading: false,

  updateLoading: false,
}

const securityProfilesReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    // fetch
    case SECURITY_PROFILE_SCHEDULE_FETCH_REQUESTED:
      draft.loading = true
      return draft

    case SECURITY_PROFILE_SCHEDULE_FETCH_SUCCEEDED:
      draft.collection = action.payload.securityProfileSchedule
      draft.loading = false
      return draft

    case SECURITY_PROFILE_SCHEDULE_FETCH_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    // update
    case SECURITY_PROFILE_SCHEDULE_UPDATE_REQUESTED:
      draft.updateLoading = true
      return draft

    case SECURITY_PROFILE_SCHEDULE_UPDATE_SUCCEEDED:
      draft.collection = action.payload.schedule.map(scheduleDay => {
        const {
          startSecs,
          endSecs,
          day,
          securityProfileId,
          securityProfileName,
        } = scheduleDay
        return {
          startSecs,
          endSecs,
          day,
          securityProfile: { id: securityProfileId, name: securityProfileName },
        }
      })
      draft.updateLoading = false
      return draft

    case SECURITY_PROFILE_SCHEDULE_UPDATE_FAILED:
      draft.updateLoading = false
      draft.error = action.payload.error
      return draft

    default:
      return draft
  }
})

export default securityProfilesReducer

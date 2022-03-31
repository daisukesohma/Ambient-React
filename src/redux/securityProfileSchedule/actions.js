import {
  SECURITY_PROFILE_SCHEDULE_FETCH_REQUESTED,
  SECURITY_PROFILE_SCHEDULE_FETCH_SUCCEEDED,
  SECURITY_PROFILE_SCHEDULE_FETCH_FAILED,
  SECURITY_PROFILE_SCHEDULE_UPDATE_REQUESTED,
  SECURITY_PROFILE_SCHEDULE_UPDATE_FAILED,
  SECURITY_PROFILE_SCHEDULE_UPDATE_SUCCEEDED,
} from './actionTypes'

// START - COLLECTION FETCH
export const securityProfileScheduleFetchRequested = ({
  accountSlug,
  siteSlug,
}) => {
  return {
    type: SECURITY_PROFILE_SCHEDULE_FETCH_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
    },
  }
}

export const securityProfileScheduleFetchSucceeded = ({
  securityProfileSchedule,
}) => {
  return {
    type: SECURITY_PROFILE_SCHEDULE_FETCH_SUCCEEDED,
    payload: {
      securityProfileSchedule,
    },
  }
}

export const securityProfileScheduleFetchFailed = payload => {
  return {
    type: SECURITY_PROFILE_SCHEDULE_FETCH_FAILED,
    payload,
    error: true,
  }
}

export const securityProfileScheduleUpdateRequested = ({
  accountSlug,
  siteSlug,
  schedule,
}) => {
  return {
    type: SECURITY_PROFILE_SCHEDULE_UPDATE_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
      schedule,
    },
  }
}

export const securityProfileScheduleUpdateSucceeded = ({ schedule }) => {
  return {
    type: SECURITY_PROFILE_SCHEDULE_UPDATE_SUCCEEDED,
    payload: {
      schedule,
    },
  }
}

export const securityProfileScheduleUpdateFailed = payload => {
  return {
    type: SECURITY_PROFILE_SCHEDULE_UPDATE_FAILED,
    payload,
    error: true,
  }
}

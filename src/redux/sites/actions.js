import {
  FETCH_ALL_BY_ACCOUNT_REQUESTED,
  FETCH_ALL_BY_ACCOUNT_SUCCEEDED,
  FETCH_ALL_BY_ACCOUNT_FAILED,
  FETCH_SITE_UP_TIME_REQUESTED,
  FETCH_SITE_UP_TIME_SUCCEEDED,
  FETCH_SITE_UP_TIME_FAILED,
  FETCH_TIMEZONES_REQUESTED,
  FETCH_TIMEZONES_SUCCEEDED,
  FETCH_TIMEZONES_FAILED,
  UPDATE_SITE_INFO_REQUESTED,
  UPDATE_SITE_INFO_SUCCEEDED,
  UPDATE_SITE_INFO_FAILED,
  SET_SITE_UPDATING,
} from './actionTypes'

// START - COLLECTION FETCH
export const fetchSitesByAccountRequested = (accountSlug = '') => {
  return {
    type: FETCH_ALL_BY_ACCOUNT_REQUESTED,
    payload: {
      accountSlug,
    },
  }
}

export const fetchByAccountSucceeded = sites => {
  return {
    type: FETCH_ALL_BY_ACCOUNT_SUCCEEDED,
    payload: {
      sites,
    },
  }
}

export const fetchByAccountFailed = payload => {
  return {
    type: FETCH_ALL_BY_ACCOUNT_FAILED,
    payload: payload.error,
    error: true,
  }
}
// END - COLLECTION FETCH

export const fetchSiteUpTimeByAccountRequested = (accountSlug = '') => {
  return {
    type: FETCH_SITE_UP_TIME_REQUESTED,
    payload: {
      accountSlug,
    },
  }
}

export const fetchSiteUpTimeByAccountSucceeded = siteUpTime => {
  return {
    type: FETCH_SITE_UP_TIME_SUCCEEDED,
    payload: {
      siteUpTime,
    },
  }
}

export const fetchSiteUpTimeByAccountFailed = payload => {
  return {
    type: FETCH_SITE_UP_TIME_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const updateSiteInfoRequested = payload => {
  return {
    type: UPDATE_SITE_INFO_REQUESTED,
    payload,
  }
}

export const updateSiteInfoSucceeded = ({ site }) => {
  return {
    type: UPDATE_SITE_INFO_SUCCEEDED,
    payload: { site },
  }
}

export const updateSiteInfoFailed = ({ error }) => {
  return {
    type: UPDATE_SITE_INFO_FAILED,
    payload: { error },
    error: true,
  }
}

export const setSiteUpdating = site => {
  return {
    type: SET_SITE_UPDATING,
    payload: { site },
  }
}

export const fetchTimezonesRequested = () => {
  return {
    type: FETCH_TIMEZONES_REQUESTED,
  }
}

export const fetchTimezonesSucceeded = timezones => {
  return {
    type: FETCH_TIMEZONES_SUCCEEDED,
    payload: { timezones },
  }
}

export const fetchTimezonesFailed = ({ error }) => {
  return {
    type: FETCH_TIMEZONES_FAILED,
    payload: { error },
    error: true,
  }
}

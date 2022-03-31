import {
  FETCH_ALL_BY_ACCOUNT_REQUESTED,
  FETCH_ALL_BY_ACCOUNT_SUCCEEDED,
  FETCH_ALL_BY_ACCOUNT_FAILED,
  FETCH_SITE_UP_TIME_REQUESTED,
  FETCH_SITE_UP_TIME_SUCCEEDED,
  FETCH_SITE_UP_TIME_FAILED,
  FETCH_NODE_STATISTICS_REQUESTED,
  FETCH_NODE_STATISTICS_SUCCEEDED,
  FETCH_NODE_STATISTICS_FAILED,
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

export const fetchNodeStatisticsByAccountRequested = (accountSlug = '') => {
  return {
    type: FETCH_NODE_STATISTICS_REQUESTED,
    payload: {
      accountSlug,
    },
  }
}

export const fetchNodeStatisticsByAccountSucceeded = nodeStatistics => {
  return {
    type: FETCH_NODE_STATISTICS_SUCCEEDED,
    payload: {
      nodeStatistics,
    },
  }
}

export const fetchNodeStatisticsByAccountFailed = payload => {
  return {
    type: FETCH_NODE_STATISTICS_FAILED,
    payload: payload.error,
    error: true,
  }
}

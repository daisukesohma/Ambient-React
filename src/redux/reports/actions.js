import {
  CHANGE_DATE_FILTER,
  CHANGE_ALERT_EVENTS,
  DISPLAY_ALERT_EVENTS,
  FETCH_SITES_REQUESTED,
  FETCH_SITES_SUCCEEDED,
  FETCH_SITES_FAILED,
} from './actionTypes'

export const changeDateFilter = payload => {
  return {
    type: CHANGE_DATE_FILTER,
    payload,
  }
}

export const changeAlertEvents = payload => {
  return {
    type: CHANGE_ALERT_EVENTS,
    payload,
  }
}

export const displayAlertEvents = payload => {
  return {
    type: DISPLAY_ALERT_EVENTS,
    payload,
  }
}

export const fetchSitesRequested = payload => {
  return {
    type: FETCH_SITES_REQUESTED,
    payload,
  }
}

export const fetchSitesSucceeded = payload => {
  return {
    type: FETCH_SITES_SUCCEEDED,
    payload,
  }
}

export const fetchSitesFailed = payload => {
  return {
    type: FETCH_SITES_FAILED,
    payload,
    error: true,
  }
}

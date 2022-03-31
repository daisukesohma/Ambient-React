import {
  ESCALATION_CONTACT_FETCH_REQUESTED,
  ESCALATION_CONTACT_FETCH_SUCCEEDED,
  ESCALATION_CONTACT_FETCH_FAILED,
  SNOOZE_ESCALATION_METHOD_REQUESTED,
  SNOOZE_ESCALATION_METHOD_SUCCEEDED,
  SNOOZE_ESCALATION_METHOD_FAILED,
  UNSNOOZE_ESCALATION_METHOD_REQUESTED,
  UNSNOOZE_ESCALATION_METHOD_SUCCEEDED,
  UNSNOOZE_ESCALATION_METHOD_FAILED,
} from './actionTypes'

export const escalationContactFetchRequested = id => {
  return {
    type: ESCALATION_CONTACT_FETCH_REQUESTED,
    payload: { id },
  }
}

export const escalationContactFetchSucceeded = escalationContact => {
  return {
    type: ESCALATION_CONTACT_FETCH_SUCCEEDED,
    payload: { escalationContact },
  }
}

export const escalationContactFetchFailed = error => {
  return {
    type: ESCALATION_CONTACT_FETCH_FAILED,
    payload: { error },
  }
}

export const snoozeEscalationMethodRequested = ({
  profileId,
  method,
  duration,
}) => {
  return {
    type: SNOOZE_ESCALATION_METHOD_REQUESTED,
    payload: {
      profileId,
      method,
      duration,
    },
  }
}

export const snoozeEscalationMethodSucceeded = escalationSnooze => {
  return {
    type: SNOOZE_ESCALATION_METHOD_SUCCEEDED,
    payload: { escalationSnooze },
  }
}

export const snoozeEscalationMethodFailed = error => {
  return {
    type: SNOOZE_ESCALATION_METHOD_FAILED,
    payload: { error },
  }
}

export const unsnoozeEscalationMethodRequested = ({
  profileId,
  method,
  duration,
}) => {
  return {
    type: UNSNOOZE_ESCALATION_METHOD_REQUESTED,
    payload: {
      profileId,
      method,
      duration,
    },
  }
}

export const unsnoozeEscalationMethodSucceeded = escalationSnooze => {
  return {
    type: UNSNOOZE_ESCALATION_METHOD_SUCCEEDED,
    payload: { escalationSnooze },
  }
}

export const unsnoozeEscalationMethodFailed = error => {
  return {
    type: UNSNOOZE_ESCALATION_METHOD_FAILED,
    payload: { error },
  }
}

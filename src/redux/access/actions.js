import {
  CREATE_ACCESS_ALARM_REQUESTED,
  CREATE_ACCESS_ALARM_SUCCEEDED,
  CREATE_ACCESS_ALARM_FAILED,
} from './actionTypes'

export const createAccessAlarmRequested = ({ accessReaderId, name }) => {
  return {
    type: CREATE_ACCESS_ALARM_REQUESTED,
    payload: {
      accessReaderId,
      name,
    },
  }
}

export const createAccessAlarmSucceeded = ({ id, message }) => {
  return {
    type: CREATE_ACCESS_ALARM_SUCCEEDED,
    payload: {
      id,
      message,
    },
  }
}

export const createAccessAlarmFailed = ({ message }) => {
  return {
    type: CREATE_ACCESS_ALARM_FAILED,
    payload: {
      message,
    },
  }
}

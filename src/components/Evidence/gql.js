import gql from 'graphql-tag'

export const GET_ALERT_EVENT = gql`
  query GetAlertEvent($alertEventId: Int) {
    getAlertEvent(alertEventId: $alertEventId) {
      id
      alertInstances {
        id
        clip
        clipS3FileName
      }
    }
  }
`

export const GET_ACCESS_ALARM = gql`
  query GetAccessAlarm($accessAlarmId: Int) {
    getAccessAlarm(accessAlarmId: $accessAlarmId) {
      id
      clip
      evidenceAvailable
    }
  }
`

export const GET_ALERT_INSTANCE = gql`
  query GetAlertInstance($alertInstanceId: Int) {
    getAlertInstance(alertInstanceId: $alertInstanceId) {
      id
      clip
      clipS3FileName
    }
  }
`

import gql from 'graphql-tag'

export const CREATE_ALERT_ERROR_REPORT = gql`
  mutation createAlertErrorReport($input: AlertErrorReportInput!) {
    createAlertErrorReport(input: $input) {
      ok
      alertErrorReport {
        alert {
          id
        }
        stream {
          id
        }
        profile {
          id
        }
        reason
        description
      }
    }
  }
`

export const RECALL_ALERT_TO_SOC = gql`
  mutation RecallAlertToSOC($alertId: Int!) {
    recallAlertToSoc(alertId: $alertId) {
      ok
      message
    }
  }
`

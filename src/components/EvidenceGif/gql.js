import gql from 'graphql-tag'

export const GET_ALERT_INSTANCE_BY_HASH = gql`
  query GetAlertInstanceByHash(
    $alertInstanceId: Int!
    $alertInstanceHash: String!
  ) {
    alertInstanceByHash(
      alertInstanceId: $alertInstanceId
      alertInstanceHash: $alertInstanceHash
    ) {
      id
      tsIdentifier
      verified
      status
      clip
    }
  }
`

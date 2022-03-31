import gql from 'graphql-tag'

export const GET_ACCESS_ALARM_TYPE_DISTRIBUTION = gql`
  query AccessAlarmTypeDistribution(
    $accountSlug: String!
    $siteSlugs: [String]
    $startTs: Int
    $endTs: Int
    $accessAlarmTypes: [String]
  ) {
    accessAlarmTypeDistribution(
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
      startTs: $startTs
      endTs: $endTs
      accessAlarmTypes: $accessAlarmTypes
    ) {
      value
      name
      dataType
      rawCount
      ambientCount
    }
  }
`

export const GET_ACCESS_READER_LIST = gql`
  query AccessReaderList(
    $accountSlug: String!
    $siteSlugs: [String]
    $startTs: Int
    $endTs: Int
    $accessAlarmTypes: [String]
  ) {
    accessReaderList(
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
      startTs: $startTs
      endTs: $endTs
      accessAlarmTypes: $accessAlarmTypes
    ) {
      alertCount
      onAmbient
      reader {
        id
        deviceId
        stream {
          id
          name
          active
          node {
            identifier
          }
        }
        site {
          id
          name
          slug
        }
      }
    }
  }
`

export const GET_PACS_ALERT_EVENT_DISTRIBUTION = gql`
  query pacsAlertEventDistribution(
    $accountSlug: String!
    $siteSlugs: [String]
    $startTs: Int
    $endTs: Int
    $accessAlarmTypes: [String]
  ) {
    pacsAlertEventDistribution(
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
      startTs: $startTs
      endTs: $endTs
      accessAlarmTypes: $accessAlarmTypes
    ) {
      count
      threatSignature {
        name
      }
      dataType
    }
  }
`

export const GET_ACCESS_NODES_FOR_ACCOUNT = gql`
  query AccessNodesForAccount($accountSlug: String!) {
    accessNodesForAccount(accountSlug: $accountSlug) {
      id
    }
  }
`

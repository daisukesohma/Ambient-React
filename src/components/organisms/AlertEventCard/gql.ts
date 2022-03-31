import { gql } from 'apollo-boost'

export const GET_ALERT_EVENT = gql`
  query GetAlertEvent($id: Int!, $accountSlug: String!, $siteSlug: String) {
    alertEvent(id: $id, accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      tsCreated
      tsIdentifier
      status
      eventHash
      canRecall
      accessReader {
        deviceId
      }
      alert {
        id
        name
        site {
          id
          name
          slug
          account {
            slug
          }
          latlng
        }
      }
      stream {
        id
        name
        active
        site {
          timezone
        }
        node {
          identifier
        }
      }
      alertInstances {
        id
        clip
        tsCreated
        tsIdentifier
        status
        alertHash
        stream {
          id
          name
          active
          site {
            timezone
          }
          node {
            identifier
          }
        }
      }
      caseActions {
        id
        case {
          id
          name
        }
      }
    }
  }
`

export const GET_CASES = gql`
  query GetCases(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $status: String
  ) {
    cases(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      status: $status
    ) {
      id
      name
    }
  }
`

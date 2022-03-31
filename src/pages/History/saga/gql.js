import { gql } from 'apollo-boost'

const GET_ACCOUNT_SITES = gql`
  query GetAccountSites($accountSlug: String!) {
    allSites(accountSlug: $accountSlug) {
      id
      name
      slug
      timezone
    }
  }
`

const GET_ALERTS = gql`
  query GetAlerts($accountSlug: String!, $siteSlug: String) {
    alerts(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
      threatSignature {
        id
        name
      }
    }
  }
`

const GET_STREAMS = gql`
  query GetStreams($accountSlug: String!, $siteSlug: String!) {
    streams(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
    }
  }
`

// Gives you a paginated list
const GET_ALERT_EVENTS_PAGINATED = gql`
  query GettingAlertEventsPaginated(
    $accountSlug: String!
    $siteSlugs: [String]
    $page: Int
    $alertIds: [Int]
    $streamIds: [Int]
    $startTs: Int
    $endTs: Int
    $limit: Int
    $status: String
    $isTest: Boolean
    $bookmarked: Boolean
    $severities: [String]
    $threatSignatureIds: [Int]
    $download: Boolean
  ) {
    alertEventsPaginated(
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
      page: $page
      alertIds: $alertIds
      streamIds: $streamIds
      startTs: $startTs
      endTs: $endTs
      limit: $limit
      status: $status
      isTest: $isTest
      bookmarked: $bookmarked
      severities: $severities
      threatSignatureIds: $threatSignatureIds
      download: $download
    ) {
      link
      alertEvents {
        id
        tsCreated
        tsIdentifier
        bookmarked
        accessReader {
          id
          deviceId
        }
        alert {
          id
          name
          site {
            timezone
            latlng
            id
            name
            slug
          }
          threatSignature {
            id
            name
          }
        }
        stream {
          id
          name
          active
          node {
            identifier
            retentionMotionDays
            retentionNonmotionDays
          }
          site {
            timezone
          }
        }
        status
        eventHash
        tsIdentifier
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
            node {
              identifier
              retentionMotionDays
              retentionNonmotionDays
            }
            site {
              timezone
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
      pages
      currentPage
    }
  }
`

const GET_CASES = gql`
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

export const BOOKMARK_ALERT = gql`
  mutation toggleBookmarkAlertEvent(
    $bookmark: Boolean
    $alertEventHash: String
    $alertEventId: Int
  ) {
    toggleBookmarkAlertEvent(
      bookmark: $bookmark
      alertEventHash: $alertEventHash
      alertEventId: $alertEventId
    ) {
      ok
      message
    }
  }
`

const RESOLVE_ALERT_EVENT = gql`
  mutation ResolveAlertEvent($alertEventId: Int!, $alertEventHash: String!) {
    resolveAlertEvent(
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
    ) {
      ok
      message
      alertEvent {
        id
      }
    }
  }
`

export {
  GET_ACCOUNT_SITES,
  GET_ALERTS,
  GET_STREAMS,
  GET_ALERT_EVENTS_PAGINATED,
  GET_CASES,
  RESOLVE_ALERT_EVENT,
}

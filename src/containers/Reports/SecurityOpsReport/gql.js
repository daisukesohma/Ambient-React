/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

const GET_ACCOUNT_SITES = gql`
  query GetAccountSites($accountSlug: String!) {
    allSites(accountSlug: $accountSlug) {
      id
      name
      slug
    }
  }
`

const GET_ALERT_EVENTS_STATUS_DISTRIBUTION = gql`
  query GetNumberOfAlerts(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    activityReport(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      numOutstandingAlertEvents
      numAckedAlertEvents
      numDispatchedAlertEvents
      numAlertEvents
    }
  }
`

const GET_ACKNOWLEDGED_ALERT_EVENTS_NUMBER = gql`
  query GetNumberOfAcknowledgedAlerts(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    activityReport(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      numAckedAlertEvents
      numAlertEvents
    }
  }
`

const GET_DISPATCHED_ALERT_EVENTS_NUMBER = gql`
  query GetNumberOfDispatchedAlerts(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    activityReport(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      numDispatchedAlertEvents
      numAlertEvents
      dispatchedAlertEvents {
        id
        tsCreated
        tsIdentifier
        eventHash
        status
        alert {
          id
          name
          site {
            id
            name
            slug
          }
        }
        stream {
          id
          name
          active
          node {
            identifier
          }
          site {
            timezone
          }
        }
        opStatuses {
          id
          opItem {
            id
            text
            operatingProcedure {
              id
              name
            }
          }
        }
        alertInstances {
          id
          clip
          tsIdentifier
          stream {
            id
            name
            active
            node {
              identifier
            }
            site {
              timezone
            }
          }
          alert {
            id
            name
            site {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`

const GET_OUTSTANDING_ALERT_EVENTS_NUMBER = gql`
  query GetNumberOfOutstandingAlerts(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    activityReport(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      numOutstandingAlertEvents
      numAlertEvents
    }
  }
`

const GET_ALERT_EVENTS_DISTRIBUTION = gql`
  query GetAlertEventsDistribution(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    alertDistribution(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      name
      value
      total
    }
  }
`

const GET_ACKNOWLEDGEMENT_LATENCY_DISTRIBUTION = gql`
  query GetAcknowledgementLatencyDistribution(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    acknowledgementLatencyDistribution(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      name
      value
    }
  }
`

const GET_DISPATCH_LATENCY_DISTRIBUTION = gql`
  query GetDispatchLatencyDistribution(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    dispatchLatencyDistribution(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      name
      value
    }
  }
`

const GET_USER_ACTIVITY = gql`
  query GetUserActivity(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    userActivityReports(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      dispatchesCreated
      name
      email
      ackedAlertEvents
      dispatchesReceived
      dispatchesResolved
      dispatchesDenied
      dispatchesSeen
    }
  }
`

// TODO: Simplify the requirements of the AlertInstanceComponent @rodaan
const GET_DISPATCHED_ALERTS = gql`
  query GetDispatchedAlerts(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    activityReport(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      isTest: $isTest
      severities: $severities
    ) {
      dispatchedAlertEvents {
        id
        tsCreated
        tsIdentifier
        eventHash
        status
        alert {
          id
          name
          site {
            id
            name
            slug
          }
        }
        stream {
          id
          name
          active
          node {
            identifier
          }
          site {
            timezone
          }
        }
        opStatuses {
          id
          opItem {
            id
            text
            operatingProcedure {
              id
              name
            }
          }
        }
        alertInstances {
          id
          clip
          tsIdentifier
          stream {
            id
            name
            active
            node {
              identifier
            }
            site {
              timezone
            }
          }
          alert {
            id
            name
            site {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`

// const GET_THREAT_SIGNATURES = gql`
//   query {
//     allThreatSignatures {
//       id
//       name
//     }
//   }
// `

const GET_ALERTS = gql`
  query GetAlerts($accountSlug: String!, $siteSlug: String) {
    alerts(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
    }
  }
`

const GET_STREAMS = gql`
  query GetStreams($accountSlug: String!, $siteSlug: String) {
    streams(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
    }
  }
`

const GET_ALERT_EVENTS = gql`
  query GetAlertEvents($accountSlug: String!, $siteSlug: String) {
    alertEvents(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
    }
  }
`

const GET_ALERT_EVENT = gql`
  query GetAlertEvent($id: Int!, $accountSlug: String!, $siteSlug: String) {
    alertEvent(id: $id, accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      tsCreated
      tsIdentifier
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
        }
      }
      stream {
        id
        name
        active
        node {
          identifier
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
          }
          site {
            timezone
          }
        }
      }
      caseActions {
        case {
          id
          name
        }
      }
    }
  }
`

// Gives you a paginated list
const GET_ALERT_EVENTS_PAGINATED = gql`
  query GetAlertEventsPaginated(
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
    $severities: [String]
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
      severities: $severities
    ) {
      alertEvents {
        id
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

const GET_ACTIVITY_REPORT = gql`
  mutation generateSecurityOperationsReport(
    $accountSlug: String!
    $siteSlug: String
    $tsStart: Int
    $tsEnd: Int
  ) {
    generateSecurityOperationsReport(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      tsStart: $tsStart
      tsEnd: $tsEnd
    ) {
      ok
      message
      status
      filename
      fileLocation
      site
    }
  }
`

const GET_ACTIVITIES_DISTRIBUTION = gql`
  query GetActivitiesDistribution(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
  ) {
    activityDistribution(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
    ) {
      name
      value
    }
  }
`

export {
  GET_ACCOUNT_SITES,
  GET_ALERT_EVENTS_STATUS_DISTRIBUTION,
  GET_ACKNOWLEDGED_ALERT_EVENTS_NUMBER,
  GET_DISPATCHED_ALERT_EVENTS_NUMBER,
  GET_OUTSTANDING_ALERT_EVENTS_NUMBER,
  GET_ALERT_EVENTS_DISTRIBUTION,
  GET_ACKNOWLEDGEMENT_LATENCY_DISTRIBUTION,
  GET_DISPATCH_LATENCY_DISTRIBUTION,
  GET_USER_ACTIVITY,
  GET_DISPATCHED_ALERTS,
  // GET_THREAT_SIGNATURES,
  GET_ALERTS,
  GET_STREAMS,
  GET_ALERT_EVENT,
  GET_ALERT_EVENTS,
  GET_ALERT_EVENTS_PAGINATED,
  GET_CASES,
  GET_ACTIVITY_REPORT,
  GET_ACTIVITIES_DISTRIBUTION,
}

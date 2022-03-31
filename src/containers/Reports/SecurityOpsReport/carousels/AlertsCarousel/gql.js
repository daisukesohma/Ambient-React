/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

export const GET_ACKNOWLEDGEMENT_LATENCY_DISTRIBUTION = gql`
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
      alertEvents {
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

export const GET_DISPATCH_LATENCY_DISTRIBUTION = gql`
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
      alertEvents {
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

export const GET_OUTSTANDING_ALERT_EVENTS = gql`
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
      outstandingAlertEvents {
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

// TODO: Simplify the requirements of the AlertInstanceComponent @rodaan
export const GET_DISPATCHED_ALERTS = gql`
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
      sTest: $isTest
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

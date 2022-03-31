/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

export const GET_DISPATCHED_ALERT_EVENTS = gql`
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

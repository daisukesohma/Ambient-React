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
      total
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

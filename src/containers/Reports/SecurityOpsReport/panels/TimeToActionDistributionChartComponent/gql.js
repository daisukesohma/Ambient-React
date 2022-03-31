/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

export const GET_TIME_TO_ACTION_LATENCY_DISTRIBUTION = gql`
  query GetTimeToActionLatencyDistribution(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $isTest: Boolean
    $severities: [String]
  ) {
    timeToActionLatencyDistribution(
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

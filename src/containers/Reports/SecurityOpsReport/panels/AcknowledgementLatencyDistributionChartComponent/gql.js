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
    }
  }
`

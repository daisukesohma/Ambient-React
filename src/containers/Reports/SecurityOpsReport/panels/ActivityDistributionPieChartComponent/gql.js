/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

export const GET_ACTIVITIES_DISTRIBUTION = gql`
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

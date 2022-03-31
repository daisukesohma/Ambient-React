/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

export const GET_USER_ACTIVITY = gql`
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

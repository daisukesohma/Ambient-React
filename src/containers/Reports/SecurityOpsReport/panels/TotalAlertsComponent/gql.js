/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

export const GET_ALERT_EVENTS_STATUS_DISTRIBUTION = gql`
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

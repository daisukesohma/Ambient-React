/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

export const GET_ACKNOWLEDGED_ALERT_EVENTS_NUMBER = gql`
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

import { gql } from 'apollo-boost'

import { Fragment } from 'gql/queries'
// Gives you a paginated list
export const GET_ALERT_EVENTS_PAGINATED = gql`
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
    ) {
      alertEvents {
        ...AlertEventDetails
        alertInstances {
          id
          clip
          alertHash
          tsIdentifier
        }
      }
      pages
      currentPage
    }
  }
  ${Fragment.ALERT_EVENT_DETAILS}
`

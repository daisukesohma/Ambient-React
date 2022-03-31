/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

const AlertDetailsFragment = gql`
  fragment AlertDetails on AlertType {
    name
    id
    status
    verificationType
    severity
    threatSignature {
      id
      name
    }
    site {
      name
      slug
      account {
        name
        slug
      }
    }
    defaultAlert {
      threatSignature {
        id
        name
      }
      regions {
        id
        name
      }
    }
    socRecall {
      id
      tsEnd
    }
    canRecall
  }
`

export const ALL_ALERTS_PAGINATED = gql`
  query AllAlertsPaginated(
    $accountSlug: String
    $siteSlugs: [String]
    $threatSignatureIds: [Int]
    $verificationType: String
    $severities: [String]
    $statuses: [String]
    $searchQuery: String
    $page: Int
    $limit: Int
    $tsStart: Int
    $tsEnd: Int
  ) {
    allAlertsPaginated(
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
      threatSignatureIds: $threatSignatureIds
      verificationType: $verificationType
      severities: $severities
      statuses: $statuses
      searchQuery: $searchQuery
      page: $page
      limit: $limit
    ) {
      pages
      totalCount
      currentPage
      instances {
        ...AlertDetails
        performanceMetrics(tsStart: $tsStart, tsEnd: $tsEnd) {
          dismissedRatio
          numPositive
          numNegative
        }
      }
    }
  }
  ${AlertDetailsFragment}
`

export const GET_VERIFICATION_TYPES = gql`
  query VerificationTypes {
    verificationTypes {
      key
      name
    }
  }
`

export const GET_ALL_THREAT_SIGNATURES = gql`
  query allThreatSignatures {
    allThreatSignatures {
      id
      name
    }
  }
`

export const RECALL_ALERT_TO_SOC = gql`
  mutation RecallAlertToSOC(
    $alertId: Int!
    $durationSecs: Int
    $tsStart: Int
    $tsEnd: Int
  ) {
    recallAlertToSoc(alertId: $alertId, durationSecs: $durationSecs) {
      ok
      message
      alert {
        ...AlertDetails
        performanceMetrics(tsStart: $tsStart, tsEnd: $tsEnd) {
          dismissedRatio
          numPositive
          numNegative
        }
      }
    }
  }
  ${AlertDetailsFragment}
`

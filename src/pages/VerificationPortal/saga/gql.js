import gql from 'graphql-tag'

export const GET_ALERT_INSTANCES = gql`
  query getAlertInstancesPaginated(
    $siteIds: [Int]
    $tsStart: Int
    $tsEnd: Int
    $status: String
    $streamIds: [Int]
    $threatSignatureIds: [Int]
    $page: Int
    $limit: Int
  ) {
    getAlertInstancesPaginated(
      siteIds: $siteIds
      tsStart: $tsStart
      tsEnd: $tsEnd
      status: $status
      streamIds: $streamIds
      threatSignatureIds: $threatSignatureIds
      page: $page
      limit: $limit
    ) {
      pages
      totalCount
      instances {
        id
        tsCreated
        tsIdentifier
        clip
        clipS3FileName
        tsClipReceived
        alertHash
        status
        evaluatorState
        verified
        alert {
          id
          isHard
          name
          threatSignature {
            icon
          }
          site {
            id
            name
            slug
            timezone
            latlng
            account {
              name
              slug
            }
          }
        }
        stream {
          id
          name
          active
          node {
            identifier
          }
        }
      }
    }
  }
`

export const ALL_STREAMS = gql`
  query SearchStreamsV2($accountSlug: String, $query: String!, $limit: Int) {
    searchStreamsV2(accountSlug: $accountSlug, query: $query, limit: $limit) {
      stream {
        id
        name
        active
        site {
          name
          slug
        }
      }
    }
  }
`

export const ALL_THREAT_SIGNATURES = gql`
  query allThreatSignatures {
    allThreatSignatures {
      id
      name
    }
  }
`

export const GET_ACTIVE_SITES = gql`
  query getActiveSites {
    getActiveSites {
      name
      slug
      id
      account {
        name
        slug
      }
    }
  }
`

export const VERIFY_ALERT_INSTANCE = gql`
  mutation verifyAlertInstance(
    $alertInstanceId: Int!
    $alertHash: String!
    $status: String!
  ) {
    verifyAlertInstance(
      alertInstanceId: $alertInstanceId
      alertHash: $alertHash
      status: $status
    ) {
      ok
      message
      alertInstance {
        id
      }
    }
  }
`

export const GET_ALERT_INSTANCE = gql`
  query getAlertInstance($alertInstanceId: Int) {
    getAlertInstance(alertInstanceId: $alertInstanceId) {
      id
      tsCreated
      tsIdentifier
      clip
      clipS3FileName
      tsClipReceived
      alertHash
      status
      evaluatorState
      verified
      alert {
        id
        isHard
        name
        threatSignature {
          icon
        }
        site {
          id
          name
          slug
          account {
            name
            slug
          }
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
          name
          slug
          timezone
        }
      }
    }
  }
`

export const GET_ALERT_CLIP_BY_HASH = gql`
  query GetAlertInstanceByHash(
    $alertInstanceId: Int!
    $alertInstanceHash: String!
  ) {
    alertInstanceByHash(
      alertInstanceId: $alertInstanceId
      alertInstanceHash: $alertInstanceHash
    ) {
      id
      clip
      clipSpe
    }
  }
`

export const GET_ALERT_INSTANCE_BY_HASH = gql`
  query alertInstanceByHash(
    $alertInstanceId: Int!
    $alertInstanceHash: String!
  ) {
    alertInstanceByHash(
      alertInstanceId: $alertInstanceId
      alertInstanceHash: $alertInstanceHash
    ) {
      id
      tsIdentifier
      verified
      status
      clip
      alertHash
      alertStatuses {
        id
        user {
          id
          firstName
          profile {
            id
            img
          }
        }
        ts
        status
      }
      alert {
        id
        name
        site {
          id
          slug
          account {
            slug
          }
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
    }
  }
`

export const VERIFY_ALERT_INSTANCE_MOBILE = gql`
  mutation verifyAlertInstanceMobile(
    $alertInstanceId: Int!
    $alertInstanceHash: String!
    $userId: Int!
    $status: String!
    $escalate: Boolean
  ) {
    verifyAlertInstanceMobile(
      alertInstanceId: $alertInstanceId
      alertInstanceHash: $alertInstanceHash
      userId: $userId
      status: $status
      escalate: $escalate
    ) {
      ok
      message
    }
  }
`

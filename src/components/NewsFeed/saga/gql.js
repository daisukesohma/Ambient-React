import gql from 'graphql-tag'

// ALERT EVENTS
export const GET_ALERT_EVENTS = gql`
  query GetAlertEvents(
    $accountSlug: String!
    $siteSlugs: [String]
    $page: Int
    $alertIds: [Int]
    $streamIds: [Int]
    $startTs: Int
    $endTs: Int
    $limit: Int
    $status: String
    $severities: [String]
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
      severities: $severities
    ) {
      alertEvents {
        id
        eventHash
        tsCreated
        tsIdentifier
        acknowledged
        resolved
        clip
        resolved
        acknowledged
        status
        accessReader {
          deviceId
        }
        lastTimelineEvent {
          __typename
          ... on AlertEventStatusType {
            id
            ts
            status
            user {
              id
              firstName
              lastName
              email
              profile {
                id
                img
              }
            }
          }
          ... on AlertEventDispatchType {
            id
            ts
            status
            profile {
              id
              img
              user {
                id
                firstName
                lastName
                email
              }
            }
          }
          ... on AlertEventShareType {
            id
            ts
          }
        }
        stream {
          id
          name
          active
          node {
            identifier
            retentionMotionDays
            retentionNonmotionDays
          }
          site {
            id
            timezone
            name
          }
        }
        alert {
          id
          name
          site {
            id
            slug
            name
            latlng
            timezone
            profiles {
              id
            }
            account {
              id
              slug
            }
          }
          threatSignature {
            id
            name
            icon
          }
        }
        alertInstances {
          id
          clip
          clipS3FileName
          alertHash
          tsIdentifier
        }
        canRecall
      }
    }
  }
`

export const GET_ALERT_EVENT = gql`
  query GetAlertEvent($alertEventId: Int) {
    getAlertEvent(alertEventId: $alertEventId) {
      id
      eventHash
      tsCreated
      tsIdentifier
      acknowledged
      resolved
      clip
      resolved
      acknowledged
      status
      canRecall
      accessReader {
        deviceId
      }
      lastTimelineEvent {
        __typename
        ... on AlertEventStatusType {
          id
          ts
          status
          user {
            id
            firstName
            lastName
            email
            profile {
              id
              img
            }
          }
        }
        ... on AlertEventDispatchType {
          id
          ts
          status
          profile {
            id
            img
            user {
              id
              firstName
              lastName
              email
            }
          }
        }
        ... on AlertEventShareType {
          id
          ts
        }
      }
      stream {
        id
        name
        active
        node {
          identifier
          retentionMotionDays
          retentionNonmotionDays
        }
        site {
          id
          timezone
          name
        }
      }
      alert {
        id
        name
        site {
          id
          slug
          name
          latlng
          timezone
          profiles {
            id
          }
          account {
            id
            slug
          }
        }
        threatSignature {
          id
          name
          icon
        }
      }
      alertInstances {
        id
        clip
        clipS3FileName
        alertHash
        tsIdentifier
      }
    }
  }
`

export const ACKNOWLEDGE_ALERT_EVENT = gql`
  mutation AcknowledgeAlertEvent($alertEventHash: String, $alertEventId: Int) {
    acknowledgeAlertEvent(
      alertEventHash: $alertEventHash
      alertEventId: $alertEventId
    ) {
      ok
      message
    }
  }
`

export const ACKNOWLEDGE_ALERT_EVENT_ESCALATION = gql`
  mutation AcknowledgeAlertEventEscalation(
    $alertEventId: Int!
    $alertEventHash: String!
    $escalationLevelId: Int!
    $escalationContactId: Int!
  ) {
    acknowledgeAlertEventEscalation(
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
      escalationLevelId: $escalationLevelId
      escalationContactId: $escalationContactId
    ) {
      ok
      message
    }
  }
`

export const RESOLVE_ALERT_EVENT = gql`
  mutation ResolveAlertEvent(
    $alertEventId: Int!
    $alertEventHash: String!
    $escalationLevelId: Int
    $escalationContactId: Int
  ) {
    resolveAlertEvent(
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
      escalationLevelId: $escalationLevelId
      escalationContactId: $escalationContactId
    ) {
      ok
      message
      alertEvent {
        id
      }
    }
  }
`

export const DISMISS_ALERT_EVENT = gql`
  mutation DismissAlertEvent(
    $alertEventId: Int!
    $alertEventHash: String!
    $escalationLevelId: Int
    $escalationContactId: Int
  ) {
    dismissAlertEvent(
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
      escalationLevelId: $escalationLevelId
      escalationContactId: $escalationContactId
    ) {
      ok
      message
      alertEvent {
        id
        status
      }
    }
  }
`

export const CREATE_DISPATCH_STATUS = gql`
  mutation CreateDispatchStatus(
    $alertEventId: Int!
    $alertEventHash: String!
    $status: String!
    $userId: Int!
  ) {
    createDispatchStatus(
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
      status: $status
      userId: $userId
    ) {
      ok
      dispatch {
        id
        status
      }
      message
    }
  }
`

export const DISPATCH_INTERNAL = gql`
  mutation DispatchInternal(
    $alertEventId: Int!
    $alertEventHash: String!
    $profileId: Int
    $escalationLevelId: Int
    $escalationContactId: Int
    $userId: Int
  ) {
    dispatchInternal(
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
      escalationLevelId: $escalationLevelId
      escalationContactId: $escalationContactId
      profileId: $profileId
      userId: $userId
    ) {
      ok
      message
      responders {
        id
        user {
          id
        }
      }
    }
  }
`

export const EXPIRE_ALERT_EVENT_SHARE = gql`
  mutation ExpireAlertEventShare($id: Int!) {
    expireAlertEventShare(id: $id) {
      ok
      message
    }
  }
`

export const GET_ALERT_EVENT_SHARE_BY_TOKEN = gql`
  query GetAlertEventShareByToken($token: String!) {
    alertEventShareByToken(token: $token) {
      expired
      share {
        alertEvent {
          id
          clip
          tsCreated
          tsIdentifier
          eventHash
          accessReader {
            deviceId
          }
          alertInstances {
            id
            clip
            tsIdentifier
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
          alert {
            id
            name
            site {
              id
              slug
              timezone
              account {
                id
                slug
              }
              latlng
              name
            }
          }
        }
      }
    }
  }
`

// TODO: This is currently just meant to be a 1:1 port
// of this query from DRF to GQL. Break this into
// separate queries. Breaking this up is out of scope for
// this release (MARCH20 R2). Will be fixed in a subsequent
// release.
export const GET_DISPATCH_STATUS = gql`
  query GetDispatchStatus(
    $alertEventId: Int = 9
    $alertEventHash: String = "OWE8ODR554"
  ) {
    dispatchStatus(
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
    ) {
      id
      alertEvent {
        id
        acknowledged
        resolved
        status
        clip
        tsCreated
        tsIdentifier
        eventHash
        canRecall
        accessReader {
          deviceId
        }
        timeline {
          __typename
          ... on CommentType {
            id
            ts
            comment
            author {
              id
              img
              user {
                id
                firstName
                lastName
                email
              }
            }
          }
          ... on AlertEventStatusType {
            id
            ts
            status
            user {
              id
              firstName
              lastName
              email
              profile {
                id
                img
              }
            }
            contact {
              profile {
                id
                img
                user {
                  id
                  firstName
                  lastName
                }
              }
              method
            }
          }
          ... on AlertEventDispatchType {
            id
            ts
            status
            profile {
              id
              img
              user {
                id
                firstName
                lastName
                email
              }
            }
            createdBy {
              id
              firstName
              lastName
              email
              profile {
                id
                img
              }
            }
          }
        }
        alertInstances {
          id
          clip
          tsIdentifier
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
        alert {
          id
          name
          site {
            id
            slug
            name
            timezone
            account {
              id
              slug
              name
            }
            latlng
          }
        }
      }
      statuses {
        status
        contact {
          id
          profile {
            id
            user {
              id
              firstName
            }
          }
        }
        level {
          id
        }
        user {
          id
          firstName
        }
        ts
      }
      responders {
        profile {
          id
          user {
            id
            firstName
          }
          img
        }
        status
        dispatchLink
      }
      shares {
        id
        token {
          tsExpiry
          externalProfile {
            id
            name
          }
        }
        shareLink
      }
    }
  }
`

export const CREATE_COMMENT = gql`
  mutation CreateComment($data: CreateCommentInput!) {
    createComment(data: $data) {
      ok
      message
      comment {
        id
        ts
        comment
        author {
          id
          img
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($data: UpdateCommentInput!) {
    updateComment(data: $data) {
      ok
      message
      comment {
        id
        ts
        comment
        author {
          id
          img
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`

export const DELETE_COMMENT = gql`
  mutation DeleteComment($data: DeleteCommentInput!) {
    deleteComment(data: $data) {
      ok
      message
    }
  }
`

export const SIMULATE_ALERT_EVENT = gql`
  mutation SimulateAlertEvent(
    $accountSlug: String
    $siteSlug: String
    $alertId: Int
    $autoVerify: Boolean
    $clip: String
    $clipSecs: Int
    $audience: [Int]
  ) {
    simulateAlertEvent(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      alertId: $alertId
      autoVerify: $autoVerify
      clip: $clip
      clipSecs: $clipSecs
      audience: $audience
    ) {
      ok
      message
    }
  }
`

// ACTIVITY LOGS

export const GET_ACTIVITY_LOGS = gql`
  query GetActivitiesForNewsfeed(
    $limit: Int
    $page: Int
    $descending: Boolean
    $filters: [ActivityFilterInputTypeV2]!
  ) {
    activitiesPaginatedV2(
      limit: $limit
      page: $page
      descending: $descending
      filters: $filters
    ) {
      instances {
        __typename
        ... on AlertEventType {
          id
          ts
          eventHash
          severity
          tsIdentifier
          acknowledged
          resolved
          accessReader {
            deviceId
          }
          alert {
            id
            name
            site {
              id
              latlng
              timezone
              name
              slug
              account {
                id
                slug
              }
            }
            threatSignature {
              id
              icon
            }
          }
          alertInstances {
            id
            clip
            clipS3FileName
          }
          stream {
            id
            name
            active
            site {
              timezone
              id
              name
              slug
            }
            node {
              identifier
            }
          }
          clip
          canRecall
        }
        ... on AccessAlarmType {
          id
          name
          ts
          clip
          evidenceAvailable
          reader {
            id
            deviceId
            stream {
              id
              name
              active
              site {
                timezone
              }
              node {
                identifier
              }
            }
            site {
              id
              name
              slug
              timezone
            }
          }
          accessAlarmTypeCast {
            id
            regex
            accessAlarmType
          }
          accessAlarmType
        }
        ... on ProfileOverrideLogType {
          id
          overriddenSecurityProfile {
            id
            name
            site {
              id
              name
              slug
              timezone
            }
            style
          }
          overridingSecurityProfile {
            id
            name
            site {
              id
              name
              slug
              timezone
            }
            style
          }
          user {
            id
            firstName
            lastName
            email
            profile {
              id
              img
            }
          }
          ts
        }
        ... on WorkShiftType {
          id
          profile {
            id
            user {
              id
              firstName
              lastName
              email
            }
            img
          }
          signIn
          ts
        }
      }
      totalCount
    }
  }
`

export const GET_ALERTS_PULSE = gql`
  query AlertEventsPulse(
    $accountSlug: String!
    $siteSlugs: [String]
    $page: Int
    $alertIds: [Int]
    $streamIds: [Int]
    $startTs: Int
    $endTs: Int
    $limit: Int
    $status: String
    $severities: [String]
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
      severities: $severities
    ) {
      alertEvents {
        id
      }
    }
  }
`

export const GET_ACTIVITY_LOGS_PULSE = gql`
  query ActivitiesPulse(
    $limit: Int
    $page: Int
    $descending: Boolean
    $filters: [ActivityFilterInputTypeV2]!
  ) {
    activitiesPaginatedV2(
      limit: $limit
      page: $page
      descending: $descending
      filters: $filters
    ) {
      instances {
        __typename
        ... on AlertEventType {
          id
        }
        ... on AccessAlarmType {
          id
        }
        ... on ProfileOverrideLogType {
          id
        }
        ... on WorkShiftType {
          id
        }
      }
    }
  }
`

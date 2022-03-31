import gql from 'graphql-tag'

export const GET_ACTIVITY_LOGS = gql`
  query GetActivities(
    $filters: [ActivityFilterInputTypeV2]!
    $limit: Int
    $page: Int
    $descending: Boolean
  ) {
    activitiesPaginatedV2(
      filters: $filters
      limit: $limit
      page: $page
      descending: $descending
    ) {
      instances {
        __typename
        ... on AlertEventType {
          id
          ts
          eventHash
          severity
          tsCreated
          tsIdentifier
          accessReader {
            id
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
            tsIdentifier
            alertHash
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
              name
              timezone
              slug
            }
          }
          clip
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
              node {
                identifier
              }
            }
            site {
              id
              name
              timezone
              slug
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
              timezone
              slug
            }
            style
          }
          overridingSecurityProfile {
            id
            name
            site {
              id
              name
              timezone
              slug
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
        ... on ThreatSignaturePausePeriodType {
          idx: id
          startTs
          endTs
          cancelledTs
          cancelledBy {
            user {
              firstName
              lastName
            }
          }
          threatSignature {
            name
          }
          streams {
            name
          }
          createdBy {
            user {
              firstName
              lastName
              profile {
                img
              }
              email
            }
          }
          site {
            name
          }
          description
          cancelledDescription
          ts
        }
      }
      pages
      currentPage
      totalCount
    }
  }
`

export const DOWNLOAD_ACTIVITY_LOGS = gql`
  mutation DownloadActivities($data: DownloadActivitiesInput!) {
    downloadActivities(data: $data) {
      ok
      message
      link
    }
  }
`

export const GET_ACCESS_ALARM_TYPES = gql`
  query getAccessAlarmTypes {
    getAccessAlarmTypes
  }
`

export const GET_ACCESS_ALARMS_REGEX = gql`
  query GetAccessAlarmsMatchingRegexPaginated(
    $accountSlug: String!
    $regex: String!
    $page: Int
    $limit: Int
  ) {
    getAccessAlarmsMatchingRegexPaginated(
      accountSlug: $accountSlug
      regex: $regex
      page: $page
      limit: $limit
    ) {
      instances {
        __typename
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
            node {
              identifier
            }
          }
          site {
            id
            name
            timezone
            slug
          }
        }
        accessAlarmTypeCast {
          id
          regex
        }
      }
      pages
      totalCount
    }
  }
`

export const CREATE_ACCESS_ALARM_TYPE_CAST = gql`
  mutation CreateAccessAlarmTypeCast($input: CreateAccessAlarmTypeCastInput!) {
    createAccessAlarmTypeCast(input: $input) {
      payload {
        ok
        message
        accessAlarmTypeCast {
          id
          account {
            id
          }
          regex
          accessAlarmType
          accessAlarms {
            id
            name
          }
        }
      }
    }
  }
`

export const UPDATE_ACCESS_ALARM_TYPE_CAST = gql`
  mutation UpdateAccessAlarmTypeCast($input: UpdateAccessAlarmTypeCastInput!) {
    updateAccessAlarmTypeCast(input: $input) {
      payload {
        ok
        message
        accessAlarmTypeCast {
          id
          account {
            id
          }
          regex
          accessAlarmType
          accessAlarms {
            id
            name
          }
        }
      }
    }
  }
`

export const GET_ACCESS_ALARM_TYPE_CAST_BY_ID = gql`
  query GetAccessAlarmTypeCast($accessAlarmTypeCastId: Int) {
    getAccessAlarmTypeCast(accessAlarmTypeCastId: $accessAlarmTypeCastId) {
      id
      regex
      account {
        slug
      }
      accessAlarmType
    }
  }
`

export const GET_STREAMS = gql`
  query GetStreams(
    $accountSlug: String!
    $siteSlugs: [String]
    $incognito: Boolean
  ) {
    streamsV2(
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
      incognito: $incognito
    ) {
      id
      name
    }
  }
`

export const GET_THREAT_SIGNATURES = gql`
  query getDeployedThreatSignatures(
    $accountSlug: String!
    $alertStatusTypes: [AlertStatusTypeEnum]
  ) {
    getDeployedThreatSignatures(
      accountSlug: $accountSlug
      alertStatusTypes: $alertStatusTypes
    ) {
      id
      name
    }
  }
`

export const GET_SECURITY_PROFILES = gql`
  query GetSecurityProfilesForActivityLogFilters(
    $accountSlug: String!
    $siteSlugs: [String]
  ) {
    securityProfilesV2(accountSlug: $accountSlug, siteSlugs: $siteSlugs) {
      id
      name
    }
  }
`

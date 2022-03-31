import gql from 'graphql-tag'

export const FIND_STREAM_BY_ID = gql`
  query findStreamById($id: Int) {
    findStreamById(id: $id) {
      id
      name
      node {
        identifier
        site {
          account {
            slug
          }
          name
          slug
          timezone
        }
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
          site {
            id
            timezone
            name
            account {
              slug
            }
          }
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
          icon
        }
      }
      alertInstances {
        id
        clip
        clipS3FileName
      }
    }
  }
`

import gql from 'graphql-tag'

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
        tsIdentifier
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
            edited
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
        edited
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
        edited
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

export const DISPATCH_EXTERNAL = gql`
  mutation DispatchExternal(
    $alertEventId: Int!
    $alertEventHash: String!
    $externalProfileId: Int!
  ) {
    dispatchExternal(
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
      externalProfileId: $externalProfileId
    ) {
      ok
      message
      link
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
          firstName
        }
        img
      }
      dispatchedProfiles {
        profile {
          id
        }
        dispatchLink
      }
    }
  }
`

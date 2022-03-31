import gql from 'graphql-tag'

export const GET_SITES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      slug
      activeWorkShiftPeriods {
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
        site {
          slug
        }
        contactResource {
          id
        }
        startWorkShift {
          id
          tsCreated
        }
        endWorkShift {
          id
          tsCreated
        }
      }
    }
  }
`

export const GET_STREAMS_BY_ACCOUNT = gql`
  query FindStreamsByAccount($siteSlug: String, $accountSlug: String!) {
    findStreamsByAccount(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
      region {
        id
        name
      }
      node {
        identifier
      }
      site {
        id
        name
        slug
        timezone
      }
      active
    }
  }
`

export const GET_OPERATOR_VIDEO_WALL = gql`
  query GetOperatorVideoWall($accountSlug: String!) {
    getOperatorVideoWall(accountSlug: $accountSlug) {
      id
      name
      public
      owner {
        user {
          id
          username
          firstName
          lastName
        }
      }
      streamFeeds {
        id
        streamId
        orderIndex
        stream {
          id
          name
          active
        }
      }
      template {
        id
        name
        shape
        columnCount
        rowCount
      }
    }
  }
`

export const EDIT_VIDEO_WALL = gql`
  mutation EditVideoWall(
    $name: String
    $description: String
    $videoWallId: Int!
    $templateId: Int
    $folderId: Int
    $public: Boolean
    $streamFeeds: [StreamFeedInput]
  ) {
    editVideoWall(
      name: $name
      description: $description
      videoWallId: $videoWallId
      templateId: $templateId
      folderId: $folderId
      streamFeeds: $streamFeeds
      public: $public
    ) {
      ok
      videoWall {
        id
        name
        public
        owner {
          user {
            id
            username
            firstName
            lastName
          }
        }
        description
        streamFeeds {
          id
          streamId
          orderIndex
          stream {
            id
            name
            active
          }
        }
        template {
          id
          name
          shape
          columnCount
          rowCount
        }
      }
      message
    }
  }
`

export const EDIT_STREAM_FEED = gql`
  mutation EditStreamFeed(
    $videoWallId: Int!
    $orderIndex: Int!
    $streamId: Int
  ) {
    editStreamFeed(
      videoWallId: $videoWallId
      streamId: $streamId
      orderIndex: $orderIndex
    ) {
      ok
      streamFeed {
        id
        orderIndex
        streamId
        stream {
          id
          name
          active
        }
      }
      message
    }
  }
`

// TODO: TURNKEY NODES/SITES
export const GET_USERS = gql`
  query allActiveOrNewUsersByAccount($accountSlug: String!) {
    allActiveOrNewUsersByAccount(accountSlug: $accountSlug) {
      id
      firstName
      lastName
      email
      username
      isActive
      profile {
        id
        phoneNumber
        countryCode
        isoCode
        img
        isSignedIn
        isNewUser
        role {
          id
          name
          role
        }
        sites {
          edges {
            node {
              gid
              name
              slug
              account {
                slug
              }
            }
          }
        }
        federationProfiles {
          id
          identifier
          identitySource {
            id
            name
          }
        }
      }
    }
  }
`

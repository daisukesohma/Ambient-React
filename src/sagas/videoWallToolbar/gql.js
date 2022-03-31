import gql from 'graphql-tag'

export const GET_VIDEO_WALLS_AND_STREAMS = gql`
  query($accountSlug: String!) {
    getVideoWallsForUser(accountSlug: $accountSlug) {
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
      folder {
        id
        name
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

export const CREATE_VIDEO_WALL = gql`
  mutation($input: CreateVideoWallInput!) {
    createVideoWallV2(input: $input) {
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
        folder {
          id
        }
        description
        streamFeeds {
          id
          streamId
          orderIndex
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
        folder {
          id
        }
        description
        folder {
          id
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
      message
    }
  }
`

export const DELETE_VIDEO_WALL = gql`
  mutation DeleteVideoWall($videoWallId: Int!) {
    deleteVideoWall(videoWallId: $videoWallId) {
      ok
      message
    }
  }
`

// Folder query
export const GET_FOLDERS = gql`
  query($accountSlug: String!) {
    getFoldersForUser(accountSlug: $accountSlug) {
      id
      name
      children {
        id
        name
      }
    }
  }
`

export const CREATE_FOLDER = gql`
  mutation CreateFolder($name: String, $accountSlug: String) {
    createFolder(name: $name, accountSlug: $accountSlug) {
      ok
      folder {
        id
        name
        children {
          id
          name
        }
      }
      message
    }
  }
`

export const EDIT_FOLDER = gql`
  mutation EditFolder($name: String!, $folderId: Int!) {
    editFolder(name: $name, folderId: $folderId) {
      ok
      folder {
        id
        name
        children {
          id
          name
        }
      }
      message
    }
  }
`

export const DELETE_FOLDER = gql`
  mutation DeleteFolder($folderId: Int!) {
    deleteFolder(folderId: $folderId) {
      ok
      message
    }
  }
`

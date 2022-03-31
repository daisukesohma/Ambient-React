import gql from 'graphql-tag'

export const GET_PLAYLIST = gql`
  query($accountSlug: String!) {
    getPlaylist(accountSlug: $accountSlug) {
      id
      duration
      playlistEntries {
        id
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
      }
    }
  }
`

export const ADD_PLAYLIST_ENTRY = gql`
  mutation($input: AddPlaylistEntryInput!) {
    addPlaylistEntry(input: $input) {
      ok
      message
      playlist {
        id
        duration
        playlistEntries {
          id
          videoWall {
            id
          }
        }
      }
    }
  }
`

export const DELETE_PLAYLIST_ENTRY = gql`
  mutation($input: DeletePlaylistEntryInput!) {
    deletePlaylistEntry(input: $input) {
      ok
      message
      playlist {
        id
        duration
        account {
          slug
        }
        owner {
          id
        }
      }
    }
  }
`

export const UPDATE_PLAYLIST_ENTRY = gql`
  mutation($input: UpdatePlaylistEntryInput!) {
    updatePlaylistEntry(input: $input) {
      ok
      message
      playlist {
        id
        duration
        account {
          slug
        }
        owner {
          id
        }
      }
    }
  }
`
export const UPDATE_PLAYLIST_DURATION = gql`
  mutation($input: UpdatePlaylistDurationInput!) {
    updatePlaylistDuration(input: $input) {
      ok
      message
      playlist {
        id
        duration
      }
    }
  }
`

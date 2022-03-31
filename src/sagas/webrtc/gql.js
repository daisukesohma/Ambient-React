import gql from 'graphql-tag'

export const GET_ICE_SERVERS = gql`
  query GetIceServers(
    $userId: Int
    $alertEventId: Int
    $alertEventHash: String
  ) {
    getIceservers(
      userId: $userId
      alertEventId: $alertEventId
      alertEventHash: $alertEventHash
    ) {
      refreshAfterMs
      iceservers {
        url
        urls
        credential
        username
      }
    }
  }
`

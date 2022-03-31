import gql from 'graphql-tag'

export const GET_STREAM_REGION = gql`
  query getStreamRegion($streamId: Int) {
    getStream(streamId: $streamId) {
      region {
        name
      }
    }
  }
`

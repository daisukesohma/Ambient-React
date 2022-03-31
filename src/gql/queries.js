import gql from 'graphql-tag'

export const GET_STREAM_SNAPSHOT = gql`
  query fetchStreamSnapShot($streamId: Int) {
    getStream(streamId: $streamId) {
      id
      snapshot {
        id
        dataStr
      }
    }
  }
`

export const Fragment = {
  ALERT_EVENT_DETAILS: gql`
    fragment AlertEventDetails on AlertEventType {
      id
      eventHash
      tsIdentifier
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
        site {
          id
          name
          slug
          latlng
          account {
            slug
          }
        }
        name
      }
    }
  `,
}

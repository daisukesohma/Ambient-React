import gql from 'graphql-tag'

export const SEARCH_STREAMS = gql`
  query SearchStreamsV2($accountSlug: String, $query: String!, $limit: Int) {
    searchStreamsV2(accountSlug: $accountSlug, query: $query, limit: $limit) {
      stream {
        id
        name
        active
        snapshot {
          dataStr
        }
        node {
          identifier
        }
        site {
          timezone
          name
        }
        region {
          id
          name
        }
      }
      score
    }
  }
`

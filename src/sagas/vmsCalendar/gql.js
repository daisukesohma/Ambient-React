import gql from 'graphql-tag'

export const GET_STREAM_CATALOGUE = gql`
  query StreamCatalogue(
    $accountSlug: String!
    $siteSlug: String
    $startTs: Int
    $endTs: Int
    $streamId: Int
  ) {
    streamCatalogue(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      streamId: $streamId
    ) {
      catalogue {
        streamId
        endTs
        startTs
        midnight
      }
    }
  }
`

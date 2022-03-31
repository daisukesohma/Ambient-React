import { gql } from 'apollo-boost'

const GET_STREAM_CATALOGUE = gql`
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
      entitySelections {
        id
        name
        friendly
        icon
        subtags
        allowSearch
        children {
          id
          name
        }
        configs {
          id
        }
      }
      availableDays
      catalogue {
        streamId
        endTs
        startTs
        midnight
      }
      retention {
        width
        nonmotionSegmentRetentionDays
        bitrate
        motionSegmentRetentionDays
        height
      }
    }
  }
`

const GET_META_DATA_BY_STREAM = gql`
  query metadataByStream(
    $accountSlug: String
    $siteSlug: String
    $streamId: Int
    $metadataTypes: [String]
    $startTs: Int
    $endTs: Int
    $aggSize: String
  ) {
    metadataByStream(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      streamId: $streamId
      metadataTypes: $metadataTypes
      aggSize: $aggSize
    ) {
      status
      metadata {
        hits {
          hits {
            empty
          }
          total {
            value
          }
          maxScore
        }
        Shards {
          successful
          failed
          skipped
          total
        }
        took
        aggregations {
          byTimeUnit {
            buckets {
              keyAsString
              key
              docCount
            }
          }
        }
        timedOut
      }
    }
  }
`

const DISPATCH_ALERT = gql`
  mutation customAlertEvent(
    $streamId: Int
    $siteSlug: String
    $accountSlug: String
    $ts: String
    $name: String
  ) {
    customAlertEvent(
      streamId: $streamId
      siteSlug: $siteSlug
      accountSlug: $accountSlug
      ts: $ts
      name: $name
    ) {
      ok
      message
    }
  }
`

const GET_STREAM = gql`
  query getStream(
    $streamId: Int
    $modelType: String
    $modelId: Int
    $modelHash: String
  ) {
    getStream(
      streamId: $streamId
      modelType: $modelType
      modelId: $modelId
      modelHash: $modelHash
    ) {
      node {
        identifier
      }
      site {
        timezone
      }
      id
      snapshot {
        dataStr
        updatedTs
      }
    }
  }
`

export {
  GET_STREAM_CATALOGUE,
  GET_META_DATA_BY_STREAM,
  GET_STREAM,
  DISPATCH_ALERT,
}

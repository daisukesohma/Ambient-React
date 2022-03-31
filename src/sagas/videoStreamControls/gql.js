import gql from 'graphql-tag'

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

// SNAPSHOTS
const GET_SNAPSHOTS_BY_STREAM = gql`
  query($streamId: Int!, $startTs: Int!) {
    getStreamSnapshotsAfterTimestamp(streamId: $streamId, startTs: $startTs) {
      ok
      snapshots {
        snapshotUrl
        snapshotTs
      }
    }
  }
`

const RESULTS_BY_SITE = gql`
  query forensicsResultsBySite(
    $accountSlug: String!
    $siteSlug: String!
    $startTs: Int!
    $endTs: Int!
    $query: QueryInput!
    $regionIds: [Int]
    $streamIds: [Int]
    $limit: Int
    $page: Int
  ) {
    forensicsResultsBySite(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      query: $query
      regionIds: $regionIds
      streamIds: $streamIds
      limit: $limit
      page: $page
    ) {
      ok
      searchType
      instances {
        stream {
          id
          name
          active
          node {
            identifier
          }
          site {
            name
            slug
          }
          region {
            id
            name
          }
        }
        ts
        snapshotUrl
      }
      pages
      currentPage
      totalCount
    }
  }
`

// SEARCH SUGGESTIONS
const GET_SEARCH_SUGGESTIONS = gql`
  query suggestionsByAccount($accountSlug: String!) {
    getSearchSuggestionsByAccount(accountSlug: $accountSlug) {
      ok
      searchSuggestions {
        searchType
        params {
          __typename
          ... on ThreatSignatureSearchSuggestion {
            name
            threatSignatureId
            performanceStatus
          }
          ... on EntitySearchSuggestion {
            name
            aggSize
            query
          }
          ... on AccessAlarmSearchSuggestion {
            name
            accessAlarmType
          }
        }
      }
    }
  }
`

export {
  GET_STREAM_CATALOGUE,
  GET_META_DATA_BY_STREAM,
  GET_SNAPSHOTS_BY_STREAM,
  GET_SEARCH_SUGGESTIONS,
  DISPATCH_ALERT,
  RESULTS_BY_SITE,
}

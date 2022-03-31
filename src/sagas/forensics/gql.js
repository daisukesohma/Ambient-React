import gql from 'graphql-tag'

// REGIONS
export const GET_ALL_REGIONS = gql`
  query($accountSlug: String, $siteSlug: String) {
    allRegions(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
    }
  }
`

// SITES
export const GET_SITES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      slug
      timezone
    }
  }
`

// SNAPSHOTS
export const GET_SNAPSHOTS_BY_STREAM = gql`
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

// SEARCH SUGGESTIONS
export const GET_SEARCH_SUGGESTIONS = gql`
  query suggestionsByAccount($accountSlug: String!) {
    getSearchSuggestionsByAccount(accountSlug: $accountSlug) {
      searchSuggestions {
        searchType
        params {
          __typename
          ... on ThreatSignatureSearchSuggestion {
            name
            threatSignatureId
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

export const RESULTS_BY_SITE = gql`
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
            retentionMotionDays
            retentionNonmotionDays
          }
          site {
            name
            timezone
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

export const RESULTS_BY_SITE_REGION_STATS = gql`
  query forensicsResultsBySiteRegionStats(
    $accountSlug: String!
    $siteSlug: String!
    $startTs: Int!
    $endTs: Int!
    $query: QueryInput!
  ) {
    forensicsResultsBySiteRegionStats(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      query: $query
    ) {
      ok
      regionStats {
        regionPk
        count
      }
      streamStats {
        stream {
          id
          active
        }
        count
      }
    }
  }
`

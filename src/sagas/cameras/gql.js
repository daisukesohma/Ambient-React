import gql from 'graphql-tag'

// SITES
export const GET_SITES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      timezone
      slug
    }
  }
`

export const GET_STREAMS_PAGINATED = gql`
  query GetStreamsPaginated(
    $accountSlug: String!
    $siteSlug: String!
    $limit: Int
    $page: Int
    $search: String
    $sortBy: String
    $sortOrder: Int
  ) {
    streamsPaginated(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      limit: $limit
      page: $page
      search: $search
      active: true
      incognito: false
      includeHealthStats: true
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      instances {
        id
        name
        hostname
        node {
          identifier
        }
        site {
          timezone
        }
        region {
          name
        }
        tsAdded
        healthStatus
        fps
        ping
      }
      pages
      currentPage
      totalCount
    }
  }
`

export const GET_ALL_STREAM_IDS_FOR_SITE = gql`
  query GetAllStreamIdsForSite(
    $accountSlug: String!
    $siteSlug: String!
    $limit: Int
  ) {
    streamsPaginated(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      limit: $limit
      page: 1
      active: true
      incognito: false
    ) {
      instances {
        id
      }
    }
  }
`

export const CHANGE_STREAM_SITE = gql`
  mutation($data: [ChangeStreamSiteInput]!) {
    changeStreamSite(data: $data) {
      ok
      message
    }
  }
`

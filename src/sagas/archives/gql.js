import gql from 'graphql-tag'

export const GET_SITES_BY_ACCOUNT = gql`
  query AllSitesByAccount($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      slug
      name
      timezone
    }
  }
`

export const GET_ARCHIVED_CLIPS = gql`
  query StreamExportsPaginated(
    $accountSlug: String!
    $siteSlug: String!
    $startTs: Float
    $endTs: Float
    $page: Int
    $limit: Int
    $streamIds: [Int]
  ) {
    streamExportsPaginated(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      startTs: $startTs
      endTs: $endTs
      page: $page
      limit: $limit
      streamIds: $streamIds
    ) {
      pages
      currentPage
      instances {
        id
        startTs
        endTs
        status
        stream {
          id
          name
          active
        }
        signedUrl
        uniq
      }
    }
  }
`

export const DELETE_CLIP = gql`
  mutation deleteStreamExport($uniq: String!) {
    deleteStreamExport(uniq: $uniq) {
      uniq
      ok
      message
    }
  }
`

export const GET_STREAMS = gql`
  query GetStreams(
    $accountSlug: String!
    $siteSlug: String!
    $limit: Int
    $page: Int
  ) {
    streamsPaginated(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      limit: $limit
      page: $page
      active: true
      incognito: false
    ) {
      instances {
        id
        name
        node {
          identifier
        }
        site {
          timezone
        }
      }
      pages
      currentPage
    }
  }
`

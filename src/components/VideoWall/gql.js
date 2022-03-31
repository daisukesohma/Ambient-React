import gql from 'graphql-tag'

export const GET_STREAMS = gql`
  query GetStreams(
    $accountSlug: String!
    $siteSlug: String!
    $limit: Int
    $page: Int
    $active: Boolean
    $incognito: Boolean
  ) {
    streamsPaginated(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      limit: $limit
      page: $page
      active: $active
      incognito: $incognito
    ) {
      instances {
        id
        name
        node {
          identifier
          site {
            id
            name
          }
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

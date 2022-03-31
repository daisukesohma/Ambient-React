import gql from 'graphql-tag'

// Input: account slug
// Output: list of sites and all appliances (nodes) attached
export const ALL_SITES_BY_ACCOUNT = gql`
  query AllSitesByAccount($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      slug
      name
      address
      latlng
      siteType {
        name
      }
      nodes {
        identifier
        name
      }
    }
  }
`

export const CREATE_SITE = gql`
  mutation CreateSite($siteData: SiteInput!) {
    createSite(siteData: $siteData) {
      ok
      siteSlug
      siteId
      siteName
    }
  }
`

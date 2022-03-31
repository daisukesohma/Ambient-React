import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'

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

const useSitesByAccount = accountSlug => {
  const { loading, error, data } = useQuery(ALL_SITES_BY_ACCOUNT, {
    variables: {
      accountSlug,
    },
  })

  return {
    loading,
    error,
    data: get(data, 'allSitesByAccount'),
  }
}

export default useSitesByAccount

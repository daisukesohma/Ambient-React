import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'

export const FIND_STREAMS_BY_ACCOUNT = gql`
  query FindStreamsByAccount($siteSlug: String, $accountSlug: String!) {
    findStreamsByAccount(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      identifier
      name
      hostname
      port
      path
      username
      password
      node {
        identifier
        site {
          name
          slug
          account {
            name
            slug
          }
          timezone
        }
      }
      nodeDiscoveryRequests {
        id
        status
      }
      active
    }
  }
`

// Mandatorily takes account slug, and optionally site slug
// FUTURE @Eric Potentially remove this hook, since only used once.
//
function useFindStreamsByAccount(accountSlug, siteSlug = null) {
  const { loading, error, data } = useQuery(FIND_STREAMS_BY_ACCOUNT, {
    variables: {
      accountSlug,
      siteSlug,
    },
  })

  return {
    loading,
    error,
    data: get(data, 'findStreamsByAccount'),
  }
}

export default useFindStreamsByAccount

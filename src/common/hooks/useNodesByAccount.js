import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'

export const ALL_NODES_BY_ACCOUNT = gql`
  query AllNodesByAccount($accountSlug: String!) {
    allNodesByAccount(accountSlug: $accountSlug) {
      identifier
      name
      buildVersion
    }
  }
`
const useNodesByAccount = accountSlug => {
  const { loading, error, data } = useQuery(ALL_NODES_BY_ACCOUNT, {
    variables: {
      accountSlug,
    },
  })

  return {
    loading,
    error,
    data: get(data, 'allNodesByAccount', []),
  }
}

export default useNodesByAccount

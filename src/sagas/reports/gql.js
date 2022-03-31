/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the ActivityDashboard
 */
import { gql } from 'apollo-boost'

export const GET_ACCOUNT_SITES = gql`
  query GetAccountSites($accountSlug: String!) {
    allSites(accountSlug: $accountSlug) {
      id
      name
      slug
      timezone
    }
  }
`

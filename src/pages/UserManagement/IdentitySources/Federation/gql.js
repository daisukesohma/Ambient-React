/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_AZURE_USER_LIST = gql`
  query getAzureUserList($identitySourceId: Int!) {
    getAzureUserList(identitySourceId: $identitySourceId) {
      userPrincipalName
      surname
      givenName
      id
    }
  }
`

export const CREATE_FEDERATION_PROFILES = gql`
  mutation createFederationProfiles(
    $profileIds: [Int]
    $identifiers: [String]
    $usernames: [String]
    $identitySourceId: Int!
  ) {
    createFederationProfiles(
      profileIds: $profileIds
      identifiers: $identifiers
      identitySourceId: $identitySourceId
      usernames: $usernames
    ) {
      ok
      federationProfiles {
        id
      }
      message
    }
  }
`

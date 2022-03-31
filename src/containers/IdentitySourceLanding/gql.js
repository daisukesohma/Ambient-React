/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_FEDERATION_PROFILES = gql`
  query getFederationProfiles {
    getFederationProfiles {
      id
    }
  }
`

export const CREATE_IDENTITY_SOURCE_REQUESTS = gql`
  mutation createIdentitySourceRequests($identitySourceIds: [Int]) {
    createIdentitySourceRequests(identitySourceIds: $identitySourceIds) {
      ok
      identitySourceRequests {
        id
      }
      message
    }
  }
`

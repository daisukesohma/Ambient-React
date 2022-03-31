/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_IDENTITY_SOURCE_TYPES = gql`
  query identitySourceTypes {
    identitySourceTypes {
      name
      id
    }
  }
`

export const GET_IDENTITY_SOURCES = gql`
  query getIdentitySourcesForAccount($accountSlug: String!) {
    getIdentitySourcesForAccount(accountSlug: $accountSlug) {
      id
      sourceType {
        id
        name
      }
      name
      active
      config
      identitySourceRequests {
        id
        status
        tsCreated
        tsEnd
      }
      lastSyncRequest {
        id
        status
        tsCreated
        tsEnd
        details
      }
      federationProfiles {
        id
        profile {
          id
        }
      }
    }
  }
`

export const CREATE_IDENTITY_SOURCE = gql`
  mutation CreateIdentitySource(
    $sourceTypeId: Int!
    $accountSlug: String!
    $name: String
    $config: String!
  ) {
    createIdentitySource(
      sourceTypeId: $sourceTypeId
      accountSlug: $accountSlug
      name: $name
      config: $config
    ) {
      ok
      identitySource {
        name
        id
      }
      message
    }
  }
`

export const UPDATE_IDENTITY_SOURCE = gql`
  mutation UpdateIdentitySource(
    $identitySourceId: Int!
    $sourceTypeId: Int!
    $accountSlug: String!
    $name: String
    $config: String!
  ) {
    updateIdentitySource(
      identitySourceId: $identitySourceId
      sourceTypeId: $sourceTypeId
      accountSlug: $accountSlug
      name: $name
      config: $config
    ) {
      ok
      identitySource {
        name
        id
      }
      message
    }
  }
`

export const DEACTIVATE_IDENTITY_SOURCE = gql`
  mutation deactivateIdentitySource(
    $identitySourceId: Int!
    $accountSlug: String!
  ) {
    deactivateIdentitySource(
      identitySourceId: $identitySourceId
      accountSlug: $accountSlug
    ) {
      ok
      message
    }
  }
`

export const ACTIVATE_IDENTITY_SOURCE = gql`
  mutation ActivateIdentitySource(
    $identitySourceId: Int!
    $accountSlug: String!
  ) {
    activateIdentitySource(
      identitySourceId: $identitySourceId
      accountSlug: $accountSlug
    ) {
      ok
      message
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

export const DEACTIVATE_UNFEDERATED_USERS = gql`
  mutation deactivateUnfederatedUsers($accountSlug: String!) {
    deactivateUnfederatedUsers(accountSlug: $accountSlug) {
      ok
      message
    }
  }
`

/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_ROLES = gql`
  query getUserRoles($accountSlug: String) {
    getUserRoles(accountSlug: $accountSlug) {
      id
      name
    }
  }
`

// TODO: TURNKEY NODES/SITES
export const GET_USERS = gql`
  query allActiveOrNewUsersByAccount($accountSlug: String!) {
    allActiveOrNewUsersByAccount(accountSlug: $accountSlug) {
      id
      firstName
      lastName
      email
      username
      isActive
      profile {
        id
        phoneNumber
        countryCode
        isoCode
        img
        isSignedIn
        isNewUser
        inviteLink
        accepted
        role {
          id
          name
          role
        }
        sites {
          edges {
            node {
              gid
              name
              slug
              account {
                slug
              }
            }
          }
        }
        federationProfiles {
          id
          identifier
          identitySource {
            id
            name
          }
        }
        lastWorkShiftPeriod {
          startWorkShift {
            id
          }
          endWorkShift {
            id
          }
          contactResource {
            id
          }
          site {
            slug
            name
          }
        }
      }
    }
  }
`

export const GET_USERS_PAGINATED = gql`
  query allActiveOrNewUsersByAccountPaginated(
    $accountSlug: String!
    $page: Int
    $limit: Int
    $searchQuery: String
    $siteSlugs: [String]
    $roleIds: [Int]
  ) {
    allActiveOrNewUsersByAccountPaginated(
      accountSlug: $accountSlug
      page: $page
      limit: $limit
      searchQuery: $searchQuery
      siteSlugs: $siteSlugs
      roleIds: $roleIds
    ) {
      instances {
        id
        firstName
        lastName
        email
        username
        isActive
        profile {
          id
          phoneNumber
          countryCode
          isoCode
          img
          isSignedIn
          isNewUser
          inviteLink
          accepted
          role {
            id
            name
            role
          }
          sites {
            edges {
              node {
                gid
                name
                slug
                account {
                  slug
                }
              }
            }
          }
          federationProfiles {
            id
            identifier
            identitySource {
              id
              name
            }
          }
          lastWorkShiftPeriod {
            startWorkShift {
              id
            }
            endWorkShift {
              id
            }
            contactResource {
              id
            }
            site {
              slug
              name
            }
          }
        }
      }
      pages
      currentPage
      totalCount
    }
  }
`

export const CREATE_USER = gql`
  mutation createUser(
    $phoneNumber: String
    $firstName: String!
    $lastName: String!
    $accountSlug: String!
    $img: Upload
    $sites: [Int]
    $role: Int
    $countryCode: String
    $isoCode: String
    $email: String
  ) {
    createUser(
      phoneNumber: $phoneNumber
      firstName: $firstName
      lastName: $lastName
      accountSlug: $accountSlug
      img: $img
      sites: $sites
      role: $role
      countryCode: $countryCode
      isoCode: $isoCode
      email: $email
    ) {
      ok
      message
      id
      user {
        id
        firstName
        lastName
        email
        username
        isActive
        profile {
          id
          phoneNumber
          countryCode
          isoCode
          img
          isSignedIn
          isNewUser
          inviteLink
          accepted
          role {
            id
            name
            role
          }
          sites {
            edges {
              node {
                gid
                name
                slug
                account {
                  slug
                }
              }
            }
          }
          federationProfiles {
            id
            identifier
            identitySource {
              id
              name
            }
          }
        }
      }
    }
  }
`
export const UPDATE_USER = gql`
  mutation updateProfile(
    $phoneNumber: String
    $firstName: String
    $lastName: String
    $img: Upload
    $sites: [Int]
    $role: Int
    $countryCode: String
    $isoCode: String
    $email: String
    $profileId: Int!
  ) {
    updateProfile(
      profileId: $profileId
      phoneNumber: $phoneNumber
      firstName: $firstName
      lastName: $lastName
      img: $img
      sites: $sites
      role: $role
      countryCode: $countryCode
      isoCode: $isoCode
      email: $email
    ) {
      ok
      id
      message
      user {
        id
        firstName
        lastName
        email
        username
        isActive
        profile {
          id
          phoneNumber
          countryCode
          isoCode
          img
          isSignedIn
          isNewUser
          inviteLink
          accepted
          role {
            id
            name
            role
          }
          sites {
            edges {
              node {
                gid
                name
                slug
                account {
                  slug
                }
              }
            }
          }
          federationProfiles {
            id
            identifier
            identitySource {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const DEACTIVATE_USER = gql`
  mutation deactivateUser($accountSlug: String!, $userId: Int!) {
    deactivateUser(accountSlug: $accountSlug, userId: $userId) {
      ok
      id
      message
    }
  }
`
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

export const GET_LOGIN_EVENTS = gql`
  query usersLoginEvents(
    $profileId: Int!
    $startTs: Int
    $endTs: Int
    $page: Int
    $limit: Int
    $desc: Boolean
  ) {
    usersLoginEvents(
      profileId: $profileId
      startTs: $startTs
      endTs: $endTs
      page: $page
      limit: $limit
      desc: $desc
    ) {
      pages
      currentPage
      totalCount
      instances {
        id
        type
        status
        ts
      }
    }
  }
`

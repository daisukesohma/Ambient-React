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
      id
      message
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

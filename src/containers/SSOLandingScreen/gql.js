/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const AUTH_INFO_BY_TOKEN = gql`
  query GetAuthInformationByToken($token: String!) {
    getAuthInformationByToken(token: $token) {
      user {
        firstName
        lastName
        username
        email
        id
      }
      profile {
        id
        countryCode
        isoCode
        phoneNumber
        mfaOptIn
        img
        internal
        hmNotificationsOptIn {
          method
          id
        }
        role {
          role
          id
          permissionList
        }
      }
      accounts {
        slug
        name
        features {
          id
          feature
        }
      }
      sites {
        id
        slug
        name
      }
      message
      ok
    }
  }
`

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`

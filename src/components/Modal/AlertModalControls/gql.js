/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_EXTERNAL_PROFILES_BY_ACCOUNT = gql`
  query GetExternalProfilesByAccount($accountSlug: String!) {
    getExternalProfilesByAccount(accountSlug: $accountSlug) {
      id
      name
      phoneNumber
      email
      createdBy {
        id
        firstName
        lastName
        profile {
          img
          id
        }
      }
    }
  }
`

export const GET_PROFILES_BY_SITE = gql`
  query GetProfilesBySite(
    $accountSlug: String!
    $siteSlug: String!
    $isActive: Boolean
  ) {
    getProfilesBySite(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      isActive: $isActive
    ) {
      id
      user {
        id
        firstName
        lastName
        email
      }
      img
      role {
        name
      }
      lastWorkShiftPeriod {
        id
        contactResource {
          id
          name
          phoneNumber
          email
          contactResourceType
        }
      }
      isSignedIn
    }
  }
`

export const CREATE_EXTERNAL_PROFILE = gql`
  mutation CreateExternalProfile(
    $accountSlug: String!
    $name: String!
    $email: String!
    $phoneNumber: String!
  ) {
    createExternalProfile(
      accountSlug: $accountSlug
      name: $name
      email: $email
      phoneNumber: $phoneNumber
    ) {
      ok
      externalProfile {
        id
        name
        phoneNumber
        email
      }
    }
  }
`

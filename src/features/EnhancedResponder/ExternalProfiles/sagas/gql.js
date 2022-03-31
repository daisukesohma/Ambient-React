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

export const CREATE_EXTERNAL_PROFILE = gql`
  mutation CreateExternalProfileV2($input: CreateExternalProfileV2Input!) {
    createExternalProfileV2(input: $input) {
      externalProfile {
        id
        name
        phoneNumber
        email
      }
    }
  }
`

export const DELETE_EXTERNAL_PROFILE = gql`
  mutation DeleteExternalProfileV2($input: DeleteExternalProfileV2Input!) {
    deleteExternalProfileV2(input: $input) {
      ok
      id
      message
    }
  }
`

export const UPDATE_EXTERNAL_PROFILE = gql`
  mutation UpdateExternalProfile($input: UpdateExternalProfileInput!) {
    updateExternalProfile(input: $input) {
      ok
      id
      message
    }
  }
`

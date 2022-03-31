import gql from 'graphql-tag'

export const VERIFY_AUTH_TOKEN = gql`
  mutation VerifyTokenV2($input: VerifyTokenInput!) {
    verifyTokenV2(input: $input) {
      payload
      data {
        user {
          id
          firstName
          lastName
          username
          email
          groups {
            id
            name
          }
        }
        profile {
          id
          isSignedIn
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
          lastWorkShiftPeriod {
            id
            endWorkShift {
              workShiftPeriodEnded {
                id
              }
            }
            contactResource {
              id
              name
            }
            site {
              id
              slug
              name
            }
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
        nodes {
          identifier
        }
      }
    }
  }
`

export const VERIFY_ACCOUNTS = gql`
  mutation VerifyUserAccounts($input: VerifyTokenInput!) {
    verifyTokenV2(input: $input) {
      data {
        accounts {
          slug
          name
          features {
            id
            feature
          }
        }
      }
    }
  }
`

export const VERIFY_SITES = gql`
  query GetAccountSites($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      slug
      timezone
      nodes {
        identifier
        name
        activeStreamCount
      }
    }
  }
`

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      payload
    }
  }
`

export const REVOKE_AUTH_TOKEN = gql`
  mutation RevokeToken($refreshToken: String!) {
    revokeToken(refreshToken: $refreshToken) {
      revoked
    }
  }
`
export const LOG_OUT_USER = gql`
  mutation logoutUser {
    logoutUser {
      ok
      message
    }
  }
`

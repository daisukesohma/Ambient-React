import gql from 'graphql-tag'

export const CHECK_MFA = gql`
  mutation checkMultiFactorAuthentication(
    $input: CheckMultiFactorAuthenticationInput!
  ) {
    checkMultiFactorAuthentication(input: $input) {
      ok
      message
      mfaEnabled
    }
  }
`

export const TOKEN_AUTH = gql`
  mutation TokenAuth($username: String!, $password: String!, $code: String) {
    tokenAuth(username: $username, password: $password, code: $code) {
      token
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
        ok
        message
      }
    }
  }
`

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

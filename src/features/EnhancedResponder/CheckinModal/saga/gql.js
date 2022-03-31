import gql from 'graphql-tag'

export const GET_CONTACT_RESOURCES = gql`
  query ContactResources($accountSlug: String!, $siteSlugs: [String]) {
    contactResources(accountSlug: $accountSlug, siteSlugs: $siteSlugs) {
      id
      name
      phoneNumber
      email
      contactResourceType
      lastWorkShiftPeriod {
        id
        profile {
          id
          img
          user {
            id
            firstName
            lastName
            email
          }
        }
        endWorkShift {
          signIn
          workShiftPeriodEnded {
            id
          }
        }
        site {
          id
          slug
          name
        }
      }
      site {
        id
        slug
        name
      }
      createdBy {
        id
        user {
          id
          username
          firstName
          lastName
          profile {
            img
            id
          }
        }
      }
    }
  }
`

export const CREATE_WORKSHIFT = gql`
  mutation createOrEndWorkShift($input: CreateOrEndWorkShiftInput!) {
    createOrEndWorkShift(input: $input) {
      ok
      message
      workShiftPeriod {
        id
        startWorkShift {
          id
        }
        endWorkShift {
          signIn
          workShiftPeriodEnded {
            id
          }
        }
        site {
          id
          slug
          name
        }
        contactResource {
          id
        }
        profile {
          id
          img
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`

// TODO: TURNKEY: node/site is this affected?
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
        isSignedIn
        lastWorkShiftPeriod {
          id
          endWorkShift {
            id
          }
        }
        role {
          name
        }
        img
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
      }
    }
  }
`

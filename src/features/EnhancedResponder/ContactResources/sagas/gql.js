import gql from 'graphql-tag'

export const GET_CONTACT_RESOURCES = gql`
  query ContactResources(
    $accountSlug: String!
    $siteSlugs: [String]
    $contactResourceType: String
  ) {
    contactResources(
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
      contactResourceType: $contactResourceType
    ) {
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

export const CREATE_CONTACT_RESOURCE = gql`
  mutation CreateContactResource($input: CreateContactResourceInput!) {
    createContactResource(input: $input) {
      ok
      message
      contactResource {
        id
        name
        phoneNumber
        email
        contactResourceType
        site {
          id
          slug
          name
        }
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
  }
`

export const UPDATE_CONTACT_RESOURCE = gql`
  mutation UpdateContactResource($input: UpdateContactResourceInput!) {
    updateContactResource(input: $input) {
      ok
      message
      contactResource {
        id
        account {
          slug
          name
        }
        name
        phoneNumber
        email
        contactResourceType
        site {
          id
          slug
          name
        }
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
  }
`

export const DELETE_CONTACT_RESOURCE = gql`
  mutation DeleteContactResource($input: DeleteContactResourceInput!) {
    deleteContactResource(input: $input) {
      ok
      message
      contactResourceId
    }
  }
`

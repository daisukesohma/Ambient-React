import { gql } from 'apollo-boost'

export const GET_SECURITY_PROFILE_SELECTOR_INFORMATION = gql`
  query GetSecurityProfileSelectorInformation(
    $siteSlug: String!
    $accountSlug: String!
  ) {
    overriddenSecurityProfile(siteSlug: $siteSlug, accountSlug: $accountSlug) {
      id
      overrideLog {
        id
        user {
          id
          firstName
          lastName
          email
        }
        overriddenSecurityProfile {
          id
          name
        }
      }
    }
    securityProfiles(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
      style
      active
    }
  }
`

export const CHANGE_SECURITY_PROFILE = gql`
  mutation ChangeSecurityProfile(
    $siteSlug: String
    $accountSlug: String
    $securityProfileId: Int
  ) {
    changeSecurityProfile(
      siteSlug: $siteSlug
      accountSlug: $accountSlug
      securityProfileId: $securityProfileId
    ) {
      ok
      message
      overriddenSecurityProfile {
        id
        name
      }
      overridingSecurityProfile {
        id
        name
      }
    }
  }
`

import gql from 'graphql-tag'

export const GET_SITES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      slug
      timezone
    }
  }
`

export const GET_SECURITY_PROFILES = gql`
  query GetSecurityProfiles(
    $accountSlug: String!
    $siteSlug: String!
    $active: Boolean
  ) {
    securityProfiles(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      active: $active
    ) {
      id
      name
      escalationPoliciesForSev {
        severity
        escalationPolicy {
          name
          id
          levels {
            id
            level
            speech
            durationSecs
            contacts {
              id
              method
              profile {
                id
                user {
                  firstName
                  lastName
                }
                img
                isSignedIn
                role {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

export const CREATE_ESCALATION_LEVEL = gql`
  mutation CreateEscalationLevel(
    $accountSlug: String
    $siteSlug: String
    $policyId: Int
    $level: Int
    $durationSecs: Int
    $contactIds: [Int]
    $speech: Boolean
  ) {
    createEscalationLevel(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      policyId: $policyId
      level: $level
      durationSecs: $durationSecs
      contactIds: $contactIds
      speech: $speech
    ) {
      ok
      escalationLevel {
        id
        policy {
          id
        }
        level
        durationSecs
        speech
        contacts {
          id
          method
          profile {
            user {
              firstName
              lastName
            }
            img
            isSignedIn
            role {
              name
            }
          }
        }
      }
    }
  }
`

export const UPDATE_ESCALATION_LEVEL = gql`
  mutation updateEscalationLevel(
    $accountSlug: String
    $siteSlug: String
    $levelId: Int
    $durationSecs: Int
  ) {
    updateEscalationLevel(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      levelId: $levelId
      durationSecs: $durationSecs
    ) {
      ok
    }
  }
`

export const DELETE_ESCALATION_LEVEL = gql`
  mutation deleteEscalationLevel(
    $accountSlug: String
    $siteSlug: String
    $levelId: Int
  ) {
    deleteEscalationLevel(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      levelId: $levelId
    ) {
      ok
    }
  }
`

export const UPDATE_ESCALATION_CONTACT = gql`
  mutation addEscalationContactToLevel(
    $methods: [String]!
    $profileId: Int!
    $siteSlug: String!
    $accountSlug: String!
    $escalationLevelId: Int!
  ) {
    addEscalationContactToLevel(
      methods: $methods
      profileId: $profileId
      siteSlug: $siteSlug
      accountSlug: $accountSlug
      escalationLevelId: $escalationLevelId
    ) {
      ok
      escalationLevel {
        id
        policy {
          id
        }
        contacts {
          id
          method
          profile {
            id
            user {
              firstName
              lastName
            }
            img
            isSignedIn
            role {
              name
            }
          }
        }
      }
    }
  }
`

export const DELETE_ESCALATION_CONTACT = gql`
  mutation removeEscalationContactFromLevel(
    $profileId: Int!
    $methods: [String]!
    $escalationLevelId: Int!
  ) {
    removeEscalationContactFromLevel(
      profileId: $profileId
      methods: $methods
      escalationLevelId: $escalationLevelId
    ) {
      ok
      escalationContacts {
        id
      }
    }
  }
`

export const GET_NOTIFICATION_METHODS = gql`
  {
    getNotificationMethods {
      id
      method
    }
  }
`

export const GET_PROFILES = gql`
  query getProfilesBySite(
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
        firstName
        lastName
        username
      }
      img
    }
  }
`

export const UPDATE_ESCALATION_POLICY_FOR_SEV = gql`
  mutation createOrUpdateEscalationPolicyForSev(
    $securityProfileId: Int!
    $severity: String!
    $policyId: Int!
  ) {
    createOrUpdateEscalationPolicyForSev(
      securityProfileId: $securityProfileId
      severity: $severity
      policyId: $policyId
    ) {
      ok
      message
      escalationPolicyForSev {
        severity
        escalationPolicy {
          name
          id
          levels {
            id
            level
            speech
            durationSecs
            contacts {
              id
              method
              profile {
                id
                user {
                  firstName
                  lastName
                }
                img
                isSignedIn
                role {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

export const CREATE_ESCALATION_POLICY = gql`
  mutation createEscalationPolicy($siteId: Int, $name: String) {
    createEscalationPolicy(siteId: $siteId, name: $name) {
      ok
      message
      escalationPolicy {
        id
        name
        escalationPoliciesForSev {
          severity
          securityProfile {
            name
            site {
              name
            }
          }
        }
      }
    }
  }
`

export const GET_ESCALATION_POLICIES = gql`
  query escalationPolicies($accountSlug: String!, $siteSlug: String!) {
    escalationPolicies(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
      escalationPoliciesForSev {
        severity
        securityProfile {
          name
          site {
            name
          }
        }
      }
    }
  }
`

export const DELETE_ESCALATION_POLICY = gql`
  mutation deleteEscalationPolicy($policyId: Int) {
    deleteEscalationPolicy(policyId: $policyId) {
      ok
      message
    }
  }
`

export const GET_ESCALATION_POLICY = gql`
  query getEscalationPolicy($id: Int!) {
    getEscalationPolicy(id: $id) {
      name
      id
      levels {
        id
        level
        speech
        durationSecs
        contacts {
          id
          method
          profile {
            id
            user {
              firstName
              lastName
            }
            img
            isSignedIn
            role {
              name
            }
          }
        }
      }
      escalationPoliciesForSev {
        id
        severity
        securityProfile {
          id
          name
          site {
            id
            name
          }
        }
      }
    }
  }
`

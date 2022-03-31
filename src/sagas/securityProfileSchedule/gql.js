import gql from 'graphql-tag'

export const GET_SECURITY_PROFILE_SCHEDULE = gql`
  query GetSecurityProfileSchedule($accountSlug: String!, $siteSlug: String!) {
    securityProfileSchedule(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      day
      startSecs
      endSecs
      securityProfile {
        id
        name
      }
    }
  }
`

export const UPDATE_SECURITY_PROFILE_SCHEDULE = gql`
  mutation UpdateSecurityProfileSchedule(
    $accountSlug: String
    $siteSlug: String
    $schedule: [ProfileTimeInput]
  ) {
    updateSecurityProfileSchedule(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      schedule: $schedule
    ) {
      ok
      message
    }
  }
`

/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

const AlertDetailsFragment = gql`
  fragment AlertDetails on AlertType {
    id
    severity
    verificationType
    verificationTypeOverride
    status
    threatSignature {
      verificationType
    }
    defaultAlert {
      id
      name
      severity
      regions {
        id
        name
      }
      threatSignature {
        id
        name
      }
    }
  }
`

export const GET_SECURITY_PROFILES = gql`
  query SecurityProfiles($accountSlug: String!, $siteSlugs: [String]) {
    securityProfilesV2(accountSlug: $accountSlug, siteSlugs: $siteSlugs) {
      id
      name
      alerts {
        ...AlertDetails
      }
    }
  }
  ${AlertDetailsFragment}
`

export const GET_VERIFICATION_TYPES = gql`
  query VerificationTypes {
    verificationTypes {
      key
      name
    }
  }
`

export const GET_SEVERITIES = gql`
  query Severities {
    severities {
      key
      name
    }
  }
`

export const UPDATE_SEV_ON_ALERT = gql`
  mutation updateSevOnAlert(
    $alertId: Int!
    $severity: String!
    $securityProfileId: Int!
  ) {
    updateSevOnAlert(
      alertId: $alertId
      severity: $severity
      securityProfileId: $securityProfileId
    ) {
      ok
      message
      alert {
        ...AlertDetails
      }
    }
  }
  ${AlertDetailsFragment}
`

export const UPDATE_VERIFICATION_TYPE = gql`
  mutation updateVerificationTypeOnAlert(
    $alertId: Int!
    $verificationTypeOverride: String
  ) {
    updateVerificationTypeOnAlert(
      alertId: $alertId
      verificationTypeOverride: $verificationTypeOverride
    ) {
      ok
      message
      alert {
        ...AlertDetails
      }
    }
  }
  ${AlertDetailsFragment}
`

export const ENABLE_ALERT = gql`
  mutation enableAlert($id: Int!, $status: String!) {
    enableAlert(id: $id, status: $status) {
      ok
      message
      alert {
        ...AlertDetails
      }
    }
  }
  ${AlertDetailsFragment}
`

export const DISABLE_ALERT = gql`
  mutation disableAlert($id: Int!) {
    disableAlert(id: $id) {
      ok
      message
      alert {
        ...AlertDetails
      }
    }
  }
  ${AlertDetailsFragment}
`

export const CREATE_ALERT = gql`
  mutation createAlert($defaultAlertId: Int!, $securityProfileId: Int!) {
    createAlert(
      defaultAlertId: $defaultAlertId
      securityProfileId: $securityProfileId
    ) {
      ok
      message
      alert {
        ...AlertDetails
      }
    }
  }
  ${AlertDetailsFragment}
`

export const DELETE_ALERT = gql`
  mutation deleteAlert($id: Int!) {
    deleteAlert(id: $id) {
      ok
      message
      alert {
        ...AlertDetails
      }
    }
  }
  ${AlertDetailsFragment}
`

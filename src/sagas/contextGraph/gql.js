import gql from 'graphql-tag'

// ALERTS

export const GET_ALERTS = gql`
  query GetAlerts(
    $accountSlug: String!
    $siteSlug: String!
    $securityProfileId: Int!
    $statuses: [String]
  ) {
    alerts(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      securityProfileId: $securityProfileId
      statuses: $statuses
    ) {
      id
      name
      autoSnoozeSecs
      incompatibleStreams {
        stream {
          id
          active
        }
        unmetRequirements
      }
      status
      streams {
        id
        name
        region {
          id
        }
      }
      defaultAlert {
        id
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
  }
`

export const DELETE_ALERT = gql`
  mutation DeleteAlert($id: Int!) {
    deleteAlert(id: $id) {
      ok
      message
      alert {
        id
      }
    }
  }
`

export const CREATE_ALERT = gql`
  mutation CreateAlert($securityProfileId: Int!, $defaultAlertId: Int!) {
    createAlert(
      securityProfileId: $securityProfileId
      defaultAlertId: $defaultAlertId
    ) {
      ok
      message
      alert {
        id
        name
        status
        autoSnoozeSecs
        streams {
          id
          name
          region {
            id
          }
        }
        defaultAlert {
          id
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
    }
  }
`

export const CREATE_DEFAULT_ALERT = gql`
  mutation CreateDefaultAlert(
    $threatSignatureId: Int!
    $regionIds: [Int]!
    $severity: String
    $accountSlug: String
  ) {
    createDefaultAlert(
      threatSignatureId: $threatSignatureId
      severity: $severity
      regionIds: $regionIds
      accountSlug: $accountSlug
    ) {
      ok
      message
      defaultAlert {
        id
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
  }
`

export const UPDATE_ALERT_SNOOZE = gql`
  mutation updateSnooze($alertId: Int!, $autoSnoozeSecs: Int!) {
    updateSnoozeOnAlert(alertId: $alertId, autoSnoozeSecs: $autoSnoozeSecs) {
      ok
      message
      alert {
        id
        autoSnoozeSecs
      }
    }
  }
`

export const UPDATE_ALERT_STREAMS = gql`
  mutation updateRegions(
    $alertId: Int!
    $securityProfileId: Int!
    $regions: [AlertRegionType]!
  ) {
    updateRegionsOnAlert(
      alertId: $alertId
      securityProfileId: $securityProfileId
      regions: $regions
    ) {
      ok
      message
      alert {
        id
        streams {
          id
          name
          region {
            id
          }
        }
        defaultAlert {
          id
          regions {
            id
            name
          }
        }
      }
    }
  }
`

export const THREAT_SIGNATURE_AUTOCOMPLETE = gql`
  query ThreatSignatureAutocomplete($terms: [String]!, $flat: Boolean) {
    threatSignatureAutocomplete(terms: $terms, flat: $flat) {
      ok
      terms
      threatSignature {
        id
        name
      }
    }
  }
`

export const TOGGLE_ALERT_STATUS = gql`
  mutation ToggleAlertStatus($id: Int!) {
    toggleAlertStatus(id: $id) {
      ok
      message
      alert {
        id
        status
      }
    }
  }
`

export const GET_DEFAULT_ALERTS = gql`
  query DefaultAlerts($accountSlug: String) {
    defaultAlerts(accountSlug: $accountSlug) {
      id
      account {
        slug
      }
      threatSignature {
        id
        name
      }
      regions {
        id
        name
      }
      severity
    }
  }
`

// SITES
export const GET_SITES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      slug
    }
  }
`

// STREAMS

export const GET_STREAMS_BY_SITE = gql`
  query GetStreamsBySite(
    $accountSlug: String!
    $siteSlug: String!
    $regionId: Int
  ) {
    streamsBySite(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      regionId: $regionId
    ) {
      id
      name
      region {
        id
      }
    }
  }
`

// REGIONS

export const GET_ALL_REGIONS = gql`
  query($accountSlug: String, $siteSlug: String) {
    allRegions(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
    }
  }
`

// SP

export const GET_SECURITY_PROFILES = gql`
  query securityProfiles($accountSlug: String!, $siteSlug: String!) {
    securityProfiles(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
      active
      site {
        name
      }
    }
  }
`

export const GET_DEFAULT_PROFILES = gql`
  query DefaultSecurityProfiles($accountSlug: String!) {
    defaultSecurityProfiles(accountSlug: $accountSlug) {
      id
      name
      account {
        slug
        name
      }
      defaultAlerts {
        id
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
  }
`

export const CREATE_SECURITY_PROFILE = gql`
  mutation createSP(
    $accountSlug: String!
    $siteSlug: String!
    $name: String!
    $status: [String]
    $defaultSecurityProfileId: Int
  ) {
    createSecurityProfile(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      name: $name
      defaultSecurityProfileId: $defaultSecurityProfileId
    ) {
      ok
      securityProfile {
        id
        name
        active
        site {
          name
        }
        alerts(status: $status) {
          id
          name
          status
          severity
          autoSnoozeSecs
          regions {
            id
            name
          }
          streams {
            id
            name
          }
          threatSignature {
            id
          }
        }
      }
      message
    }
  }
`

export const UPDATE_SECURITY_PROFILE = gql`
  mutation UpdateSecurityProfile(
    $securityProfileId: Int
    $name: String
    $status: [String]
  ) {
    updateSecurityProfile(name: $name, securityProfileId: $securityProfileId) {
      ok
      message
      securityProfile {
        id
        name
        active
        site {
          name
        }
        alerts(status: $status) {
          id
          name
          status
          severity
          autoSnoozeSecs
          regions {
            id
            name
          }
          streams {
            id
            name
          }
          threatSignature {
            id
          }
        }
      }
    }
  }
`

export const DELETE_SECURITY_PROFILE = gql`
  mutation DeleteSecurityProfile($securityProfileId: Int) {
    deleteSecurityProfile(securityProfileId: $securityProfileId) {
      ok
      message
    }
  }
`

export const SAVE_THREAT_MODEL = gql`
  mutation SaveThreatModel(
    $securityProfileId: Int!
    $name: String
    $public: Boolean
  ) {
    saveThreatModel(
      securityProfileId: $securityProfileId
      name: $name
      public: $public
    ) {
      ok
      message
      defaultSecurityProfile {
        id
        name
        account {
          slug
          name
        }
      }
    }
  }
`

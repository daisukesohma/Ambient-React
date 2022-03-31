import gql from 'graphql-tag'

export const GET_SITES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      slug
      address
      latlng
      timezone
      siteType {
        name
      }
      streams {
        id
        identifier
        name
        active
        node {
          identifier
        }
      }
      nodes {
        identifier
        name
        buildVersion
      }
    }
  }
`

// TODO: @bshapero ADD WEBRTC_SERVER
export const GET_SITE_UP_TIME = gql`
  query($accountSlug: String!) {
    siteUptime(accountSlug: $accountSlug) {
      totalWindows
      endTs
      startTs
      healthyWindows
      sitesList {
        healthy
        healthyWindows
        name
        slug
        totalWindows
        windows {
          catalogueSync
          catalogueWriter
          engine
          mediaCleanup
          nodeExporter
          nvrStreamer
          pushgatewayBridge
          recorder
          redis
          videoServer
        }
      }
    }
  }
`

export const UPDATE_SITE_INFO = gql`
  mutation UpdateSiteInfo(
    $accountSlug: String!
    $siteSlug: String!
    $name: String
    $address: String
    $latitude: String
    $longitude: String
    $timezone: String
    $propagate: Boolean
  ) {
    updateSiteInfo(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
      name: $name
      address: $address
      latitude: $latitude
      longitude: $longitude
      timezone: $timezone
      propagate: $propagate
    ) {
      ok
      message
      site {
        id
        name
        slug
        address
        latlng
        timezone
        siteType {
          name
        }
        streams {
          id
          identifier
          name
          active
        }
        nodes {
          identifier
          name
          buildVersion
        }
      }
    }
  }
`

export const GET_TIMEZONES = gql`
  query GetTimezones {
    timezones
  }
`

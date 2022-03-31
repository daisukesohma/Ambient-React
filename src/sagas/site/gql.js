import gql from 'graphql-tag'

export const GET_SITES_BY_ACCOUNT = gql`
  query AllSitesByAccount($accountSlug: String!) {
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
        incognito
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
  query GetSiteUpTime($accountSlug: String!) {
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

export const GET_NODE_STATISTICS = gql`
  query GetNodeStatistics($accountSlug: String!) {
    nodeStatistics(accountSlug: $accountSlug) {
      diskSpace {
        free
        total
        percentage
      }
      name
      identifier
      services {
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
      timeSince {
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
`

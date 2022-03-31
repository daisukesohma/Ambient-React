import gql from 'graphql-tag'

export const GET_SITES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      slug
      address
      latlng
      siteType {
        name
      }
      nodes {
        identifier
        name
        buildVersion
        streams {
          id
          identifier
          name
          active
        }
      }
    }
  }
`

export const GET_NODES_BY_ACCOUNT = gql`
  query($accountSlug: String!) {
    allNodesByAccount(accountSlug: $accountSlug) {
      identifier
      name
      buildVersion
      streams {
        id
        identifier
        name
        active
      }
    }
  }
`

// TODO: @bshapero ADD WEBRTC_SERVER
export const GET_NODE_STATISTICS = gql`
  query($accountSlug: String!) {
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

// TODO: TURNKEY NODE/SITE
export const GET_NODE_REQUEST_STATUS_BY_ACCOUNT = gql`
  query GetNodeRequestStatusByAccount($accountSlug: String!) {
    getNodeRequestStatusByAccount(accountSlug: $accountSlug) {
      id
      requestType
      status
      createdTs
      updatedTs
      node {
        site {
          timezone
        }
        identifier
      }
    }
  }
`

export const GET_LATEST_NODE_PACKAGE_METADATA = gql`
  query GetLatestNodePackageMetadata {
    getLatestNodePackageMetadata {
      changeLog
      createdAt
      updatedAt
      packageUrl
      version
    }
  }
`

// Previous endpoint used to do node / appliance stuff
// This Should NOT work,  given what is on ondeck 7/27/2020
// Will want to pull every query of these out of product
//
export const CREATE_NODE_REQUEST = gql`
  mutation createNodeRequest($data: NodeRequestInput!) {
    createNodeRequest(data: $data) {
      ok
      id
      nodeIdentifier
    }
  }
`

// New endpoint with Varun
//
export const CREATE_NODE_V2_REQUEST = gql`
  mutation CreateNodeRequest(
    $nodeIdentifier: String!
    $requestJson: JSONString!
    $requestType: String!
  ) {
    createNodeRequest(
      nodeIdentifier: $nodeIdentifier
      requestJson: $requestJson
      requestType: $requestType
    ) {
      ok
      message
      nodeRequest {
        id
      }
    }
  }
`

export const ASSOCIATE_NODE_TO_ACCOUNT = gql`
  mutation AssociateNodeToAccount(
    $serialNumber: String!
    $accountSlug: String!
    $nodeName: String!
  ) {
    associateNodeToAccount(
      serialNumber: $serialNumber
      accountSlug: $accountSlug
      nodeName: $nodeName
    ) {
      ok
      message
      node {
        identifier
        name
        account {
          slug
        }
      }
    }
  }
`

import gql from 'graphql-tag'

export const ALL_NODE_DISCOVERY_REQUESTS_BY_NODE_IDENTIFIER = gql`
  query AllNodeDiscoveryRequestsByNodeIdentifier($nodeIdentifier: String!) {
    allNodeDiscoveryRequestsByNodeIdentifier(nodeIdentifier: $nodeIdentifier) {
      request
      id
      status
      node {
        name
        identifier
      }
      site {
        timezone
      }
    }
  }
`

// Returns all Streams for a node across One Request
export const ALL_STREAMS_DISCOVERED_BY_REQUEST = gql`
  query AllStreamsDiscoveredByRequest(
    $nodeIdentifier: String!
    $requestId: Int!
  ) {
    allStreamsDiscoveredByRequest(
      nodeIdentifier: $nodeIdentifier
      requestId: $requestId
    ) {
      id
      cameraIp
      cameraMake
      cameraModel
      cameraThumbnail
      metadata
      url
      request {
        id
      }
    }
  }
`

export const CREATE_STREAM = gql`
  mutation CreateStream($data: [StreamInput]!) {
    createStream(data: $data) {
      ok
      streamIds
    }
  }
`

// Updates "Status" field of portal_nodediscoveryrequest
// likely values are ['incomplete', 'inprogress', 'complete', onboardingcomplete]
export const UPDATE_NODE_DISCOVERY_REQUEST_STATUS = gql`
  mutation UpdateNodeDiscoveryRequestStatus($id: Int!, $status: String!) {
    updateNodeDiscoveryRequestStatus(id: $id, status: $status) {
      ok
    }
  }
`

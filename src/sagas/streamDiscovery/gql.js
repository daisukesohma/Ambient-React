import gql from 'graphql-tag'

// TODO: TURNKEY NODE SITE
// TODO: remove site from here
export const GET_NODE_REQUEST = gql`
  query NodeRequest($nodeRequestId: Int!) {
    nodeRequest(nodeRequestId: $nodeRequestId) {
      id
      node {
        identifier
        site {
          id
          slug
          name
          timezone
          nodes {
            identifier
            activeStreamCount
            name
          }
          siteType {
            id
            regions {
              id
              name
            }
          }
        }
      }
      requestType
      status
      request
      createdTs
      updatedTs
      streams {
        id
        name
        identifier
      }
      streamRequests {
        id
        cameraIp
        cameraMake
        cameraModel
        port
        streamUrl
        url
        streamName
      }
    }
  }
`

export const CREATE_STREAMS = gql`
  mutation CreateStreams($data: [StreamInput]!, $restart: Boolean) {
    createStream(data: $data, restart: $restart) {
      ok
      message
      streamIds
    }
  }
`

export const CREATE_CAPTURE_FRAME_REQUEST = gql`
  mutation CreateNodeRequest(
    $requestJson: JSONString!
    $nodeIdentifier: String!
  ) {
    createNodeRequest(
      requestJson: $requestJson
      nodeIdentifier: $nodeIdentifier
      requestType: "CAPTURE_FRAME"
    ) {
      ok
      nodeRequest {
        id
      }
      message
    }
  }
`

export const ALL_SITES_BY_ACCOUNT = gql`
  query AllSitesByAccount($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
    }
  }
`

import gql from 'graphql-tag'

// NOTE: return value { node } is the node identifier, as defined in models.py
// This could be confusing, but it was created this way with migration for now.
//
export const CREATE_NODE_DISCOVERY_REQUEST = gql`
  mutation CreateNodeDiscoveryRequest($data: NodeDiscoveryRequestInput!) {
    createNodeDiscoveryRequest(data: $data) {
      ok
      nodeIdentifier
      id
    }
  }
`

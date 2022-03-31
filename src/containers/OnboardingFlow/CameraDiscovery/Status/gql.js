import gql from 'graphql-tag'

// TODO: TURNKEY NODE SITE take site out
export const ALL_NODE_DISCOVERY_REQUESTS_BY_NODE_IDENTIFIER = gql`
  query AllNodeDiscoveryRequestsByNodeIdentifier($nodeIdentifier: String!) {
    allNodeDiscoveryRequestsByNodeIdentifier(nodeIdentifier: $nodeIdentifier) {
      request
      id
      status
      node {
        site {
          timezone
        }
        name
        identifier
      }
    }
  }
`

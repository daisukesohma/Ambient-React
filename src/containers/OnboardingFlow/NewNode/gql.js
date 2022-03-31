import gql from 'graphql-tag'

export const CREATE_NODE = gql`
  mutation CreateNode($nodeData: NodeInput!) {
    createNode(nodeData: $nodeData) {
      ok
      nodeId
    }
  }
`

import gql from 'graphql-tag'

export const CREATE_NODE_REQUEST = gql`
  mutation createNodeRequest($data: NodeRequestInput!) {
    createNodeRequest(data: $data) {
      ok
      id
      nodeIdentifier
    }
  }
`

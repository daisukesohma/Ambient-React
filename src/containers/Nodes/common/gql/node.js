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

// All Node Requests for all nodes in an account
export const GET_NODE_REQUEST_STATUS_BY_ACCOUNT = gql`
  query GetNodeRequestStatusByAccount($accountSlug: String!) {
    getNodeRequestStatusByAccount(accountSlug: $accountSlug) {
      id
      requestType
      status
      createdTs
      updatedTs
      node {
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

// Example NodeRequestInput
// {
//   "data": {
//     "request":"{}",
//     "requestType": "RESTART",
//     "nodeIdentifier": "0008193500831"
//   }
// }

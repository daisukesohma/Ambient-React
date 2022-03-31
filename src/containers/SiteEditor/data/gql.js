import gql from 'graphql-tag'

export const GET_ACCOUNT_SITES = gql`
  query GetAccountSites($accountSlug: String!) {
    allSites(accountSlug: $accountSlug) {
      id
      name
    }
  }
`

export const GET_REGIONS = gql`
  query GetRegions($id: Int!) {
    findSite(id: $id) {
      siteType {
        regions {
          id
          name
          streams {
            id
          }
        }
      }
    }
  }
`

export const GET_ACCESS_NODES_FOR_ACCOUNT = gql`
  query GetAccessNodesForAccount($accountSlug: String!) {
    accessNodesForAccount(accountSlug: $accountSlug) {
      id
      name
      identifier
      token
    }
  }
`

export const DELETE_ACCESS_NODE = gql`
  mutation DeleteAccessNode($id: Int!) {
    deleteAccessNode(id: $id) {
      ok
      message
    }
  }
`

export const CREATE_ACCESS_NODE = gql`
  mutation CreateAccessNode(
    $accountSlug: String!
    $identifier: String!
    $token: String!
    $name: String!
  ) {
    createAccessNode(
      accountSlug: $accountSlug
      identifier: $identifier
      token: $token
      name: $name
    ) {
      ok
      id
      message
    }
  }
`

export const GET_ACCESS_READERS_FOR_ACCOUNT = gql`
  query GetAccessReadersForAccount($accountSlug: String!) {
    accessReadersForAccount(accountSlug: $accountSlug) {
      id
      deviceId
      site {
        id
        name
      }
      stream {
        id
        name
        active
      }
      entityConfig {
        id
        bbox
      }
    }
  }
`

export const BULK_CREATE_ACCESS_READERS = gql`
  mutation BulkCreateAccessReaders(
    $accountSlug: String!
    $data: [BulkAccessReaderInputType]!
  ) {
    bulkCreateAccessReaders(accountSlug: $accountSlug, data: $data) {
      ok
      message
      readers {
        message
        deviceId
        reader {
          id
          site {
            id
            name
          }
          stream {
            id
            name
            active
          }
          entityConfig {
            id
            bbox
          }
        }
      }
    }
  }
`

export const DELETE_ACCESS_READER = gql`
  mutation DeleteAccessReader($id: Int!) {
    deleteAccessReader(id: $id) {
      ok
      message
    }
  }
`

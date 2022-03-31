import gql from 'graphql-tag'

export const GET_JOB_LOGS = gql`
  query nodeRequests(
    $accountSlug: String!
    $siteSlugs: [String]
    $nodeIdentifiers: [String]
  ) {
    nodeRequests(
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
      nodeIdentifiers: $nodeIdentifiers
    ) {
      id
      node {
        identifier
        name
      }
      request
      status
      requestType
      createdTs
      updatedTs
      streamRequests {
        id
      }
      streams {
        id
      }
      summary {
        successful {
          ip
        }
        failed {
          ip
        }
      }
    }
  }
`

export const GET_JOB_LOGS_PAGINATED = gql`
  query getNodeRequestsPaginated(
    $accountSlug: String!
    $nodeIdentifiers: [String]
    $page: Int
    $limit: Int
  ) {
    getNodeRequestsPaginated(
      accountSlug: $accountSlug
      nodeIdentifiers: $nodeIdentifiers
      page: $page
      limit: $limit
    ) {
      pages
      currentPage
      totalCount
      instances {
        id
        node {
          identifier
          name
        }
        request
        status
        requestType
        createdTs
        updatedTs
        streamRequests {
          id
        }
        streams {
          id
        }
        summary {
          successful {
            ip
          }
          failed {
            ip
          }
        }
      }
    }
  }
`

// TODO @ERIC GET DATA AND pROPER endpoint
export const CREATE_NEW_DISCOVERY = gql`
  mutation CreateNodeRequest(
    $requestJson: JSONString!
    $nodeIdentifier: String!
    $requestType: String!
  ) {
    createNodeRequest(
      requestJson: $requestJson
      nodeIdentifier: $nodeIdentifier
      requestType: $requestType
    ) {
      ok
      nodeRequest {
        id
      }
      message
    }
  }
`

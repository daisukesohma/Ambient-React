import gql from 'graphql-tag'

export const NODE_PROVISIONS = gql`
  query nodeProvisions(
    $filters: NodeProvisionsFilterInputType!
    $page: Int!
    $limit: Int!
  ) {
    nodeProvisions(filters: $filters, page: $page, limit: $limit) {
      nodeProvisions {
        id
        node {
          identifier
          name
          token
          staticIp
          subnet
          gateway
          hardwareSerialNumber
          hardwareSku {
            id
            hardwarePartner {
              id
              name
              contactInfo
            }
            identifier
          }
          retentionMotionDays
          retentionNonmotionDays
        }
        status
        purchaseOrder
        shippingInfo
        comment
        shippingTrackingLink
        provisioningKey
        transitions
        welcomeUser {
          id
          email
        }
      }
      pages
      currentPage
      totalCount
    }
  }
`
export const NODE_PROVISION = gql`
  query nodeProvision($nodeProvisionId: Int!) {
    nodeProvision(nodeProvisionId: $nodeProvisionId) {
      id
      node {
        identifier
        name
        hardwareSerialNumber
        token
        hardwareSku {
          id
          hardwarePartner {
            id
            name
            contactInfo
          }
          identifier
        }
        retentionMotionDays
        retentionNonmotionDays
      }
      status
      shippingInfo
      comment
      shippingTrackingLink
      provisioningKey
      transitions
      welcomeUser {
        id
      }
    }
  }
`
// UpdateNodeProvisionInput
// skuId: String
// welcomeUserEmail: String
// status: Int
// retentionMotionDays: Int
// retentionNonmotionDays: Int
// shippingInfo: String
// shippingTrackingLink: String
// purchaseOrder: String
// comment: String
//
export const UPDATE_NODE_PROVISION = gql`
  mutation updateNodeProvision(
    $nodeProvisionId: String!
    $data: UpdateNodeProvisionInput!
  ) {
    updateNodeProvision(nodeProvisionId: $nodeProvisionId, data: $data) {
      ok
      message
      nodeProvision {
        id
        node {
          retentionMotionDays
        }
      }
    }
  }
`

export const CREATE_NODE_PROVISION = gql`
  mutation createNodeProvision($data: CreateNodeProvisionInput!) {
    createNodeProvision(data: $data) {
      ok
      message
      nodeProvision {
        id
      }
    }
  }
`

export const PROVISION_STATUSES = gql`
  query provisionStatuses {
    provisionStatuses {
      id
      status
    }
  }
`

export const NODE_ADMIN = gql`
  query nodeAdmin($nodeIdentifier: String!) {
    nodeAdmin(nodeIdentifier: $nodeIdentifier) {
      id
      rootPassword
      guestUsername
      guestPassword
      macAddress
      configuredStaticIp
      configuredSubnet
      configuredGateway
      configuredDns
    }
  }
`

export const UPDATE_NODE_ADMIN = gql`
  mutation updateNodeAdmin($nodeIdentifier: String!, $data: NodeAdminInput!) {
    updateNodeAdmin(nodeIdentifier: $nodeIdentifier, data: $data) {
      ok
      message
      nodeAdmin {
        id
        node {
          identifier
        }
        rootPassword
        guestUsername
        guestPassword
        macAddress
        configuredStaticIp
        configuredSubnet
        configuredGateway
        configuredDns
      }
    }
  }
`

export const AMBIENT_OS_DOWNLOAD_LINK = gql`
  query ambientOsDownloadLink {
    ambientOsDownloadLink
  }
`

export const VERIFY_NODE_PROVISION_SETUP = gql`
  query verifyNodeProvisionSetup($id: Int!) {
    verifyNodeProvisionSetup(nodeProvisionId: $id) {
      verified
      reason
    }
  }
`

import gql from 'graphql-tag'

export const CREATE_GPU = gql`
  mutation createGpu($data: CreateGpuInput!) {
    createGpu(gpuData: $data) {
      ok
      message
      gpu {
        id
        name
      }
    }
  }
`

export const UPDATE_GPU = gql`
  mutation updateGpu($gpuId: String!, $data: UpdateGpuInput!) {
    updateGpu(gpuId: $gpuId, gpuData: $data) {
      ok
      message
      gpu {
        name
      }
    }
  }
`
export const DELETE_GPU = gql`
  mutation deleteGpu($gpuId: String!) {
    deleteGpu(gpuId: $gpuId) {
      ok
      message
    }
  }
`

export const CREATE_HARDWARE_PARTNER = gql`
  mutation createHardwarePartner($data: CreateHardwarePartnerInput!) {
    createHardwarePartner(hardwarePartnerData: $data) {
      ok
      message
      hardwarePartner {
        id
        name
        contactInfo
      }
    }
  }
`

export const UPDATE_HARDWARE_PARTNER = gql`
  mutation updateHardwarePartner(
    $hardwarePartnerId: String!
    $data: UpdateHardwarePartnerInput!
  ) {
    updateHardwarePartner(
      hardwarePartnerId: $hardwarePartnerId
      hardwarePartnerData: $data
    ) {
      ok
      message
      hardwarePartner {
        id
        name
        contactInfo
      }
    }
  }
`

export const DELETE_HARDWARE_PARTNER = gql`
  mutation deleteHardwarePartner($hardwarePartnerId: String!) {
    deleteHardwarePartner(hardwarePartnerId: $hardwarePartnerId) {
      ok
      message
    }
  }
`

export const CREATE_SKU_CAPABILITY = gql`
  mutation createSkuCapability($data: CreateSkuCapabilityInput!) {
    createSkuCapability(skuCapabilityData: $data) {
      ok
      message
      skuCapability {
        id
        hardwareSku {
          id
          identifier
        }
        siteType {
          id
          name
        }
        numStreams
        numViewers
        fullDaysRetention
        motionDaysRetention
      }
    }
  }
`

export const UPDATE_SKU_CAPABILITY = gql`
  mutation updateSkuCapability(
    $skuCapabilityId: String!
    $data: UpdateSkuCapabilityInput!
  ) {
    updateSkuCapability(
      skuCapabilityId: $skuCapabilityId
      skuCapabilityData: $data
    ) {
      ok
      message
      skuCapability {
        id
        hardwareSku {
          id
          identifier
        }
        siteType {
          id
          name
        }
        numStreams
        numViewers
        fullDaysRetention
        motionDaysRetention
      }
    }
  }
`

export const DELETE_SKU_CAPABILITY = gql`
  mutation deleteSkuCapability($skuCapabilityId: String!) {
    deleteSkuCapability(skuCapabilityId: $skuCapabilityId) {
      ok
      message
    }
  }
`

export const CREATE_SKU = gql`
  mutation createSku($data: CreateSkuInput!) {
    createSku(skuData: $data) {
      ok
      message
      sku {
        id
        identifier
        gpu {
          id
          name
        }
        numGpu
      }
    }
  }
`

export const UPDATE_SKU = gql`
  mutation updateSku($skuId: String!, $data: UpdateSkuInput!) {
    updateSku(skuId: $skuId, skuData: $data) {
      ok
      message
      sku {
        id
        identifier
        gpu {
          id
          name
        }
        numGpu
      }
    }
  }
`

export const DELETE_SKU = gql`
  mutation deleteSku($skuId: String!) {
    deleteSku(skuId: $skuId) {
      ok
      message
    }
  }
`

export const QUERY_SKUS = gql`
  query skus {
    skus {
      id
      hardwarePartner {
        id
        name
        contactInfo
      }
      identifier
      hardwareInfo
      memory
      ssdStorage
      hddStorage
      cpuBaseClock
      cpuThreadCount
      gpu {
        id
        name
      }
      numGpu
      available
      price
      capabilities {
        id
        siteType {
          id
          name
        }
        numStreams
        numViewers
        fullDaysRetention
        motionDaysRetention
      }
    }
  }
`

export const CREATE_NODE_PROVISION = gql`
  mutation createNodeProvision($data: CreateNodeProvisionInput!) {
    createNodeProvision(data: $data) {
      ok
      message
      nodeProvisions {
        id
      }
    }
  }
`

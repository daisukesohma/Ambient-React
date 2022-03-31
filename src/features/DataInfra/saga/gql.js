import gql from 'graphql-tag'

export const GET_DATA_CAMPAIGNS_PAGINATED = gql`
  query dataCampaignsPaginated($page: Int, $limit: Int, $status: String) {
    dataCampaignsPaginated(page: $page, limit: $limit, status: $status) {
      totalCount
      pages
      currentPage
      dataCampaigns {
        id
        name
        tsCreated
        mode
        status
        numDataPoints
        actions {
          action
        }
        validActions
        validFailureModes {
          id
          name
        }
      }
    }
  }
`

export const START_DATA_CAMPAIGN = gql`
  mutation startDataCampaign($dataCampaignId: Int!) {
    startDataCampaign(dataCampaignId: $dataCampaignId) {
      ok
      message
      dataCampaign {
        id
      }
    }
  }
`

export const STOP_DATA_CAMPAIGN = gql`
  mutation stopDataCampaign($dataCampaignId: Int!) {
    stopDataCampaign(dataCampaignId: $dataCampaignId) {
      ok
      message
      dataCampaign {
        id
      }
    }
  }
`

export const ARCHIVE_DATA_CAMPAIGN = gql`
  mutation archiveDataCampaign($dataCampaignId: Int!) {
    archiveDataCampaign(dataCampaignId: $dataCampaignId) {
      ok
      message
      dataCampaign {
        id
      }
    }
  }
`

export const DELETE_DATA_CAMPAIGN = gql`
  mutation deleteDataCampaign($dataCampaignId: Int!) {
    deleteDataCampaign(dataCampaignId: $dataCampaignId) {
      ok
      message
      dataCampaign {
        id
      }
    }
  }
`

export const CREATE_DATA_CAMPAIGN = gql`
  mutation createDataCampaign(
    $name: String!
    $mode: String!
    $threatSignatureId: Int!
  ) {
    createDataCampaign(
      name: $name
      mode: $mode
      threatSignatureId: $threatSignatureId
    ) {
      ok
      message
      dataCampaign {
        id
      }
    }
  }
`

export const GET_DATA_POINTS_PAGINATED = gql`
  query dataPointsForCampaignPaginated(
    $dataCampaignId: Int!
    $page: Int!
    $tsIdentifierStart: String!
    $tsIdentifierEnd: String!
    $eventAnnotationLabel: Boolean
    $failureModeIds: [Int!]
    $filterAtLeastOne: Boolean
  ) {
    dataPointsForCampaignPaginated(
      dataCampaignId: $dataCampaignId
      page: $page
      tsIdentifierStart: $tsIdentifierStart
      tsIdentifierEnd: $tsIdentifierEnd
      eventAnnotationLabel: $eventAnnotationLabel
      failureModeIds: $failureModeIds
      filterAtLeastOne: $filterAtLeastOne
      limit: 12
    ) {
      totalCount
      pages
      currentPage
      dataPoints {
        id
        tsIdentifierStart
        tsIdentifierEnd
        sourceType
        source
        streamId
        tsCreated
        eventAnnotation {
          id
          label
          threatSignatureId
          threatSignature {
            name
          }
          validFailureModes {
            id
            name
          }
          failureModes {
            id
            name
          }
        }
        videoArchive {
          status
          statusReason
          videoArchive {
            exactServed
            link
          }
          timestampArchive {
            link
          }
        }
        metadataArchive {
          status
          statusReason
        }
        speLink
      }
    }
  }
`

export const UPDATE_DATA_POINT_EVENT_ANNOTATION = gql`
  mutation updateDataPointEventAnnotation(
    $dataPointId: Int!
    $label: Boolean
    $other: String
    $failureModeIds: [Int]
  ) {
    updateDataPointEventAnnotation(
      dataPointId: $dataPointId
      label: $label
      other: $other
      failureModeIds: $failureModeIds
    ) {
      ok
      message
      eventAnnotation {
        id
        label
        other
        failureModes {
          id
        }
      }
    }
  }
`

export const GET_EVENT_ANNOTATION = gql`
  query getEventAnnotation($eventAnnotationId: Int!) {
    getEventAnnotation(eventAnnotationId: $eventAnnotationId) {
      label
      other
      failureModes {
        id
        name
      }
      validFailureModes {
        id
        name
      }
      threatSignature {
        name
      }
    }
  }
`

export const GET_THREAT_SIGNATURES = gql`
  query allThreatSignatures {
    allThreatSignatures {
      id
      name
    }
  }
`

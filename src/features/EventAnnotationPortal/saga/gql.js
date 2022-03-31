import gql from 'graphql-tag'

export const GET_DATA_POINT_TO_ANNOTATE = gql`
  query dataPointToAnnotate(
    $dataCampaignIds: [Int]
    $threatSignatureIds: [Int]
    $label: Boolean
    $tsCreatedStart: Int
    $tsCreatedEnd: Int
    $randomize: Boolean
  ) {
    dataPointToAnnotate(
      dataCampaignIds: $dataCampaignIds
      threatSignatureIds: $threatSignatureIds
      label: $label
      tsCreatedStart: $tsCreatedStart
      tsCreatedEnd: $tsCreatedEnd
      randomize: $randomize
    ) {
      id
      videoArchive {
        status
        videoArchive {
          link
        }
      }
      eventAnnotation {
        id
        label
        other
        threatSignature {
          name
        }
        failureModes {
          id
          name
        }
        validFailureModes {
          id
          name
        }
      }
      speLink
    }
  }
`

export const GET_DATA_POINT = gql`
  query getDataPoint($dataPointId: Int!) {
    getDataPoint(dataPointId: $dataPointId) {
      id
      videoArchive {
        status
        videoArchive {
          link
        }
      }
      eventAnnotation {
        id
        label
        other
        threatSignature {
          name
        }
        failureModes {
          id
          name
        }
        validFailureModes {
          id
          name
        }
      }
      speLink
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

export const GET_ALL_THREAT_SIGNATURES = gql`
  query allThreatSignatures {
    allThreatSignatures {
      id
      name
      validFailureModes {
        id
      }
    }
  }
`

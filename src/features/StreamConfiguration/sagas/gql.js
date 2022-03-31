import gql from 'graphql-tag'

export const GET_SITES_BY_ACCOUNT = gql`
  query SitesForStreamConfiguration($accountSlug: String!) {
    allSitesByAccount(accountSlug: $accountSlug) {
      id
      name
      slug
    }
  }
`

export const GET_STREAMS_BY_ACCOUNT = gql`
  query StreamsForStreamConfiguration(
    $siteSlug: String
    $accountSlug: String!
  ) {
    findStreamsByAccount(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
      entities {
        id
        accessReaders {
          id
        }
      }
      isProblematic
    }
  }
`

export const GET_ZONES = gql`
  query GetZonesForStreamConfiguration {
    zones {
      id
      name
      color
    }
  }
`

export const GET_ENTITIES = gql`
  query GenEntitiesForStreamConfiguration {
    getEntities {
      id
      name
    }
  }
`

export const CREATE_ENTITY_CONFIG = gql`
  mutation createEntityConfig($input: CreateEntityConfigInput!) {
    createEntityConfig(input: $input) {
      ok
      message
      entityConfig {
        id
      }
    }
  }
`

export const UPDATE_ENTITY_CONFIG = gql`
  mutation updateEntityConfig($input: UpdateEntityConfigInput!) {
    updateEntityConfig(input: $input) {
      ok
      message
      entityConfig {
        id
      }
    }
  }
`

export const DELETE_ENTITY_CONFIG = gql`
  mutation deleteEntityConfig($input: DeleteEntityConfigInput!) {
    deleteEntityConfig(input: $input) {
      ok
      message
    }
  }
`

export const GET_STREAM_SNAPSHOT = gql`
  query fetchStreamSnapShot($streamId: Int) {
    getStream(streamId: $streamId) {
      id
      snapshot {
        id
        dataStr
      }
      isProblematic
    }
  }
`

export const GET_STREAM_ZONE_BITMAP = gql`
  query getStreamZoneBitmap($streamId: Int) {
    getStream(streamId: $streamId) {
      id
      isProblematic
      bitMap
    }
  }
`

// Gets zone image (not bitmap!), bbox and 4 pt entities
export const GET_STREAM_AUDIT = gql`
  query getStreamAudit($id: Int) {
    findStreamById(id: $id) {
      id
      zoneData
      isProblematic
      region {
        id
        name
      }
      streamNotes {
        id
        content
        tsCreated
        tsEdited
        creator {
          id
          user {
            id
            email
            firstName
            lastName
          }
        }
      }
      entities {
        id
        entity {
          id
        }
        annotationType
        bbox
        config
        accessReaders {
          id
          deviceId
        }
        pointAnnotations {
          id
          interior
          entity {
            id
          }
          points {
            x
            y
          }
        }
      }
    }
  }
`

export const GET_STREAM_ENTITIES = gql`
  query getStreamEntities($id: Int) {
    findStreamById(id: $id) {
      entities {
        id
        annotationType
      }
    }
  }
`
export const UPDATE_STREAM = gql`
  mutation updateStream($data: StreamUpdateInput!) {
    updateStream(data: $data) {
      ok
      id
      stream {
        isProblematic
        bitMap
      }
    }
  }
`

export const UPDATE_REGION_ON_STREAM = gql`
  mutation UpdateRegionOnStream($input: UpdateRegionOnStreamInput!) {
    updateRegionOnStream(input: $input) {
      ok
      message
      stream {
        isProblematic
        region {
          id
          name
        }
        alerts {
          id
          name
        }
      }
    }
  }
`

export const GET_ALL_REGIONS = gql`
  query GetRegionsOfSite($accountSlug: String, $siteSlug: String) {
    allRegions(accountSlug: $accountSlug, siteSlug: $siteSlug) {
      id
      name
    }
  }
`

// CREATE POINT EXAMPLE INPUT
// {
//   "input": {
//     "streamId": 1213,
//     "points": "[1,2], [1,2], [1,2], [1,2]", // not sure why this is a string
//     "interior": false
//   }
// }
export const CREATE_POINT_ANNOTATION = gql`
  mutation createPointAnnotation($input: CreatePointAnnotationInput!) {
    createPointAnnotation(input: $input) {
      ok
      message
      pointAnnotation {
        id
        interior
        points {
          x
          y
        }
      }
    }
  }
`

export const UPDATE_POINT_ANNOTATION = gql`
  mutation updatePointAnnotation($input: UpdatePointAnnotationInput!) {
    updatePointAnnotation(input: $input) {
      ok
      message
      pointAnnotation {
        id
        stream {
          id
        }
        interior
        points {
          x
          y
        }
      }
    }
  }
`

// {input: { pointAnnotationId: 1}}
export const DELETE_POINT_ANNOTATION = gql`
  mutation deletePointAnnotation($input: DeletePointAnnotationInput!) {
    deletePointAnnotation(input: $input) {
      ok
      message
    }
  }
`

// for later
export const GET_ACCESS_READERS_FOR_STREAM = gql`
  query accessReadersForStream(
    $streamId: Int!
    $serviceName: String
    $serviceToken: String
  ) {
    accessReadersForStream(
      streamId: $streamId
      serviceName: $serviceName
      serviceToken: $serviceToken
    ) {
      id
      entityConfig {
        id
      }
    }
  }
`

// test both of these, if SITE works, use SITE, else use ACCOUNT
export const GET_ACCESS_READERS_FOR_SITE = gql`
  query accessReadersForSite($siteId: Int!) {
    accessReadersForSite(siteId: $siteId) {
      id
      deviceId
      entityConfig {
        id
      }
      stream {
        id
      }
      active
    }
  }
`

export const GET_ACCESS_READERS_FOR_ACCOUNT = gql`
  query accessReadersForAccount($accountSlug: String) {
    accessReadersForAccount(accountSlug: $accountSlug) {
      id
    }
  }
`

export const UPDATE_ACCESS_READER = gql`
  mutation updateAccessReader($streamId: Int, $id: Int!, $entityConfigId: Int) {
    updateAccessReader(
      streamId: $streamId
      id: $id
      entityConfigId: $entityConfigId
    ) {
      ok
      message
    }
  }
`

export const CREATE_STREAM_NOTE = gql`
  mutation CreateStreamNote($data: CreateStreamNoteInput!) {
    createStreamNote(data: $data) {
      ok
      message
      streamNote {
        id
        content
        tsCreated
        creator {
          id
        }
      }
    }
  }
`

export const UPDATE_STREAM_NOTE = gql`
  mutation UpdateStreamNote($data: UpdateStreamNoteInput!) {
    updateStreamNote(data: $data) {
      ok
      message
      streamNote {
        id
        content
        tsCreated
        creator {
          id
        }
      }
    }
  }
`

export const DELETE_STREAM_NOTE = gql`
  mutation DeleteStreamNote($data: DeleteStreamNoteInput!) {
    deleteStreamNote(data: $data) {
      ok
      message
    }
  }
`

export const UPDATE_STREAM_PROBLEMATIC_STATUS = gql`
  mutation UpdateStreamProblematicStatus(
    $data: UpdateStreamProblematicStatusInput!
  ) {
    updateStreamProblematicStatus(data: $data) {
      ok
      message
      streamNote {
        id
        content
        stream {
          id
          isProblematic
        }
      }
    }
  }
`

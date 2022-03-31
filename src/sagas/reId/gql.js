import { gql } from 'apollo-boost'

export const GET_REID_VECTORS = gql`
  query getReidVectorsInTimeRange(
    $startTs: Int!
    $streamId: Int!
    $deltaSecs: Int!
  ) {
    getReidVectorsInTimeRange(
      startTs: $startTs
      streamId: $streamId
      deltaSecs: $deltaSecs
    ) {
      ok
      reidData {
        entityId
        tsMs
        streamId
        bbox
        cropUrl
      }
    }
  }
`

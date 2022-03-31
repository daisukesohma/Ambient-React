import { getCurrUnixTimestamp } from '../utils'

const tsInMs = getCurrUnixTimestamp() * 1000

const mockEntities = {
  status: 'success',
  entities_only: false,
  metadata: [
    {
      hits: {
        hits: [],
        total: 1874,
        max_score: 0.0,
      },
      _shards: {
        successful: 5,
        failed: 0,
        skipped: 0,
        total: 5,
      },
      took: 2,
      aggregations: {
        by_time_unit: {
          buckets: [
            {
              key_as_string: tsInMs,
              key: tsInMs,
              doc_count: 18,
            },
            {
              key_as_string: tsInMs - 100000,
              key: tsInMs - 100000,
              doc_count: 6,
            },
            {
              key_as_string: tsInMs - 200000,
              key: tsInMs - 200000,
              doc_count: 1,
            },
            {
              key_as_string: tsInMs - 300000,
              key: tsInMs - 300000,
              doc_count: 1,
            },
          ],
        },
      },
    },
  ],
}

export default mockEntities

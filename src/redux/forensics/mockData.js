export const METADATA_BY_SITE = {
  currentPage: 1,
  searchType: 'THREAT_SIGNATURE',
  instances: [
    {
      snapshotUrl: null,
      ts: '1592927760000',
      stream: {
        id: 1,
        name: 'Stream 1',
        node: {
          identifier: 'Node1',
        },
        region: {
          id: 1,
          name: 'region 1',
        },
      },
    },
    {
      snapshotUrl: null,
      ts: '1592927760001',
      stream: {
        id: 2,
        name: 'Stream 2',
        node: {
          identifier: 'Node1',
        },
        region: {
          id: 1,
          name: 'region 1',
        },
      },
    },
  ],
  pages: 10,
  totalCount: 100,
}

export const SEARCH_PRESET = 'person'

export const REGIONS = [
  {
    id: 1,
    name: 'Region 1',
  },
  { id: 2, name: 'Region 2' },
]

export const STREAMS = [
  { id: 1, name: 'Entry 1', region: { id: 1 } },
  { id: 2, name: 'Entry 2', region: { id: 1 } },
]

export const REGION_STATS = [
  {
    regionPk: 1,
    count: 1,
  },
  {
    regionPk: 2,
    count: 2,
  },
]

export const STREAM_STATS = [
  {
    stream: {
      id: 1,
    },
    count: 1,
  },
  {
    stream: { id: 2 },
    count: 2,
  },
]

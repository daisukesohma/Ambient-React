/*
 * This mock experience depends on external resources. Particularly,
 * for every threatSignatureId (suggestion), the snapshots must be stored
 * at https://dev.ambient.ai/static/snapshots/{threatSignatureId}{#resultNum}/[1-15].jpg
 * E.g, threatSignatureId: pcb, resultNum: 3
 * resultNum is 1-indexed. The combination: {threatSignatureId}{#resultNum} is called mockTs
 * because the client sends this "key" as `ts` in the snapshot API call.
 */

/* Basic Setup
 * Suggestions, Regions and Streams
 */
import countBy from 'lodash/countBy'

// Map TS/Entity ID to human-readable ID fo mockResults (see below)
const translate = id => {
  return {
    124: 'crowding', // SDV
    133: 'pcb',
    131: 'pcl',
    entity_laptop: 'pcl',
  }[id]
}

const NODE = {
  identifier: 'pahost3',
  site: {
    name: 'Palo Alto',
    timezone: 'America/Los_Angeles',
    slug: 'pa',
  },
}
const STATIC_ROOT = 'https://dev.ambient.ai/static/snapshots'

const searchSuggestions = [
  {
    searchType: 'THREAT_SIGNATURE',
    params: {
      __typename: 'ThreatSignatureSearchSuggestion',
      name: 'Tailgating',
      threatSignatureId: 'tailgating',
    },
    __typename: 'SearchSuggestion',
  },
  {
    searchType: 'THREAT_SIGNATURE',
    params: {
      __typename: 'ThreatSignatureSearchSuggestion',
      name: 'Crowding',
      threatSignatureId: 'crowding',
    },
    __typename: 'SearchSuggestion',
  },
  {
    searchType: 'THREAT_SIGNATURE',
    params: {
      __typename: 'ThreatSignatureSearchSuggestion',
      name: 'Person carrying backpack',
      threatSignatureId: 'pcb',
    },
    __typename: 'SearchSuggestion',
  },
  {
    searchType: 'THREAT_SIGNATURE',
    params: {
      __typename: 'ThreatSignatureSearchSuggestion',
      name: 'Person carrying laptop',
      threatSignatureId: 'pcl',
    },
    __typename: 'SearchSuggestion',
  },
  {
    searchType: 'THREAT_SIGNATURE',
    params: {
      __typename: 'ThreatSignatureSearchSuggestion',
      name: 'Access Granted',
      threatSignatureId: 'access_granted',
    },
    __typename: 'SearchSuggestion',
  },
  {
    searchType: 'THREAT_SIGNATURE',
    params: {
      __typename: 'ThreatSignatureSearchSuggestion',
      name: 'Access Denied',
      threatSignatureId: 'access_denied',
    },
    __typename: 'SearchSuggestion',
  },
  {
    searchType: 'THREAT_SIGNATURE',
    params: {
      __typename: 'ThreatSignatureSearchSuggestion',
      name: 'Contact Trace',
      threatSignatureId: 'contact_trace',
    },
    __typename: 'SearchSuggestion',
  },
]

// mockId is added as a human readable ID to associate region
// with results easily.
const allRegions = [
  { id: 'entrance', name: 'Secure Building Primary Entrance' },
  { id: 'aux_entrance', name: 'Secure Building Auxiliary Entrance' },
  { id: 'lobby', name: 'Lobby / Reception' },
  { id: 'pathway', name: 'Interior Secure Pathway' },
  { id: 'workspace', name: 'Workspace' },
  { id: 'exit', name: 'Emergency Exit' },
  { id: 'secure_interior', name: 'Secure Room [Interior]' },
  { id: 'secure_exterior', name: 'Secure Room [Exterior]' },
  { id: 'secure_asset', name: 'Secure Asset' },
  { id: 'parking', name: 'Parking Lot / Garage' },
  { id: 'exec_workspace', name: 'Executive Workspace' },
  { id: 'shipping', name: 'Shipping / Receiving' },
  { id: 'permieter', name: 'Perimeter' },
]

// NB: The ID for streams is hardcoded to match the demo
// environment used by GTM. This is not ideal but we have
// such hardcoded demo fixtures in a few other places on
// the frontend (notably, demoAlerts.js); so letting this pass.
// NB: Now that forensics uses real data, the stream IDs are no
// longer required to match the backend. In fact, they need to be
// different, otherwise, the snapshot fetching logic cannot be
// differentiated.
const streamsBySite = [
  {
    mockId: 'btv',
    id: -1,
    name: 'Bullpen Table View',
    region: { id: 'workspace' },
  },
  {
    mockId: 'bhv',
    id: -336,
    name: 'Bullpen Hallway View',
    region: { id: 'lobby' },
  },
  {
    mockId: 'kitchen_stairway',
    id: -337,
    name: 'Kitchen Stairway (PRIV)',
    region: { id: 'aux_entrance' },
  },
  {
    mockId: 'kitchen_main',
    id: -338,
    name: 'Kitchen Main',
    region: { id: 'workspace' },
  },
  {
    mockId: 'entry_stairwell',
    id: -339,
    name: 'Entry Stairwell',
    region: { id: 'entrance' },
  },
  {
    mockId: 'desks1',
    id: -340,
    name: 'Desks 1',
    region: { id: 'workspace' },
  },
  {
    mockId: 'front_desk',
    id: -345,
    name: 'Front Desk (PRIV)',
    region: { id: 'lobby' },
  },
  {
    mockId: 'bike_stand',
    id: -346,
    name: 'Bike Stand (PRIV)',
    region: { id: 'parking' },
  },
  {
    mockId: 'hallway1',
    id: -349,
    name: 'Hallway Cam 1',
    region: { id: 'pathway' },
  },
  {
    mockId: 'hallway2',
    id: -350,
    name: 'Hallway Cam 2',
    region: { id: 'pathway' },
  },
  {
    mockId: 'window_camera',
    name: 'Window Camera (PRIV)',
    id: -351,
    region: { id: 'parking' },
  },
  {
    mockId: 'demo_room',
    id: -355,
    name: 'Demo Room',
    region: { id: 'exec_workspace' },
  },
]

const getStream = mockId => {
  return streamsBySite.find(stream => stream.mockId === mockId)
}

const mockResults = {
  pcb: [
    { stream: getStream('demo_room') },
    { stream: getStream('bhv') },
    { stream: getStream('bhv') },
    { stream: getStream('bhv') },
    { stream: getStream('btv') },
    { stream: getStream('desks1') },
  ],
  pcl: [
    { stream: getStream('demo_room') },
    { stream: getStream('bhv') },
    { stream: getStream('btv') },
    { stream: getStream('desks1') },
  ],
  access_granted: [
    { stream: getStream('entry_stairwell') },
    { stream: getStream('entry_stairwell') },
    { stream: getStream('demo_room') },
    { stream: getStream('desks1') },
    { stream: getStream('hallway2') },
    { stream: getStream('hallway2') },
    { stream: getStream('hallway1') },
  ],
  access_denied: [
    { stream: getStream('entry_stairwell') },
    { stream: getStream('entry_stairwell') },
    { stream: getStream('demo_room') },
    { stream: getStream('desks1') },
    { stream: getStream('hallway2') },
    { stream: getStream('hallway2') },
    { stream: getStream('hallway1') },
  ],
  crowding: [
    { stream: getStream('demo_room') },
    { stream: getStream('btv') },
    { stream: getStream('bhv') },
    { stream: getStream('demo_room') },
    { stream: getStream('hallway1') },
  ],
  contact_trace: [
    { stream: getStream('demo_room') },
    { stream: getStream('entry_stairwell') },
    { stream: getStream('entry_stairwell') },
    { stream: getStream('bhv') },
    { stream: getStream('hallway1') },
    { stream: getStream('hallway2') },
    { stream: getStream('hallway2') },
    { stream: getStream('desks1') },
    { stream: getStream('btv') },
  ],
}

/*
 * Results for specific queries
 */
const forensicsResultsBySiteRegionStats = threatSignatureId => {
  const regionIds = mockResults[threatSignatureId].map(
    ({ stream }) => stream.region.id,
  )

  return {
    ok: true,
    regionStats: allRegions.map(region => {
      const count = regionIds.filter(id => id === region.id).length
      return {
        regionPk: region.id,
        count,
      }
    }),
  }
}

const getTimestamp = (startTs, endTs) => {
  const range = endTs - startTs
  return startTs + Math.random() * range
}

const forensicsResultsBySite = (
  threatSignatureId,
  startTs,
  endTs,
  regionIds,
) => {
  const instances = mockResults[threatSignatureId]
  const filteredInstances = instances
    .map((obj, index) => {
      const mockTs = `${threatSignatureId}${index + 1}`
      return {
        stream: {
          ...obj.stream,
          node: NODE,
        },
        mockTs,
        ts: getTimestamp(startTs, endTs) * 1000,
        snapshotUrl: `${STATIC_ROOT}/${mockTs}/1.jpg`,
      }
    })
    .filter(
      ({ stream }) =>
        !regionIds ||
        regionIds.length === 0 ||
        regionIds.indexOf(stream.region.id) >= 0,
    )

  return {
    ok: true,
    searchType: 'THREAT_SIGNATURE',
    instances: filteredInstances,
    pages: 1,
    totalCount: filteredInstances.length,
  }
}

const forensicsResultsBySiteStreamStats = threatSignatureId => {
  const instances = mockResults[threatSignatureId]
  return {
    ok: true,
    streamStats: instances.map(({ stream }) => {
      return {
        stream,
        count: countBy(instances, 'stream.id')[stream.id],
      }
    }),
  }
}

const getStreamSnapshotsAfterTimestamp = key => {
  return Array(15)
    .fill(0)
    .map((x, index) => {
      return {
        snapshotUrl: `${STATIC_ROOT}/${key}/${index + 1}.jpg`,
        snapshotTs: index,
      }
    })
}

const mockData = {
  searchSuggestions,
  allRegions,
  streamsBySite,
  forensicsResultsBySiteRegionStats,
  forensicsResultsBySite,
  forensicsResultsBySiteStreamStats,
  getStreamSnapshotsAfterTimestamp,
  translate,
}

export default mockData

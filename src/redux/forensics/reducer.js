/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough,  import/no-cycle */
import { produce, current } from 'immer'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import addDays from 'date-fns/addDays'
import getUnixTime from 'date-fns/getUnixTime'
import { toggleFromArraySingle } from 'utils/toggleFromArraySingleMulti'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'

import * as actionTypes from './actionTypes'
import { SET_VEHICLE_FILTER } from './actionTypes'
import includes from 'lodash/includes'

// default range is now - 1 day
const today = new Date()
const endTs = getUnixTime(today)
const startTs = getUnixTime(addDays(today, -1))

export const initialState = {
  // REGIONS
  regions: [],
  loadingRegions: false,
  hoveredRegion: null,
  activeRegions: [],

  // Region Stats
  regionStats: [],
  loadingRegionStats: false,

  // Stream Stats
  streamStats: [],
  loadingStreamStats: false,

  // entity
  searchQuery: {},

  searchResults: [],
  searchResultsType: null,
  searchPages: null, // total pages of results
  searchSelectedPage: 1, // currently selected page in pagination
  searchTsRange: [startTs, endTs], // date range selected searched values
  selectionTsRange: [startTs, endTs], // date range max values
  searchTotalCount: null,
  searchCurrentPage: null, // result page from gql (should match searchSelectedPage)
  searchRangePresetIndex: 4,
  loadingSearch: false,
  error: null,
  shouldGenerateNewSearch: false, // trigger to generate a new hey Ambient search
  isReIdSearchVisible: false,

  // sites
  timezone: DEFAULT_TIMEZONE,
  sites: [],
  loadingSites: false,
  siteSlug: null,

  // streams
  selectedRegion: null, // show streams component
  loadingStreams: false,
  streamsByRegion: {},
  activeStream: null, // null or single stream ID for selected region
  streamQuery: null,
  streamIdHovered: null,

  // snapshots
  loadingSnapshots: false,
  snapshots: [],

  // graph elements
  regionNodes: [],
  streamNodeData: [],
  incidentNodes: [],
  streamNodesWithHit: [],
  viableRegionsCount: 0,
  graphPage: 1,

  // search suggestions
  searchSuggestions: [],
  selectedSuggestion: {},

  // save history of searches
  history: [],

  // vehicle filters
  isVehicleFiltersActive: false,
  vehicleType: null,
  vehicleColor: null,
}

const forensicsReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_VEHICLE_FILTER:
      draft.vehicleType = get(action, 'payload.type', null)
      draft.vehicleColor = get(action, 'payload.color', null)
      return draft

    case actionTypes.ENTITY_FETCH_SUCCEEDED:
      draft.loadingSearch = false
      const searchResults = get(action, 'payload.instances', [])
      draft.searchResults = searchResults
      draft.searchResultsType = get(action, 'payload.searchType')
      draft.streamNodesWithHit = searchResults.reduce((acc, curr) => {
        const streamId = get(curr, 'stream.id', null)
        if (streamId && acc.indexOf(streamId) === -1) {
          acc.push(streamId)
        }
        return acc
      }, [])
      draft.searchPages = get(action, 'payload.pages')
      draft.searchCurrentPage = get(action, 'payload.currentPage')
      draft.searchTotalCount = get(action, 'payload.totalCount')
      return draft

    case actionTypes.ENTITY_FETCH_REQUESTED:
      draft.loadingSearch = true
      return draft

    case actionTypes.SET_RANGE_PRESET_INDEX:
      draft.searchRangePresetIndex = action.payload
      return draft

    case actionTypes.ENTITY_FETCH_FAILED:
      draft.loadingSearch = false
      draft.error = action.payload.error
      return draft

    case actionTypes.RESET_SEARCH:
      draft.searchQuery = {}
      draft.searchResults = []
      draft.searchPages = null
      draft.searchCurrentPage = null
      draft.searchTotalCount = null
      draft.loadingSearch = false
      draft.regionStats = []
      draft.activeRegions = []
      draft.activeStream = null
      draft.shouldGenerateNewSearch = true
      draft.selectedRegion = null
      draft.selectedSuggestion = {}
      draft.streamQuery = null
      return draft

    case actionTypes.TOGGLE_SHOULD_GENERATE_NEW_SEARCH:
      draft.shouldGenerateNewSearch = !draft.shouldGenerateNewSearch
      return draft

    case actionTypes.SET_SEARCH_TS_RANGE:
      draft.searchTsRange = action.payload
      return draft

    case actionTypes.SET_SELECTION_TS_RANGE:
      // set main range
      draft.selectionTsRange = action.payload

      const start = action.payload[0]
      const end = action.payload[1]

      // Set Searched Values, if out of bounds
      if (end < draft.searchTsRange[1]) {
        draft.searchTsRange[1] = end
      }
      if (start > draft.searchTsRange[0]) {
        draft.searchTsRange[0] = start
      }

      return draft

    case actionTypes.SET_SEARCH_QUERY:
      draft.searchQuery = action.payload
      return draft

    case actionTypes.SET_SELECTED_PAGE:
      draft.searchSelectedPage = action.payload.selectedPage
      return draft

    // REGIONS
    case actionTypes.REGIONS_FETCH_REQUESTED:
      draft.loadingRegions = true
      return draft

    case actionTypes.REGIONS_FETCH_SUCCEEDED:
      draft.regions = action.payload.regions
      draft.loadingRegions = false
      return draft

    case actionTypes.REGIONS_FETCH_FAILED:
      draft.error = action.payload.error
      draft.loadingRegions = false
      return draft

    // stream fetch
    case actionTypes.STREAMS_FETCH_REQUESTED:
      draft.loadingStreams = true
      return draft

    case actionTypes.STREAMS_FETCH_SUCCEEDED:
      draft.loadingStreams = false
      draft.streamsByRegion = groupBy(
        action.payload.streamsBySite.map(stream => ({
          ...stream,
          active: true,
        })),
        'region.id',
      ) // by default stream should be activated
      return draft

    case actionTypes.STREAMS_FETCH_FAILED:
      draft.loadingStreams = false
      draft.streamsByRegion = {} // empty
      return draft

    case actionTypes.SELECT_REGION:
      draft.selectedRegion = action.payload
      return draft

    case actionTypes.TOGGLE_ACTIVE_STREAM:
      const { regionId, streamId } = action.payload
      const foundStreamIndex = (
        draft.streamsByRegion[regionId] || []
      ).findIndex(stream => stream.id === streamId)
      if (foundStreamIndex >= 0) {
        draft.streamsByRegion[regionId][foundStreamIndex].active = !draft
          .streamsByRegion[regionId][foundStreamIndex].active
      }
      return draft

    case actionTypes.SET_ACTIVE_STREAM:
      const newStreamId = action.payload.streamId
      if (draft.activeStream === newStreamId) {
        draft.activeStream = null
      } else {
        draft.activeStream = newStreamId
      }

      return draft

    case actionTypes.ACTIVATE_ALL_REGION_STREAMS:
      // Will need to reimplement this for when we bring back stream selector
      draft.activeStream = null
      return draft

    case actionTypes.SET_HOVERED_REGION:
      draft.hoveredRegion = action.payload.regionId
      return draft

    case actionTypes.TOGGLE_ACTIVE_REGION:
      draft.activeRegions = toggleFromArraySingle(
        draft.activeRegions,
        action.payload.regionId,
        draft.regionStats.map(st => st.regionPk), // default value,
      )
      draft.activeStream = null // reset streams

      return draft

    case actionTypes.SET_ACTIVE_REGIONS:
      draft.activeRegions = action.payload
      draft.activeStream = null // reset active streams
      return draft

    // REGION STATS
    case actionTypes.REGION_STATS_FETCH_REQUESTED:
      draft.loadingRegionStats = true
      return draft

    case actionTypes.REGION_STATS_FETCH_SUCCEEDED:
      if (get(action.payload, 'regionStats')) {
        draft.regionStats = action.payload.regionStats

        // if all regions were selected, and there are new regions, keep "all active"
        if (
          draft.activeRegions.length === draft.regionStats.length ||
          draft.activeRegions.length === 0
        ) {
          draft.activeRegions = action.payload.regionStats.map(
            stat => stat.regionPk,
          )
        }
      }
      if (get(action.payload, 'streamStats')) {
        draft.streamStats = action.payload.streamStats
      }
      draft.loadingRegionStats = false
      return draft

    case actionTypes.REGION_STATS_FETCH_FAILED:
      draft.error = action.payload.error
      draft.loadingRegionStats = false
      return draft

    // SITES
    case actionTypes.SET_SELECTED_TIMEZONE:
      draft.timezone = action.payload.timezone
      return draft

    case actionTypes.SITES_FETCH_REQUESTED:
      draft.loadingSites = true
      return draft

    case actionTypes.SITES_FETCH_SUCCEEDED:
      draft.sites = action.payload.sites
      draft.loadingSites = false
      return draft

    case actionTypes.SITES_FETCH_FAILED:
      draft.loadingSites = false
      draft.error = action.payload.error
      return draft

    case actionTypes.SNAPSHOTS_FETCH_REQUESTED:
      draft.loadingSnapshots = true
      return draft

    case actionTypes.SNAPSHOTS_FETCH_SUCCEEDED:
      draft.loadingSnapshots = false
      draft.snapshots = get(action.payload, 'snapshots', [])
      return draft

    case actionTypes.SNAPSHOTS_FETCH_FAILED:
      draft.loadingSnapshots = false
      draft.error = action.payload.error
      return draft

    case actionTypes.ADD_REGION_NODES:
      if (Array.isArray(action.payload)) {
        // endpoint was sometimes passing string error msg
        draft.regionNodes = action.payload
      } else {
        draft.regionNodes = []
      }

      return draft

    case actionTypes.UPDATE_STREAM_NODE_DATA:
      draft.streamNodeData = action.payload.streamNodeData
      draft.totalGraphPages = action.payload.totalGraphPages
      return draft

    case actionTypes.UPDATE_STREAM_NODES:
      draft.streamNodes = action.payload.streamNodes
      return draft

    case actionTypes.UPDATE_INCIDENT_NODES:
      draft.incidentNodes = action.payload
      return draft

    case actionTypes.UPDATE_GRAPH_PAGE:
      draft.graphPage = action.payload
      return draft

    case actionTypes.ADD_VIABLE_REGIONS_COUNT:
      draft.viableRegionsCount = action.payload
      return draft

    case actionTypes.CLEAR_SELECTED_REGION:
      draft.selectedRegion = null
      return draft

    case actionTypes.SUGGESTIONS_FETCH_SUCCEEDED:
      draft.searchSuggestions = action.payload.searchSuggestions
      return draft

    case actionTypes.SET_SELECTED_SUGGESTION:
      draft.selectedSuggestion = action.payload
      draft.isVehicleFiltersActive = includes(
        get(action.payload, 'params.name', '').toLowerCase(),
        'vehicle',
      )
      return draft

    case actionTypes.SET_STREAM_QUERY:
      draft.streamQuery = action.payload
      return draft

    case actionTypes.SET_HOVERED_STREAM:
      draft.streamIdHovered = action.payload
      return draft

    case actionTypes.SET_IS_REID_SEARCH_VISIBLE:
      draft.isReIdSearchVisible = action.payload
      return draft

    case actionTypes.ADD_HISTORY_ITEM:
      // check to see if current state of history has any item with same name
      // this ensures not to add duplicates
      if (
        !current(draft.history).find(
          item => item.params.name === action.payload.params.name,
        )
      ) {
        draft.history.push(action.payload)
      }

      return draft

    default:
      return draft
  }
})

export default forensicsReducer

import * as actionTypes from './actionTypes'

// entity
export const setVehicleFilters = payload => {
  return {
    type: actionTypes.SET_VEHICLE_FILTER,
    payload,
  }
}

// entity
export const entityFetchRequested = payload => {
  return {
    type: actionTypes.ENTITY_FETCH_REQUESTED,
    payload,
  }
}

export const entityFetchSucceeded = payload => {
  return {
    type: actionTypes.ENTITY_FETCH_SUCCEEDED,
    payload,
  }
}

export const entityFetchFailed = payload => {
  return {
    type: actionTypes.ENTITY_FETCH_FAILED,
    payload,
    error: true,
  }
}

export const setRangePresetIndex = payload => {
  return {
    type: actionTypes.SET_RANGE_PRESET_INDEX,
    payload,
  }
}

export const resetSearch = payload => {
  return {
    type: actionTypes.RESET_SEARCH,
  }
}

export const toggleShouldGenerateNewSearch = () => {
  return {
    type: actionTypes.TOGGLE_SHOULD_GENERATE_NEW_SEARCH,
  }
}

export const setSearchQuery = payload => {
  return {
    type: actionTypes.SET_SEARCH_QUERY,
    payload,
  }
}

// the inner selecion slider range that we are searching on.
// [startUnixTs, endUnixTs]
export const setSearchTsRange = payload => {
  return {
    type: actionTypes.SET_SEARCH_TS_RANGE,
    payload,
  }
}

export const setSelectedPage = page => {
  return {
    type: actionTypes.SET_SELECTED_PAGE,
    payload: {
      selectedPage: page,
    },
  }
}

// the outer selection overall range that we are searching on
export const setSelectionTsRange = payload => {
  return {
    type: actionTypes.SET_SELECTION_TS_RANGE,
    payload,
  }
}

// region
export const regionsFetchRequested = payload => {
  return {
    type: actionTypes.REGIONS_FETCH_REQUESTED,
    payload,
  }
}

export const regionsFetchSucceeded = regions => {
  return {
    type: actionTypes.REGIONS_FETCH_SUCCEEDED,
    payload: {
      regions,
    },
  }
}

export const regionsFetchFailed = payload => {
  return {
    type: actionTypes.REGIONS_FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const regionsSetHovered = regionId => {
  return {
    type: actionTypes.SET_HOVERED_REGION,
    payload: {
      regionId,
    },
  }
}

export const regionsToggleActive = regionId => {
  return {
    type: actionTypes.TOGGLE_ACTIVE_REGION,
    payload: {
      regionId,
    },
  }
}

export const setActiveRegions = regionList => {
  return {
    type: actionTypes.SET_ACTIVE_REGIONS,
    payload: regionList,
  }
}

export const selectRegion = regionId => {
  return {
    type: actionTypes.SELECT_REGION,
    payload: regionId,
  }
}

// region stats
export const regionStatsFetchRequested = payload => {
  return {
    type: actionTypes.REGION_STATS_FETCH_REQUESTED,
    payload,
  }
}

export const regionStatsFetchSucceeded = payload => {
  return {
    type: actionTypes.REGION_STATS_FETCH_SUCCEEDED,
    payload,
  }
}

export const regionStatsFetchFailed = payload => {
  return {
    type: actionTypes.REGION_STATS_FETCH_FAILED,
    payload,
    error: true,
  }
}

// site
export const sitesFetchRequested = (accountSlug = '') => {
  return {
    type: actionTypes.SITES_FETCH_REQUESTED,
    payload: {
      accountSlug,
    },
  }
}

export const sitesFetchSucceeded = sites => {
  return {
    type: actionTypes.SITES_FETCH_SUCCEEDED,
    payload: {
      sites,
    },
  }
}

export const sitesFetchFailed = payload => {
  return {
    type: actionTypes.SITES_FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const selectTimezone = timezone => {
  return {
    type: actionTypes.SET_SELECTED_TIMEZONE,
    payload: {
      timezone,
    },
  }
}

// streams
export const streamsBySiteFetchRequested = ({ accountSlug, siteSlug }) => {
  return {
    type: actionTypes.STREAMS_FETCH_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
    },
  }
}

export const streamsBySiteFetchSucceeded = streamsBySite => {
  return {
    type: actionTypes.STREAMS_FETCH_SUCCEEDED,
    payload: {
      streamsBySite,
    },
  }
}

export const streamsBySiteFetchFailed = payload => {
  return {
    type: actionTypes.STREAMS_FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const toggleActiveStream = ({ regionId, streamId }) => {
  return {
    type: actionTypes.TOGGLE_ACTIVE_STREAM,
    payload: {
      regionId,
      streamId,
    },
  }
}

export const setActiveStream = ({ regionId, streamId }) => {
  return {
    type: actionTypes.SET_ACTIVE_STREAM,
    payload: {
      regionId,
      streamId,
    },
  }
}

export const snapshotsFetchRequested = ({ streamId, startTs }) => {
  return {
    type: actionTypes.SNAPSHOTS_FETCH_REQUESTED,
    payload: {
      streamId,
      startTs,
    },
  }
}

export const snapshotsFetchSucceeded = snapshots => {
  return {
    type: actionTypes.SNAPSHOTS_FETCH_SUCCEEDED,
    payload: {
      snapshots,
    },
  }
}

export const snapshotsFetchFailed = payload => {
  return {
    type: actionTypes.SNAPSHOTS_FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}

// end regions

// graph elements
export const addRegionNodes = payload => {
  return {
    type: actionTypes.ADD_REGION_NODES,
    payload,
  }
}

export const updateStreamNodeData = ({ streamNodeData, totalGraphPages }) => {
  return {
    type: actionTypes.UPDATE_STREAM_NODE_DATA,
    payload: {
      totalGraphPages,
      streamNodeData,
    },
  }
}

export const updateStreamNodes = ({ streamNodes, graphPage }) => {
  return {
    type: actionTypes.UPDATE_STREAM_NODES,
    payload: {
      streamNodes,
      graphPage,
    },
  }
}

export const updateGraphPage = payload => {
  return {
    type: actionTypes.UPDATE_GRAPH_PAGE,
    payload,
  }
}

export const updateIncidentNodes = payload => {
  return {
    type: actionTypes.UPDATE_INCIDENT_NODES,
    payload,
  }
}

export const addViableRegionsCount = payload => {
  return {
    type: actionTypes.ADD_VIABLE_REGIONS_COUNT,
    payload,
  }
}

export const clearSelectedRegion = () => {
  return {
    type: actionTypes.CLEAR_SELECTED_REGION,
  }
}

// Search Suggestions
export const suggestionsFetchRequested = (accountSlug = '') => {
  return {
    type: actionTypes.SUGGESTIONS_FETCH_REQUESTED,
    payload: {
      accountSlug,
    },
  }
}

export const suggestionsFetchSucceeded = searchSuggestions => {
  return {
    type: actionTypes.SUGGESTIONS_FETCH_SUCCEEDED,
    payload: {
      searchSuggestions,
    },
  }
}

export const suggestionsFetchFailed = payload => {
  return {
    type: actionTypes.SUGGESTIONS_FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const setSelectedSuggestion = payload => {
  return {
    type: actionTypes.SET_SELECTED_SUGGESTION,
    payload,
  }
}

// set SEARCH Query
export const setStreamQuery = payload => {
  return {
    type: actionTypes.SET_STREAM_QUERY,
    payload,
  }
}

export const setHoveredStream = payload => {
  return {
    type: actionTypes.SET_HOVERED_STREAM,
    payload,
  }
}

export const setIsReIdSearchVisible = payload => {
  return {
    type: actionTypes.SET_IS_REID_SEARCH_VISIBLE,
    payload,
  }
}

export const addHistoryItem = payload => {
  return {
    type: actionTypes.ADD_HISTORY_ITEM,
    payload,
  }
}

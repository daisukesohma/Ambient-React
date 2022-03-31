import {
  // SITES
  FETCH_SITES_REQUESTED,
  FETCH_SITES_SUCCEEDED,
  FETCH_SITES_FAILED,
  UPDATE_STREAM_SITE_REQUESTED,
  UPDATE_STREAM_SITE_SUCCEEDED,
  UPDATE_STREAM_SITE_FAILED,
  // STREAMS
  FIND_STREAMS_REQUESTED,
  FIND_STREAMS_SUCCEEDED,
  FIND_STREAMS_FAILED,
  //  STREAM HEALTH
  SET_STREAM_HEALTH,
  SET_STREAM_HEALTH_IS_TABLE_UPDATED,
  SET_STREAM_HEALTH_LOADING,
  SET_STREAM_SEARCH_TERM,
  SET_SORT_OPTIONS,
  // STREAM IDS FOR SITE
  GET_ALL_STREAM_IDS_FOR_SITE_REQUESTED,
  GET_ALL_STREAM_IDS_FOR_SITE_SUCCEEDED,
  GET_ALL_STREAM_IDS_FOR_SITE_FAILED,
  // EDITABLE
  SET_EDITABLE_TABLE,
} from './actionTypes'

// SITES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const fetchSitesRequested = (accountSlug = '') => {
  return {
    type: FETCH_SITES_REQUESTED,
    payload: {
      accountSlug,
    },
  }
}

export const fetchSitesSucceeded = sites => {
  return {
    type: FETCH_SITES_SUCCEEDED,
    payload: {
      sites,
    },
  }
}

export const fetchSitesFailed = payload => {
  return {
    type: FETCH_SITES_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const updateStreamSiteRequested = variables => {
  return {
    type: UPDATE_STREAM_SITE_REQUESTED,
    payload: {
      variables,
    },
  }
}

export const updateStreamSiteSucceeded = () => {
  return {
    type: UPDATE_STREAM_SITE_SUCCEEDED,
  }
}

export const updateStreamSiteFailed = payload => {
  return {
    type: UPDATE_STREAM_SITE_FAILED,
    payload: payload.error,
    error: true,
  }
}

// STREAMS  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
export const findStreamsRequested = variables => {
  return {
    type: FIND_STREAMS_REQUESTED,
    payload: {
      variables,
    },
  }
}

export const findStreamsSucceeded = ({
  instances,
  pages,
  currentPage,
  totalCount,
}) => {
  return {
    type: FIND_STREAMS_SUCCEEDED,
    payload: {
      instances,
      pages,
      currentPage,
      totalCount,
    },
  }
}

export const findStreamsFailed = payload => {
  return {
    type: FIND_STREAMS_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const setStreamSearchTerm = search => {
  return {
    type: SET_STREAM_SEARCH_TERM,
    payload: {
      search,
    },
  }
}

export const setSortOptions = ({ sortBy, sortOrder }) => {
  return {
    type: SET_SORT_OPTIONS,
    payload: {
      sortBy,
      sortOrder,
    },
  }
}

// STREAM HEALTH ++++++++++++++++++++++++++++++++++++++++++++++++
export const setStreamHealth = data => {
  return {
    type: SET_STREAM_HEALTH,
    payload: {
      data,
    },
  }
}

export const streamsHealthIsTableUpdated = isUpdated => {
  return {
    type: SET_STREAM_HEALTH_IS_TABLE_UPDATED,
    payload: {
      isUpdated,
    },
  }
}

export const setStreamsHealthLoading = isLoading => {
  return {
    type: SET_STREAM_HEALTH_LOADING,
    payload: {
      isLoading,
    },
  }
}

// STREAM IDS FOR SITE
export const getAllStreamIdsForSiteRequested = variables => {
  return {
    type: GET_ALL_STREAM_IDS_FOR_SITE_REQUESTED,
    payload: {
      variables,
    },
  }
}

export const getAllStreamIdsForSiteSucceeded = ({ instances }) => {
  return {
    type: GET_ALL_STREAM_IDS_FOR_SITE_SUCCEEDED,
    payload: {
      instances,
    },
  }
}

export const getAllStreamIdsForSiteFailed = payload => {
  return {
    type: GET_ALL_STREAM_IDS_FOR_SITE_FAILED,
    payload: payload.error,
    error: true,
  }
}

// editable
export const setEditableTable = ({ editable }) => {
  return {
    type: SET_EDITABLE_TABLE,
    payload: {
      editable,
    },
  }
}

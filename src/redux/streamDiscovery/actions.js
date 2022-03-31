import get from 'lodash/get'

import {
  FETCH_REQUESTED,
  FETCH_SUCCEEDED,
  FETCH_FAILED,
  SELECTED_NODE_CHANGED,
  ADD_STREAM,
  REMOVE_STREAM,
  EXPAND_IP,
  COLLAPSE_IP,
  CREATE_STREAMS_REQUESTED,
  CREATE_STREAMS_SUCCEEDED,
  CREATE_STREAMS_FAILED,
  TOGGLE_CONFIRM_MODAL,
  CHANGE_STREAM_NAME,
  CHANGE_STREAM_REGION,
  CHANGE_STREAM_SITE,
  SET_IS_CREATOR_DIRTY,
  SET_IS_SELECTOR_DIRTY,
  SAVE_CREATOR_DATA,
  SAVE_CREATOR_SELECTED_ROW_IDS,
  FETCH_THUMBNAIL_REQUESTED,
  FETCH_THUMBNAIL_SUCCEEDED,
  FETCH_THUMBNAIL_FAILED,
  CLEAR_STREAM_DISCOVERY,
} from './actionTypes'

// START - COLLECTION FETCH
export const streamDiscoveryFetchRequested = ({
  nodeRequestId,
  accountSlug,
}) => {
  return {
    type: FETCH_REQUESTED,
    payload: {
      nodeRequestId,
      accountSlug,
    },
  }
}

export const streamDiscoveryFetchSucceeded = payload => {
  return {
    type: FETCH_SUCCEEDED,
    payload: payload.data,
  }
}

export const streamDiscoveryFetchFailed = payload => {
  return {
    type: FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}
// END - COLLECTION FETCH

export const selectedNodeChanged = payload => {
  return {
    type: SELECTED_NODE_CHANGED,
    payload: get(payload, 'data'),
  }
}

export const addStream = payload => {
  return {
    type: ADD_STREAM,
    payload,
  }
}

export const removeStream = payload => {
  return {
    type: REMOVE_STREAM,
    payload,
  }
}

export const expandIp = payload => {
  return {
    type: EXPAND_IP,
    payload,
  }
}

export const collapseIp = () => {
  return {
    type: COLLAPSE_IP,
  }
}

export const createStreamsRequested = payload => {
  return {
    type: CREATE_STREAMS_REQUESTED,
    payload,
  }
}

export const createStreamsSucceeded = payload => {
  return {
    type: CREATE_STREAMS_SUCCEEDED,
    payload,
  }
}

export const createStreamsFailed = payload => {
  return {
    type: CREATE_STREAMS_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const toggleConfirmModal = payload => {
  return {
    type: TOGGLE_CONFIRM_MODAL,
  }
}

export const changeStreamName = payload => {
  return {
    type: CHANGE_STREAM_NAME,
    payload,
  }
}

export const changeStreamRegion = payload => {
  return {
    type: CHANGE_STREAM_REGION,
    payload,
  }
}

export const changeStreamSite = payload => {
  return {
    type: CHANGE_STREAM_SITE,
    payload,
  }
}

export const setIsCreatorDirty = payload => {
  return {
    type: SET_IS_CREATOR_DIRTY,
    payload,
  }
}

export const setIsSelectorDirty = payload => {
  return {
    type: SET_IS_SELECTOR_DIRTY,
    payload,
  }
}

export const saveCreatorData = payload => {
  return {
    type: SAVE_CREATOR_DATA,
    payload,
  }
}

export const saveCreatorSelectedRowIds = payload => {
  return {
    type: SAVE_CREATOR_SELECTED_ROW_IDS,
    payload,
  }
}

export const streamDiscoveryFetchThumbnailRequested = ({
  nodeIdentifier,
  id,
  streamUrl,
}) => {
  return {
    type: FETCH_THUMBNAIL_REQUESTED,
    payload: {
      nodeIdentifier,
      id,
      streamUrl,
    },
  }
}

export const streamDiscoveryFetchThumbnailSucceeded = ({ data }) => {
  return {
    type: FETCH_THUMBNAIL_SUCCEEDED,
    payload: data,
  }
}

export const streamDiscoveryFetchThumbnailFailed = ({ error }) => {
  return {
    type: FETCH_THUMBNAIL_FAILED,
    payload: error,
    error: true,
  }
}

export const clearStreamDiscoveryState = () => {
  return {
    type: CLEAR_STREAM_DISCOVERY,
  }
}

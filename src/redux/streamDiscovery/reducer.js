/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'
import get from 'lodash/get'
import each from 'lodash/each'
import findIndex from 'lodash/findIndex'

import {
  FETCH_REQUESTED,
  FETCH_SUCCEEDED,
  FETCH_FAILED,
  SELECTED_NODE_CHANGED,
  ADD_STREAM,
  REMOVE_STREAM,
  COLLAPSE_IP,
  EXPAND_IP,
  CREATE_STREAMS_REQUESTED,
  CREATE_STREAMS_SUCCEEDED,
  CREATE_STREAMS_FAILED,
  TOGGLE_CONFIRM_MODAL,
  CHANGE_STREAM_REGION,
  CHANGE_STREAM_NAME,
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

export const initialState = {
  nodeRequest: {},
  nodes: [],
  selectedNode: {},
  error: null,
  loading: false,
  streamsToCreate: [],
  expandedIp: null,
  showModal: false,
  isCreatorDirty: false,
  isSelectorDirty: false,
  saved: {
    creator: {
      data: [],
      selectedRowIds: [],
    },
  },
  isSubmitting: false,
}

const streamDiscoveryReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    // fetch
    case FETCH_REQUESTED:
      draft.loading = true
      return draft

    case FETCH_SUCCEEDED:
      draft.loading = false
      draft.nodeRequest = get(action, 'payload')
      draft.nodes = get(action, 'payload.node.site.nodes') // TODO TURNKEY: Will want to change this reference

      const defaultRegion = get(action, 'payload.node.site.siteType.regions[0]')
      const defaultSiteId = get(action, 'payload.defaultSiteId')

      // Initially add the first stream from each IP TODO: Update this @rodaan
      const ips = {}
      const { streamRequests } = draft.nodeRequest

      // create the array of streamRequests
      each(streamRequests, streamRequest => {
        const { cameraIp } = streamRequest
        // Add default region id
        streamRequest.regionId = defaultRegion.id
        streamRequest.siteId = defaultSiteId

        if (ips[cameraIp] === undefined) {
          ips[cameraIp] = {
            streamRequests: [streamRequest],
            ip: cameraIp,
          }
        } else {
          ips[cameraIp].streamRequests.push(streamRequest)
        }
      })

      const streamsToCreate = []

      each(Object.entries(ips), entry => {
        streamsToCreate.push(ips[entry[0]].streamRequests[0])
      })

      draft.streamsToCreate = streamsToCreate
      return draft

    case FETCH_FAILED:
      draft.loading = false
      draft.error = action.payload.error
      return draft

    case SELECTED_NODE_CHANGED:
      draft.selectedNode = get(action, 'payload')
      return draft

    case EXPAND_IP:
      draft.expandedIp = get(action, 'payload')
      return draft

    case COLLAPSE_IP:
      draft.expandedIp = null
      return draft

    case ADD_STREAM:
      draft.streamsToCreate.push(get(action, 'payload'))
      return draft

    case REMOVE_STREAM:
      draft.streamsToCreate = draft.streamsToCreate.filter(stream => {
        return stream.id !== get(action, 'payload')
      })
      return draft

    case CREATE_STREAMS_REQUESTED:
      draft.loading = true
      draft.isSubmitting = true
      return draft

    case CREATE_STREAMS_SUCCEEDED:
      draft.loading = false
      draft.isSubmitting = false
      return draft

    case CREATE_STREAMS_FAILED:
      draft.loading = false
      draft.error = action.payload.error
      draft.isSubmitting = false
      return draft

    case TOGGLE_CONFIRM_MODAL:
      draft.showModal = !draft.showModal
      return draft

    case CHANGE_STREAM_NAME:
      const streamToUpdateNameIdx = findIndex(
        draft.streamsToCreate,
        stream => stream.id === get(action, 'payload.id'),
      )

      if (streamToUpdateNameIdx > -1) {
        draft.streamsToCreate[streamToUpdateNameIdx].streamName = get(
          action,
          'payload.streamName',
        )
      }

      return draft

    case CHANGE_STREAM_REGION:
      const streamToUpdateRegionIdx = findIndex(
        draft.streamsToCreate,
        stream => {
          return stream.id === get(action, 'payload.id')
        },
      )

      if (streamToUpdateRegionIdx > -1) {
        draft.streamsToCreate[streamToUpdateRegionIdx].regionId = get(
          action,
          'payload.value',
        )
      }
      return draft

    case CHANGE_STREAM_SITE:
      const streamToUpdateSiteIdx = findIndex(draft.streamsToCreate, stream => {
        return stream.id === get(action, 'payload.id')
      })

      if (streamToUpdateSiteIdx > -1) {
        draft.streamsToCreate[streamToUpdateSiteIdx].siteId = Number(
          get(action, 'payload.value'),
        )
      }
      return draft

    case SET_IS_CREATOR_DIRTY:
      draft.isCreatorDirty = action.payload
      return draft

    case SET_IS_SELECTOR_DIRTY:
      draft.isSelectorDirty = action.payload
      return draft

    case SAVE_CREATOR_DATA:
      draft.saved = {
        ...draft.saved,
        creator: {
          ...draft.saved.creator,
          data: action.payload,
        },
      }

      return draft

    case SAVE_CREATOR_SELECTED_ROW_IDS:
      draft.saved = {
        ...draft.saved,
        creator: {
          ...draft.saved.creator,
          selectedRowIds: action.payload,
        },
      }

      return draft

    case FETCH_THUMBNAIL_REQUESTED:
      draft.loading = true
      return draft

    case FETCH_THUMBNAIL_SUCCEEDED:
      draft.loading = false
      return draft

    case FETCH_THUMBNAIL_FAILED:
      draft.loading = false
      draft.error = action.payload
      return draft

    case CLEAR_STREAM_DISCOVERY:
      draft = initialState
      return draft

    default:
      return draft
  }
})

export default streamDiscoveryReducer

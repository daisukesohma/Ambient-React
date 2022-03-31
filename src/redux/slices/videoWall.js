/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

export const initialState = {
  // videoWall template states
  videoWallTemplates: [],
  videoWallTemplateFetchLoading: false,
  activeVideoWall: {},
  fullscreen: false,
}

const slice = createSlice({
  name: 'videoWall',
  initialState,

  reducers: {
    videoWallTemplatesFetchRequested: (state, action) => {
      if (isEmpty(state.videoWallTemplates)) {
        state.videoWallTemplateFetchLoading = true
      }
    },
    videoWallTemplatesFetchSucceeded: (state, action) => {
      state.videoWallTemplates = action.payload.videoWallTemplates
      state.videoWallTemplateFetchLoading = false
    },
    videoWallTemplatesFetchFailed: (state, action) => {
      state.error = action.payload.error
      state.videoWallTemplateFetchLoading = false
    },

    setActiveVideoWall: (state, action) => {
      state.activeVideoWall = action.payload.activeVideoWall
    },

    unsetActiveVideoWall: (state, action) => {
      if (
        !isEmpty(state.activeVideoWall) &&
        state.activeVideoWall.id === action.payload.id
      ) {
        state.activeVideoWall = null
      }
    },
    setTemplate: (state, action) => {
      state.activeVideoWall.template = action.payload.template
    },
    setStreamCell: (state, action) => {
      const streamFeedsItem = find(state.activeVideoWall.streamFeeds, {
        orderIndex: action.payload.orderIndex,
      })
      if (streamFeedsItem) {
        streamFeedsItem.streamId = action.payload.streamId
      } else {
        state.activeVideoWall.streamFeeds.push(action.payload)
      }
    },
    clearStreamCell: (state, action) => {
      const streamFeedsItem = find(state.activeVideoWall.streamFeeds, {
        orderIndex: action.payload.orderIndex,
      })
      if (streamFeedsItem) {
        streamFeedsItem.streamId = null
      }
    },
    clearStreamList: (state, action) => {
      state.activeVideoWall.streamFeeds = state.activeVideoWall.streamFeeds.map(
        streamFeed => {
          streamFeed.streamId = null
          streamFeed.stream = null
          return streamFeed
        },
      )
    },
    toggleWallPrivacy: (state, action) => {
      state.activeVideoWall.public = !state.activeVideoWall.public
    },
    toggleFullscreen: (state, action) => {
      state.fullscreen = !state.fullscreen
    },
  },
})

export const {
  videoWallTemplatesFetchRequested,
  videoWallTemplatesFetchSucceeded,
  videoWallTemplatesFetchFailed,

  setActiveVideoWall,
  unsetActiveVideoWall,
  setTemplate,
  setStreamCell,
  clearStreamCell,
  clearStreamList,
  toggleWallPrivacy,
  toggleFullscreen,
} = slice.actions

export default slice.reducer

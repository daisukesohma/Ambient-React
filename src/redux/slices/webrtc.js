/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
// Primarily for handling video streams
import { createSlice } from '@reduxjs/toolkit'
import findKey from 'lodash/findKey'

import {
  WebRTCMessageTypeEnum,
  StreamStateEnum,
  StreamTypeUpdatedEnum,
} from '../../enums'

const webrtcSlice = createSlice({
  name: 'webrtc',
  initialState: {
    streams: {},
    p2pLoading: false,
    p2pActive: false,
    p2pId: null,
    p2pMessageStatus: 'none', // 'requested', 'succeeded', 'failed'
    channelMessageStatus: 'none', // 'requested', 'succeeded'
    inError: false,
  },
  reducers: {
    setupP2PRequested: (state, action) => {
      state.p2pLoading = true
    },
    setupP2PSucceeded: (state, action) => {
      state.p2pLoading = false
      state.p2pActive = true
      state.p2pId = action.payload.p2pId
    },
    setupP2PFailed: (state, action) => {
      state.p2pLoading = false
      state.p2pActive = false
    },
    resetConnectionRequested: (state, action) => {},
    disconnectP2PRequested: (state, action) => {},
    disconnectP2PSucceeded: (state, action) => {
      state.p2pActive = false
    },
    disconnectP2PFailed: (state, action) => {},
    streamingError: (state, action) => {
      state.inError = true
      //      state.streams = {}
    },
    refreshIceServersSucceeded: (state, action) => {},
    refreshIceServersFailed: (state, action) => {},
    sendP2PMessageRequested: (state, action) => {
      state.p2pMessageStatus = 'requested'
    },
    sendP2PMessageSucceeded: (state, action) => {
      if (state.inError) {
        return
      }
      state.p2pMessageStatus = 'succeeded'
      if (action.payload.data.type === WebRTCMessageTypeEnum.REQUEST_STREAM) {
        const { videoStreamKey } = action.payload
        if (state.streams[videoStreamKey] !== undefined) {
          state.streams[videoStreamKey].status = StreamStateEnum.LOADING
          state.streams[videoStreamKey].oldTrackId = action.payload.data.trackid
          if (action.payload.data.ts) {
            state.streams[videoStreamKey].requestTs = action.payload.data.ts
            state.streams[videoStreamKey].ts = action.payload.data.ts
            state.streams[videoStreamKey].syncTs = action.payload.data.ts
          } else {
            state.streams[videoStreamKey].requestTs = null
            state.streams[videoStreamKey].ts = null
            state.streams[videoStreamKey].syncTs = null
          }
        }
      } else if (action.payload.data.type === WebRTCMessageTypeEnum.HANG_UP) {
        const { videoStreamKey } = action.payload
        if (state.streams[videoStreamKey] !== undefined) {
          state.streams[videoStreamKey].status = StreamStateEnum.HANGING_UP
          state.streams[videoStreamKey].oldTrackId = null
          state.streams[videoStreamKey].ts = null
          state.streams[videoStreamKey].syncTs = null
        }
      } else if (action.payload.data.type === WebRTCMessageTypeEnum.ARCHIVAL) {
        const { videoStreamKey } = action.payload
        if (state.streams[videoStreamKey] !== undefined) {
          state.streams[videoStreamKey].ts = action.payload.data.ts
          state.streams[videoStreamKey].syncTs = action.payload.data.ts
        } else {
          console.error(`${videoStreamKey} changed ts in invalid state`)
        }
      }
    },
    sendP2PMessageFailed: (state, action) => {
      state.p2pMessageStatus = 'failed'
    },
    //
    sendChannelMessageRequested: (state, action) => {
      state.channelMessageStatus = 'requested'
    },
    sendChannelMessageSucceeded: (state, action) => {
      state.channelMessageStatus = 'succeeded'
    },
    sendChannelMessageFailed: (state, action) => {
      state.channelMessageStatus = 'failed'
    },
    assignMaxClientStatus: (state, action) => {
      const key = findKey(state.streams, el => {
        return el ? el.oldTrackId === action.payload.oldtrackid : null
      })
      if (key) {
        state.streams[key].newTrackId = action.payload.newtrackid
        state.streams[key].status = StreamStateEnum.ASSIGNED
      }
    },
    attachTrack: (state, action) => {
      if (state.inError) {
        return
      }
      const { videoStreamKey, mediaStream } = action.payload
      if (state.streams[videoStreamKey] !== undefined) {
        if (state.streams[videoStreamKey].status === StreamStateEnum.ASSIGNED) {
          state.streams[videoStreamKey].newTrackId = mediaStream.id
          const { willAutoLoad } = state.streams[videoStreamKey]
          state.streams[videoStreamKey].status = willAutoLoad
            ? StreamStateEnum.PLAYING
            : StreamStateEnum.STOPPED
        }
      } // else do nothing, videoStreamKey is deleted (maybe hang up?)
    },
    updateStreamStatus: (state, action) => {
      if (state.inError) {
        return
      }
      const { videoStreamKey, status } = action.payload
      if (state.streams[videoStreamKey] !== undefined) {
        state.streams[videoStreamKey].status = status
      }
    },
    initVideoStreamFeed: (state, action) => {
      const { videoStreamKey, props } = action.payload
      if (state.streams[videoStreamKey] !== undefined) {
        console.log(`Redux state for ${videoStreamKey} already exists.`)
      }
      state.streams[videoStreamKey] = props
    },
    setVideoStreamFeedValues: (state, action) => {
      if (state.inError) {
        return
      }
      const { videoStreamKey, props } = action.payload
      if (state.streams[videoStreamKey] !== undefined) {
        const prevTs = state.streams[videoStreamKey].ts
        const prevMode = state.streams[videoStreamKey].mode
        const initTs = state.streams[videoStreamKey].initTs
        state.streams[videoStreamKey] = {
          ...state.streams[videoStreamKey],
          ...props,
        }
        if (props.mode && props.mode !== prevMode) {
          if (props.mode === StreamTypeUpdatedEnum.RECORDED) {
            if (state.streams[videoStreamKey].requestTs === null) {
              if (initTs !== null) {
                state.streams[videoStreamKey].requestTs = initTs * 1000
                state.streams[videoStreamKey].ts = initTs * 1000
              } else {
                const newTs = null
                state.streams[videoStreamKey].requestTs = newTs
                state.streams[videoStreamKey].ts = newTs
              }
            }
          } else {
            state.streams[videoStreamKey].requestTs = null
            state.streams[videoStreamKey].ts = null
          }
        }
      } else {
        console.log(`Trying to update ${videoStreamKey} that does not exist.`)
      }
    },
    removeVideoStreamFeed: (state, action) => {
      const { videoStreamKey } = action.payload
      if (state.streams[videoStreamKey] !== undefined) {
        delete state.streams[videoStreamKey]
      }
    },
    fetchStreamSnapshotRequested: (state, action) => {},
    fetchStreamSnapshotSucceeded: (state, action) => {
      const { videoStreamKey, snapshot } = action.payload
      if (state.streams[videoStreamKey]) {
        state.streams[videoStreamKey].snapshot = snapshot
      }
    },
    fetchStreamSnapshotFailed: (state, action) => {},
    resetHangupRequested: (state, action) => {},
    clearP2PId: (state, action) => {
      state.p2pId = null
    },
  },
})

export const {
  setupP2PRequested,
  setupP2PSucceeded,
  setupP2PFailed,
  resetConnectionRequested,
  disconnectP2PRequested,
  disconnectP2PSucceeded,
  disconnectP2PFailed,
  streamingError,
  refreshIceServersSucceeded,
  refreshIceServersFailed,
  sendP2PMessageRequested,
  sendP2PMessageSucceeded,
  sendP2PMessageFailed,
  attachTrack,
  initVideoStreamFeed,
  updateStreamStatus,
  setVideoStreamFeedValues,
  //  disconnectedAt,
  removeVideoStreamFeed,
  fetchStreamSnapshotSucceeded,
  fetchStreamSnapshotRequested,
  fetchStreamSnapshotFailed,
  sendChannelMessageRequested,
  sendChannelMessageSucceeded,
  sendChannelMessageFailed,
  resetHangupRequested,
  clearP2PId,
} = webrtcSlice.actions

export default webrtcSlice.reducer

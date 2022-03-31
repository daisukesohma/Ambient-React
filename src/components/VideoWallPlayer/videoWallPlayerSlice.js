/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import first from 'lodash/first'
import last from 'lodash/last'
import remove from 'lodash/remove'
import each from 'lodash/each'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'

export const MIN_DURATION = 15

export const initialState = {
  id: null,
  activeVideoWall: {},
  timer: 0,
  videoWalls: [],
  isPlayed: false,
  isOpened: false,
  duration: MIN_DURATION,
  error: null,
}

const slice = createSlice({
  name: 'videoWallPlayer',
  initialState,

  reducers: {
    fetchPlayListRequested: (state, action) => {},
    fetchPlayListSucceeded: (state, action) => {
      state.id = action.payload.playList.id
      state.duration = action.payload.playList.duration
      const currentIds = map(state.videoWalls, 'id')
      each(action.payload.playList.playlistEntries, (entity, index) => {
        if (!includes(currentIds, entity.videoWall.id)) {
          state.videoWalls.push({
            ...entity.videoWall,
            object: entity.videoWall,
            playlistEntryId: entity.id,
          })
        }
      })
    },
    requestFailed: (state, action) => {
      state.error = action.payload.message
    },

    setActiveVideoWall: (state, action) => {
      state.activeVideoWall = action.payload.videoWall
    },
    updateTimer: (state, action) => {
      state.timer++
    },
    previousVideoWall: (state, action) => {
      if (isEmpty(state.activeVideoWall)) return
      const index = findIndex(state.videoWalls, {
        id: state.activeVideoWall.id,
      })
      const previousVideoWall = state.videoWalls[index - 1]
      state.activeVideoWall = previousVideoWall || last(state.videoWalls)
    },
    nextVideoWall: (state, action) => {
      if (isEmpty(state.activeVideoWall)) return
      const index = findIndex(state.videoWalls, {
        id: state.activeVideoWall.id,
      })
      const nextVideoWall = state.videoWalls[index + 1]
      state.timer = 0
      state.activeVideoWall = nextVideoWall || first(state.videoWalls)
    },
    updateDurationRequested: (state, action) => {
      state.duration = action.payload.duration
    },
    togglePlayer: state => {
      if (!isEmpty(state.videoWalls)) {
        state.isPlayed = !state.isPlayed
      }
      if (state.isPlayed && isEmpty(state.activeVideoWall)) {
        state.activeVideoWall = first(state.videoWalls)
      }
    },
    pausePlayer: state => {
      state.isPlayed = false
    },
    toggleBar: state => {
      state.isOpened = !state.isOpened
    },
    addVideoWallRequested: (state, action) => {
      const index = findIndex(state.videoWalls, {
        id: action.payload.videoWall.id,
      })
      if (index === -1) {
        state.videoWalls.push(action.payload.videoWall)
      } else {
        state.videoWalls[index] = action.payload.videoWall
      }

      if (isEmpty(state.activeVideoWall)) {
        state.activeVideoWall = action.payload.videoWall
      }
    },

    addVideoWallSucceeded: (state, action) => {
      each(action.payload.playlist.playlistEntries, entity => {
        const videoWall = find(state.videoWalls, { id: entity.videoWall.id })
        videoWall.playlistEntryId = entity.id
      })
    },

    removeVideoWallRequested: (state, action) => {
      const isActive = state.activeVideoWall.id === action.payload.videoWall.id
      remove(state.videoWalls, { id: action.payload.videoWall.id })
      if (isActive) {
        state.activeVideoWall = first(state.videoWalls) || {}
      }
      if (isEmpty(state.videoWalls)) {
        state.timer = 0
        state.isPlayed = false
      }
    },
  },
})

export const {
  fetchPlayListRequested,
  fetchPlayListSucceeded,

  updateTimer,
  setActiveVideoWall,
  previousVideoWall,
  nextVideoWall,
  updateDurationRequested,
  togglePlayer,
  pausePlayer,
  toggleBar,
  addVideoWallRequested,
  addVideoWallSucceeded,
  removeVideoWallRequested,

  requestFailed,
} = slice.actions

export default slice.reducer

/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

export const initialState = {
  sites: [],
  streams: [],
  sitesLoading: false,
  streamsLoading: false,

  videoWall: null,
  videoWallLoading: false,

  editLoading: false,
  error: null,

  alerts: [],
  activeAlert: null,

  users: [],
  usersLoading: false,

  topBarPanelOpened: true,

  // multi site selector
  unSelectedSites: [],
}

const archivesSlice = createSlice({
  name: 'operatorPage',
  initialState,
  reducers: {
    fetchSitesRequested: (state, action) => {
      state.sitesLoading = true
    },
    fetchSitesSucceeded: (state, action) => {
      state.sites = action.payload.sites
      state.sitesLoading = false
    },
    fetchSitesFailed: (state, action) => {
      state.error = action.payload.error
      state.sitesLoading = false
    },
    updateSiteCheckedinProfiles: (state, action) => {
      if (action.payload.workShiftPeriod) {
        const {
          site,
          profile,
          contactResource,
        } = action.payload.workShiftPeriod
        // remove previous responder data if exists
        const foundSiteIndex = state.sites.findIndex(existingSite => {
          const { activeWorkShiftPeriods } = existingSite
          return (
            activeWorkShiftPeriods.findIndex(
              workShiftPeriod =>
                get(workShiftPeriod, 'profile.id') === profile.id,
            ) !== -1
          )
        })
        if (foundSiteIndex !== -1) {
          state.sites[foundSiteIndex].activeWorkShiftPeriods = state.sites[
            foundSiteIndex
          ].activeWorkShiftPeriods.filter(
            workShiftPeriod =>
              get(workShiftPeriod, 'profile.id') !== profile.id,
          )
        }

        const oldResponderUsingContactResourceIndex = state.sites.findIndex(
          existingSite => {
            const { activeWorkShiftPeriods } = existingSite
            return (
              activeWorkShiftPeriods.findIndex(
                workShiftPeriod =>
                  get(workShiftPeriod, 'contactResource.id') ===
                    get(contactResource, 'id') &&
                  get(workShiftPeriod, 'profile.id') !== profile.id,
              ) !== -1
            )
          },
        )

        if (
          oldResponderUsingContactResourceIndex !== -1 &&
          get(contactResource, 'id', null) !== null
        ) {
          state.sites[
            oldResponderUsingContactResourceIndex
          ].activeWorkShiftPeriods = state.sites[
            oldResponderUsingContactResourceIndex
          ].activeWorkShiftPeriods.filter(
            workShiftPeriod =>
              get(workShiftPeriod, 'contactResource.id') !==
                get(contactResource, 'id') ||
              get(workShiftPeriod, 'profile.id') === profile.id,
          )
        }

        // add or update responder data
        const siteIndex = state.sites.findIndex(
          existingSite => existingSite.slug === site.slug,
        )
        if (siteIndex === -1) {
          return
        }

        const profileIndex = state.sites[
          siteIndex
        ].activeWorkShiftPeriods.findIndex(
          workShiftPeriod => get(workShiftPeriod, 'profile.id') === profile.id,
        )
        if (profileIndex !== -1) {
          state.sites[siteIndex].activeWorkShiftPeriods[profileIndex] =
            action.payload.workShiftPeriod
        } else {
          state.sites[siteIndex].activeWorkShiftPeriods.push(
            action.payload.workShiftPeriod,
          )
        }

        // filter out all ended workshift
        if (!action.payload.signIn) {
          state.sites[siteIndex].activeWorkShiftPeriods = state.sites[
            siteIndex
          ].activeWorkShiftPeriods.filter(
            workShiftPeriod => get(workShiftPeriod, 'endWorkShift') === null,
          )
        }
      }
    },

    fetchStreamsRequested: (state, action) => {
      state.streamsLoading = true
    },
    fetchStreamsSucceeded: (state, action) => {
      state.streams = action.payload.streams
      state.streamsLoading = false
    },
    fetchStreamsFailed: (state, action) => {
      state.error = action.payload.error
      state.streamsLoading = false
    },

    fetchStreamSnapShotRequested: (state, action) => {
      state.streams[
        findIndex(state.streams, { id: action.payload.streamId })
      ].snapshotLoading = true
    },
    fetchStreamSnapShotSucceeded: (state, action) => {
      const { id, snapshot } = action.payload.stream
      const streamIndex = findIndex(state.streams, { id })
      if (streamIndex !== -1 && state.streams[streamIndex]) {
        state.streams[streamIndex].snapshot = snapshot
        state.streams[streamIndex].snapshotLoading = false
      }
    },
    fetchStreamSnapShotFailed: (state, action) => {
      state.error = action.payload.error
    },

    fetchVideoWallRequested: (state, action) => {
      state.videoWallLoading = true
    },
    fetchVideoWallSucceeded: (state, action) => {
      state.videoWall = action.payload.videoWall
      state.videoWallLoading = false
    },
    fetchVideoWallFailed: (state, action) => {
      state.error = action.payload.error
      state.videoWallLoading = false
    },

    updateVideoWallRequested: (state, action) => {
      state.editLoading = true
    },
    updateVideoWallSucceeded: (state, action) => {
      state.videoWall = action.payload.videoWall
      state.editLoading = false
    },
    updateVideoWallFailed: (state, action) => {
      state.error = action.payload.error
      state.editLoading = false
    },

    updateStreamFeedRequested: (state, action) => {
      state.streamFeedLoading = true
    },
    updateStreamFeedSucceeded: (state, action) => {
      const feedIndex = findIndex(state.videoWall.streamFeeds, {
        orderIndex: action.payload.streamFeed.orderIndex,
      })
      state.videoWall.streamFeeds[feedIndex] = action.payload.streamFeed
      state.streamFeedLoading = false
    },
    updateStreamFeedFailed: (state, action) => {
      state.error = action.payload.error
      state.streamFeedLoading = false
    },

    fetchUsersRequested: (state, action) => {
      state.usersLoading = true
    },
    fetchUsersSucceeded: (state, action) => {
      state.users = action.payload.users
      state.usersLoading = false
    },
    fetchUsersFailed: (state, action) => {
      state.error = action.payload.error
      state.usersLoading = false
    },

    toggleTopBarPanel: (state, action) => {
      state.topBarPanelOpened = !state.topBarPanelOpened
    },
    toggleStreamCell: (state, action) => {
      const { stream, orderIndex } = action.payload
      if (isEmpty(stream)) {
        remove(state.videoWall.streamFeeds, { orderIndex })
      } else {
        const streamFeedsItemIndex = findIndex(state.videoWall.streamFeeds, {
          orderIndex,
        })
        if (streamFeedsItemIndex !== -1) {
          state.videoWall.streamFeeds[streamFeedsItemIndex].streamId = stream.id
        } else {
          state.videoWall.streamFeeds.push({ orderIndex, streamId: stream.id })
        }
      }
    },
    selectVideoWallTemplate: (state, action) => {
      state.videoWall.template = action.payload.template
    },
    addAlert: (state, action) => {
      // state.alerts.push(action.payload.alert)
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        alert => alert.id !== action.payload.alertEventId,
      )
    },
    setActiveAlert: (state, action) => {
      if (action.payload.alert) {
        const selected = state.alerts.find(
          alert => alert.id === action.payload.alert.id,
        )
        selected.seen = true
      }
      state.activeAlert = action.payload.alert
    },
    clearAlerts: (state, action) => {
      state.alerts = []
    },
    updateUnSelectedSites: (state, action) => {
      state.unSelectedSites = action.payload.sites
    },
  },
})

export const {
  fetchSitesRequested,
  fetchSitesSucceeded,
  fetchSitesFailed,
  fetchStreamsRequested,
  fetchStreamsSucceeded,
  fetchStreamsFailed,
  fetchStreamSnapShotRequested,
  fetchStreamSnapShotSucceeded,
  fetchStreamSnapShotFailed,
  fetchVideoWallRequested,
  fetchVideoWallSucceeded,
  fetchVideoWallFailed,
  updateVideoWallRequested,
  updateVideoWallSucceeded,
  updateVideoWallFailed,
  updateStreamFeedRequested,
  updateStreamFeedSucceeded,
  updateStreamFeedFailed,
  fetchUsersRequested,
  fetchUsersSucceeded,
  fetchUsersFailed,
  toggleTopBarPanel,
  toggleStreamCell,
  selectVideoWallTemplate,
  addAlert,
  removeAlert,
  setActiveAlert,
  clearAlerts,
  updateUnSelectedSites,
  updateSiteCheckedinProfiles,
} = archivesSlice.actions

export default archivesSlice.reducer

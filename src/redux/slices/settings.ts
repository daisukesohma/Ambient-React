/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import { isBrowser } from 'react-device-detect'
import {
  LayoutEnum,
  StreamTypeEnum,
  StreamTypeUpdatedEnum,
  TimeFormatEnum,
} from 'enums'

export interface SettingsSliceProps {
  settings: {
    darkMode: boolean
    introOpened: boolean
  }
}

const slice = createSlice({
  name: 'settings',
  initialState: {
    darkMode: true,
    introOpened: false,
    latestSecurityProfileName: null,
    newsFeedPositionLeft: true,
    newsFeedTabIndex: 0,
    sideBarOpened: isBrowser,
    streamType: StreamTypeEnum.NORMAL,
    streamV2Type: StreamTypeUpdatedEnum.NORMAL,
    timeFormat: TimeFormatEnum.TWENTYFOUR,
    toolbarOpened: true,
    speechIsMuted: false,
    speechPitch: 1,
    speechRate: 1,
    activityLogLayout: LayoutEnum.LIST,
    selectedSite: null,
    previousSelectedSite: null, // if the user chooses `All Sites`, then we need to use previously selected site
    redirectUrl: null,
  },
  reducers: {
    showSPEStreams: (state, action) => {
      state.streamType = StreamTypeEnum.SPE
      state.streamV2Type = StreamTypeUpdatedEnum.SPE
    },
    showNormalStreams: (state, action) => {
      state.streamType = StreamTypeEnum.NORMAL
      state.streamV2Type = StreamTypeUpdatedEnum.NORMAL
    },
    selectSite: (state, action) => {
      state.previousSelectedSite = state.selectedSite
      state.selectedSite = action.payload.selectedSite
    },
    setSiteBarStatus: (state, action) => {
      state.sideBarOpened = action.payload.isOpened
    },
    redirectUrl: (state, action) => {
      state.redirectUrl = action.payload
    },
    setIntroSteps: (state, action) => {
      state.introOpened = action.payload.isShown
    },
    toggleNewsFeedPosition: (state, action) => {
      state.newsFeedPositionLeft = !state.newsFeedPositionLeft
    },
    setNewsFeedTabIndex: (state, action) => {
      state.newsFeedTabIndex = action.payload.index
    },
    setSecurityProfileName: (state, action) => {
      state.latestSecurityProfileName = action.payload.name
    },
    toggleToolbarOpenStatus: (state, action) => {
      state.toolbarOpened = !state.toolbarOpened
    },
    toggleDarkMode: (state, action) => {
      state.darkMode = !state.darkMode
    },
    toggleIsSpeechMuted: (state, action) => {
      state.speechIsMuted = !state.speechIsMuted
    },
    setActivityLogViewMode: (state, action) => {
      state.activityLogLayout = action.payload.viewMode
    },
  },
})

export const {
  showSPEStreams,
  showNormalStreams,
  setSiteBarStatus,
  redirectUrl,
  setIntroSteps,
  toggleNewsFeedPosition,
  setNewsFeedTabIndex,
  setSecurityProfileName,
  toggleToolbarOpenStatus,
  toggleDarkMode,
  toggleIsSpeechMuted,
  setActivityLogViewMode,
  selectSite,
} = slice.actions

export default slice.reducer

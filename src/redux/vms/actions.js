import {
  SET_TIMELINE_SETTING_POSITION,
  SET_HOVER_ON_VIDEO,
  SET_HOVER_OFF_VIDEO,
  TOGGLE_DARK_MODE,
  TOGGLE_FULLSCREEN_MODE,
  TOGGLE_SHOW_ALERTS,
} from './actionTypes'

// sets hoverstate on stream id
export const setHoverOnVideo = data => {
  return {
    type: SET_HOVER_ON_VIDEO,
    data,
  }
}

// sets hoverstate on stream id
export const setHoverOffVideo = data => {
  return {
    type: SET_HOVER_OFF_VIDEO,
    data,
  }
}

export const setTimelineSettingPosition = data => {
  return {
    type: SET_TIMELINE_SETTING_POSITION,
    data,
  }
}

export const toggleDarkMode = data => {
  return {
    type: TOGGLE_DARK_MODE,
    data,
  }
}

export const toggleFullscreenMode = data => {
  return {
    type: TOGGLE_FULLSCREEN_MODE,
    data,
  }
}

export const toggleShowAlerts = () => {
  return {
    type: TOGGLE_SHOW_ALERTS,
  }
}

export default {
  setHoverOnVideo,
  setHoverOffVideo,
  setTimelineSettingPosition,
  toggleDarkMode,
  toggleFullscreenMode,
  toggleShowAlerts,
}

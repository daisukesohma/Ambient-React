import {
  SET_HOVER_ON_VIDEO,
  SET_HOVER_OFF_VIDEO,
  SET_TIMELINE_SETTING_POSITION,
  TOGGLE_DARK_MODE,
  TOGGLE_FULLSCREEN_MODE,
  TOGGLE_SHOW_ALERTS,
} from './actionTypes'

const initState = {
  darkMode: false,
  isAlertsVisible: true,
  isFullscreenMode: false,
  is24HourTime: false,
  timeline: {
    settings: {
      position: 'below', // Possible values: 'overlay', 'below',
      isAlwaysVisible: false, // if false, timeline appears on hover of video
      isTimeMarkersAlwaysVisible: false, // if false, appears on hover of draggable timeline area
    },
    shared: {
      //   // Timeline - not implemented for now
      //   startTimelineTS:
      //   endTimelineTS:
      //   // Playhead
      //   playheadTS: 1579075200
      //   playPointerPosition:
      //   //ViewWindow
      //   viewWindowPosition: -55115
      //   viewWindowStartTS: 1579129344
      //   viewWindowEndTS:
      //   // overall
      //   timelineWidth: 55431
      //   maxSeekBar: 86400
      //   xAxisIncrements:
    },
    custom: {},
  },
}

const vmsReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_HOVER_ON_VIDEO:
      return {
        ...state,
        timeline: {
          ...state.timeline,
          custom: {
            ...state.timeline.custom,
            [action.data.id]: {
              ...state.timeline.custom[action.data.id],
              isHoveringOnVideo: true,
            },
          },
        },
      }
    case SET_HOVER_OFF_VIDEO:
      return {
        ...state,
        timeline: {
          ...state.timeline,
          custom: {
            ...state.timeline.custom,
            [action.data.id]: {
              ...state.timeline.custom[action.data.id],
              isHoveringOnVideo: false,
            },
          },
        },
      }

    case SET_TIMELINE_SETTING_POSITION:
      return {
        ...state,
        timeline: {
          ...state.timeline,
          settings: {
            ...state.timeline.settings,
            position: action.data,
          },
        },
      }
    case TOGGLE_DARK_MODE:
      // if action.data exists, set value, else toggle
      if (typeof action.data === 'boolean') {
        return {
          ...state,
          darkMode: action.data,
        }
      }

      return {
        ...state,
        darkMode: !state.darkMode,
      }

    case TOGGLE_FULLSCREEN_MODE:
      // if action.data exists, set value, else toggle
      if (typeof action.data === 'boolean') {
        return {
          ...state,
          isFullscreenMode: action.data,
        }
      }

      return {
        ...state,
        isFullscreenMode: !state.isFullscreenMode,
      }

    case TOGGLE_SHOW_ALERTS: {
      return {
        ...state,
        isAlertsVisible: !state.isAlertsVisible,
      }
    }
    default:
      return state
  }
}

export default vmsReducer

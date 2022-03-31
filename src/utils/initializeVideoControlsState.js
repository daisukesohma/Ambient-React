import moment from 'moment'
import {
  SECONDS_IN_DAY,
  SECONDS_IN_MINUTE,
  MINUTES_IN_DAY,
  MINUTES_IN_HOUR,
  PLAYPOINTER_POSITION_OFFSET,
} from 'components/VideoStreamControls/constants'

// import times from 'lodash/times'

import getCurrUnixTimestamp from './dateTime/getCurrUnixTimestamp'
import tsAtMidnight from './dateTime/tsAtMidnight'
import daysFromNow from './dateTime/daysFromNow'
import { DEFAULT_TIMEZONE } from './dateTime/formatTimeWithTZ'
// import { DEFAULT_SLIDER_VALUE } from '../components/VideoStreamV4/components/VideoStreamControlsV2/constants'

export const presetVideoControlsState = ({
  initTs,
  initZoomIn,
  tsTimelineHighlight,
  timezone,
}) => {
  let startTimelineTS
  let endTimelineTS
  let videoStreamTS
  let subtractDays = 0
  let timelineWidth =
    subtractDays > 0
      ? SECONDS_IN_DAY
      : videoStreamTS - tsAtMidnight(0, timezone)

  if (initTs) {
    videoStreamTS = initTs
    subtractDays = daysFromNow(initTs)
    startTimelineTS = tsAtMidnight(subtractDays * -1, timezone)
    timelineWidth =
      getCurrUnixTimestamp() - tsAtMidnight(subtractDays * -1, timezone)
  } else {
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startTimelineTS = Math.round(startDate.getTime() / 1000)
    const curr = getCurrUnixTimestamp()
    timelineWidth = getCurrUnixTimestamp() - tsAtMidnight(0, timezone)
    endTimelineTS = curr
    videoStreamTS = curr
  }

  let playPointerPosition =
    videoStreamTS - tsAtMidnight(subtractDays * -1, timezone)
  let viewWindowPosition =
    (videoStreamTS - tsAtMidnight(subtractDays * -1, timezone)) * -1 +
    PLAYPOINTER_POSITION_OFFSET

  let xAxisIncrements = MINUTES_IN_HOUR
  let maxSeekBar = SECONDS_IN_DAY

  if (initZoomIn) {
    startTimelineTS /= MINUTES_IN_HOUR
    endTimelineTS /= MINUTES_IN_HOUR
    timelineWidth /= MINUTES_IN_HOUR
    playPointerPosition /= MINUTES_IN_HOUR
    viewWindowPosition =
      ((videoStreamTS - tsAtMidnight(subtractDays * -1, timezone)) * -1 +
        PLAYPOINTER_POSITION_OFFSET) /
      MINUTES_IN_HOUR
    xAxisIncrements = SECONDS_IN_MINUTE * 5 // every 5 mins
    maxSeekBar = MINUTES_IN_DAY
  }
  return {
    startTimelineTS,
    endTimelineTS,
    videoStreamTS,
    timelineWidth,
    playPointerPosition,
    viewWindowPosition,
    xAxisIncrements,
    maxSeekBar,
    subtractDays,
    tsTimelineHighlight,
    timezone,
  }
}

// NOTE: For tests
// const resultMock = {
//   stream: {
//     id: 3929,
//     name: '10.1.13.135',
//     node: {
//       identifier: 'host8',
//       site: {
//         name: 'host8',
//         slug: 'host8',
//         __typename: 'SiteNode'
//       },
//       __typename: 'NodeType'
//     },
//     region: {
//       id: 21,
//       name: 'Secure Building Primary Entrance',
//       __typename: 'RegionType'
//     },
//     __typename: 'StreamType'
//   },
//   ts: '1601423200950',
//   snapshotUrl: null,
//   __typename: 'ElasticsearchMetadataV2Type'
// }

const initializeVideoControlsState = ({
  initTs,
  initZoomIn,
  tsTimelineHighlight,
  timezone = DEFAULT_TIMEZONE,
}) => ({
  snapshotUrl: null,
  snapshotLoading: false,
  initTs,
  metadata: [],
  catalogueLoading: true,
  activeVideoTSInterval: true,
  availableDays: [],
  catalogue: [],
  entitySelections: [],
  retention: {},
  originalEntities: [],
  // results: times(20, () => resultMock), // NOTE: For tests
  results: [],
  searchPages: 1,
  searchCurrentPage: null,
  searchTotalCount: 0,

  // VMS v4
  key: '0',
  speed: 1,
  times: [],
  playTime: !initTs ? new Date() : new Date(2020, 7, 25, 13, 20, 0),
  timeDomainSliderValue: 6,
  timelineDuration: moment.duration(30, 'minutes'),
  startAt: initTs * 1000 || new Date(),

  videoStreamKey: null,
  isZoomIn: 1,
  showDispatchMenu: false,
  creatingDispatchRequest: false,
  dispatchAlertManualTimeMode: false,
  dispatchAlertTS: moment().unix(),
  isDatePickerVisible: false,
  selectedEntities: [],
  hoverIndicatorX: 0,
  currentCataloguePlaying: 0,
  clipLeftPosition: 0,
  clipRightPosition: 0,
  clipWidth: 0,
  initClipControlsPosition: 0,
  isFollowing: false,
  message: '',
  displayMessage: false,
  dragging: false,
  exportMode: false,
  ready: false,
  ...presetVideoControlsState({
    initTs,
    initZoomIn,
    tsTimelineHighlight,
    timezone,
  }),
})

export default initializeVideoControlsState

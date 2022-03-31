/* eslint-disable no-restricted-globals */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { connect } from 'react-redux'
import Select from 'react-select'
import chroma from 'chroma-js'
import Tippy from '@tippyjs/react'
import get from 'lodash/get'
import '../../../../Tooltip/tippy-ambient-naked-theme.css'
import '../../../../Tooltip/tippy-ambient-dark-theme.css'
import '../../../../Tooltip/tippy-ambient-yellow-theme.css'
import '../../../../Tooltip/tippy-ambient-white-theme.css'
import '../../../../Tooltip/tippy-ambient-theme.css'

import {
  VmsPropType,
  VmsPropTypeDefault,
} from '../../../../../common/data/proptypes'
import { PlaybackStatusEnum } from '../../../../../enums'
import {
  getCurrUnixTimestamp,
  getZoomTS,
  getInverseZoomTS,
  tsAtMidnight,
  secSinceMidnight,
} from '../../../utils'
import { SEC_IN_DAY } from '../../../utils/constants'

import AlertContent from './AlertContent'
import AlertMarkerContainer from './AlertMarkerContainer'
import ArchivePopupContent from './ArchivePopupContent'
import ClipControl from './ClipControl'
import CustomAlertPopupContent from './CustomAlertPopupContent'
import DragSpeedContent from './DragSpeedContent'
import KeypressContainer from './KeypressContainer'
import MainTimeline from './MainTimeline'
import MarkersContainer from './MarkersContainer'
import MotionContent from './MotionContent'
import SeekToTimeContent from './SeekToTimeContent'
import TimeContent from './TimeContent'
import { PLAYHEAD_POSITION, PLAYHEAD_RANGE_THRESHOLD } from './constants'

import 'rc-slider/assets/index.css'
import './index.css'

// Tooltip positioning
const SEEK_CONTENT_WIDTH = 250
const SEEK_CONTENT_X_OFFSET = 20 + SEEK_CONTENT_WIDTH / 2 // center the content

const entityColorStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { isDisabled }) => {
    return {
      ...styles,
      cursor: isDisabled ? 'not-allowed' : 'default',
    }
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color)
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    }
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
}

class TimelineContainer extends Component {
  constructor(props) {
    super(props)
    const { videoStreamTS, zoomLevel } = this.props
    this.state = {
      clipLeftPosition: 0,
      clipRightPosition: 0,
      clipWidth: 0,
      currentCatalogPlaying: null, // set to null if playbackStatus is LIVE
      draggableSpeed: 'NORMAL', // make enum? figure out best way to capture this
      endTimelineTS: getZoomTS(this.props.endTimelineTS, zoomLevel),
      entity_options_select_format: [],
      customAlert: null, // AlertEventType or Null
      customAlertPositionX: 0, // alert position
      customHoverAlert: null, // we can have 2 alert contents at once -> hover and click-lock
      customHoverAlertPositionX: 0,
      hoverIndicatorX: 0,
      hoveringTs: null, // when hovering, what is ts
      initClipControlsPosition: 0,
      isHoveringOnDraggableTimeline: false,
      isHoveringOnMotionMarker: false,
      isHoveringOnTimelineContainer: false,
      isPlayheadInRange: true,
      isViewWindowPastDesirableDayRange: false,
      maxSeekBar: getZoomTS(SEC_IN_DAY),
      mouseIndicatorX: 0,
      mouseIndicatorY: 0,
      playpointerHasData: false,
      playpointerPosition: getZoomTS(this.props.videoStreamTS - tsAtMidnight()), // haven't tested this but it's initial state
      seekInput: '00:00:00',
      showInputSearch: false,
      startTimelineTS: getZoomTS(this.props.startTimelineTS, zoomLevel),
      timelineWidth: getZoomTS(secSinceMidnight(videoStreamTS), zoomLevel),
      viewWindowPosition: 0,
    }

    this.offset = null
    this.selectedElement = null
    this.streamClockInterval = null
    this.svgContainer = React.createRef()
    this.thumbnail = React.createRef()
    this.timelineContainer = React.createRef()
  }

  componentDidMount() {
    this.handleInitialState()
  }

  componentWillUnmount() {
    this.stopPlayerClock()
  }

  handleInitialState = () => {
    this.svgPt = this.svgContainer.current.createSVGPoint()
    const newState = this.applyZoomToObject({
      viewWindowPosition: this.getWindowPositionWithFixedPlayhead(),
    })

    this.setState(newState, this.restartClock)
  }

  // sets up 1second interval function to increment clock and handle updates
  restartClock = () => {
    this.stopPlayerClock()
    this.startPlayerClock()
  }

  // Depending on playheadFixedPosition, this sets offset of the maintimeline and other components
  // playheadFixedPosition is ['left', 'center', 'right', 0 <= x <= 1]
  getMainTimelineContainerOffsetX = playheadFixedPosition => {
    const svgWidth = this.getSvgWidth()

    if (playheadFixedPosition === 'center') {
      return PLAYHEAD_POSITION.center * svgWidth
    }
    if (playheadFixedPosition === 'right') {
      return PLAYHEAD_POSITION.right * svgWidth
    }
    if (playheadFixedPosition === 'left') {
      return PLAYHEAD_POSITION.left * svgWidth
    }
    if (playheadFixedPosition >= 0 && playheadFixedPosition <= 1) {
      return playheadFixedPosition * svgWidth
    }
    // default
    return PLAYHEAD_POSITION.right * svgWidth
  }

  // @rodaan's function...
  // solves when you're at midnight and day flips over
  // // If progress container is past 12, jump to location, else set offset to 0
  getProgressContainerOffset = () => {
    const { zoomLevel } = this.props
    const endX = this.getPlayheadPositionInSeconds()

    // @rodaan
    // It seems this checks to see if the time is before 12pm, so that's what I'm naming
    // FUTURE @eric this seems wrong, but removed isZoomIn
    // // Why is this 300 (legacy value)? should be 12 * 60 = 720 if its before 12
    //
    const timeIsBeforeNoon = endX < 300

    if (timeIsBeforeNoon) {
      return getZoomTS(endX, zoomLevel)
    }
    const progressContainerWidth = document.getElementById(
      'vms-timeline-container',
    ).offsetWidth

    return progressContainerWidth / 2
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.setInitTS === true) {
      this.handleSetInitTS()
    } else {
      // If Playback changed from live or recorded
      // Also, if is following changed
      if (
        this.props.playbackStatus !== prevProps.playbackStatus ||
        this.props.isFollowing !== prevProps.isFollowing
      ) {
        this.handlePlaybackChange()
      }

      // if user is exporting/archiving a clip
      if (this.props.isArchiveVisible !== prevProps.isArchiveVisible) {
        this.displayClipControls()
      }

      // if zoomed in level changed
      if (this.props.zoomLevel !== prevProps.zoomLevel) {
        this.handleUpdateOnZoomLevelChange()

        if (!this.props.playbackStatus === PlaybackStatusEnum.LIVE) {
          this.setPlayheadFixedPositionWithDefault('right')
          this.props.setIsFollowing(this.restartPlayerClock)
        } else {
          // RECORDING
          this.setPlayheadFixedPositionWithDefault('center')
          this.props.setIsFollowing(this.restartPlayerClock)
        }
      }

      // if days changed and is not zero (user selected another previous day)
      if (this.props.subtractDays !== prevProps.subtractDays) {
        if (this.props.subtractDays > 0) {
          this.handleUpdateOnDateSelection(
            () => this.props.setPlayheadFixedPosition('left'), // cb
          )
        } else {
          this.handleUpdateOnDateSelection(() =>
            this.props.setPlayheadFixedPosition('right'),
          )
        }
      }

      if (this.props.shouldResetPlayheadInRange) {
        this.resetPlayheadInRange()
        this.props.setShouldResetPlayheadInRange(false) // turn off the flag after resetting
      }

      // always check if playhead in range
      this.checkIsPlayheadInRange()
    }
  }

  // when playhead goes outside the viewable window
  // this will reset the playhead to be visible
  resetPlayheadInRange = () => {
    const playheadX = this.getPlayheadPositionInSeconds()
    let newState = {
      viewWindowPosition: -playheadX,
    }
    newState = this.applyZoomToObject(newState)
    this.setState(newState)
    this.props.setIsFollowing()
  }

  handleSetInitTS = () => {
    this.stopPlayerClock()

    this.props.toggleSetInitTS(() => {
      this.setInitTSByUnixTS(this.props.initTS, null, true)
    })
  }

  handleStepInSecondsForPlayhead = () => {
    let newState = {}
    const playheadX = this.getPlayheadPositionInSeconds()

    newState.playpointerPosition = playheadX
    newState.viewWindowPosition = -playheadX
    newState = this.applyZoomToObject(newState)

    this.setState(newState)
  }

  handleUpdateOnZoomLevelChange = () => {
    const { playbackStatus } = this.props

    if (playbackStatus === PlaybackStatusEnum.LIVE) {
      this.onZoomLevelChange(this._setTimelineWidthToPlayhead)
    } else {
      this.onZoomLevelChange(this._setTimelineWidthToEod)
    }
  }

  handleUpdateOnDateSelection = cb => {
    const { endTimelineTS, startTimelineTS } = this.props
    const endX = this.getPlayheadPositionInSeconds()

    let newState = {
      endTimelineTS,
      maxSeekBar: SEC_IN_DAY,
      playpointerPosition: endX,
      startTimelineTS,
      timelineWidth: SEC_IN_DAY,
      viewWindowPosition: -endX,
    }

    newState = this.applyZoomToObject(newState)

    this.setState(newState, () => {
      this.restartClock()
      if (cb) {
        cb()
      }
    })
  }

  handlePlaybackChange = () => {
    if (this.props.playbackStatus === PlaybackStatusEnum.LIVE) {
      this.onPlaybackChangeToLive()
    } else {
      this.onPlaybackChangeWhileArchive()
    }
  }

  onPlaybackChangeWhileArchive = () => {
    const { subtractDays } = this.props

    const endX = this.getPlayheadPositionInSeconds()
    let newState = {
      playpointerPosition: endX,
    }
    // ie, if day is previous day, the timeline width will be the full day
    // if day is current day, the timeline width will be whatever time the day is in seconds
    // since midnight
    if (subtractDays > 0) {
      newState.timelineWidth = SEC_IN_DAY
    }

    newState = this.applyZoomToObject(newState)
    this.setState(newState)
  }

  onPlaybackChangeToLive = () => {
    const { endTimelineTS } = this.props
    const playheadX = secSinceMidnight(endTimelineTS)
    let newState = {
      playpointerPosition: playheadX,
      viewWindowPosition: this.getWindowPositionWithFixedPlayhead(),
      timelineWidth: playheadX,
    }

    newState = this.applyZoomToObject(newState)
    this.setState(newState, this.restartClock)
  }

  // determines whether playhead position is in visible range of window or not
  // sets state of isPlayheadInRange
  checkIsPlayheadInRange = () => {
    const { isPlayheadInRange } = this.state

    const stats = this.calculatePlayheadStats()
    if (stats.playhead.isInWindowRange && !isPlayheadInRange) {
      this.props.setIsPlayheadInRange(true) // send to parent component
      this.setState({ isPlayheadInRange: true })
    } else if (!stats.playhead.isInWindowRange && isPlayheadInRange) {
      this.props.setIsPlayheadInRange(false) // send to parent component
      this.setState({ isPlayheadInRange: false })
    }
  }

  getWindowPositionWithFixedPlayhead = () => {
    const windowOffset = this.getMainTimelineContainerOffsetX(
      this.props.playheadFixedPosition,
    )

    return this.getPlayheadPositionInSeconds() * -1 + windowOffset
  }

  setViewWindowPositionAroundPlayhead = () => {
    // keeps the VWP in sync with playpointer Position
    // this will set the position to the current playpointer position, then the maintimeline will add the offset
    this.setState({ viewWindowPosition: -this.state.playpointerPosition })
  }

  // takes every key in an object and applys the zoom level function to it, returning it
  applyZoomToObject = obj => {
    const { zoomLevel } = this.props
    const keys = Object.keys(obj)
    const result = {}
    keys.forEach(k => {
      result[k] = getZoomTS(obj[k], zoomLevel)
    })

    return result
  }

  getPlayheadPositionInSeconds = () => {
    const { videoStreamTS, subtractDays } = this.props
    return secSinceMidnight(videoStreamTS, subtractDays)
  }

  // use the selected videostream timestamp as the reference point
  // for the viewWindow position and the playpointer position when applying zoom
  onZoomLevelChange = cb => {
    const { endTimelineTS, startTimelineTS } = this.props
    const playheadX = this.getPlayheadPositionInSeconds()

    let newState = {
      endTimelineTS,
      maxSeekBar: SEC_IN_DAY,
      playpointerPosition: playheadX,
      startTimelineTS,
      viewWindowPosition: -playheadX,
    }
    newState = this.applyZoomToObject(newState)
    this.setState(newState, () => {
      if (cb) {
        cb()
      }
    })
  }

  // When live, playpointer position is current day time in seconds since midnight
  _setTimelineWidthToPlayhead = () => {
    const newState = this.applyZoomToObject({
      timelineWidth: this.getPlayheadPositionInSeconds(),
    })
    this.setState(newState)
  }

  _setTimelineWidthToEod = () => {
    const newState = this.applyZoomToObject({
      timelineWidth: SEC_IN_DAY,
    })
    this.setState(newState)
  }

  /* Clip Controls methods */

  displayClipControls = () => {
    const { viewWindowPosition } = this.state // viewwindowPos already transformed by zoomTS
    const { zoomLevel } = this.props
    const START_X_FROM_VIEW_WINDOW_END_IN_SECONDS = 120
    const INITIAL_CLIP_LENGTH_IN_SECONDS = 60

    // Calculations
    const initLeft = 0
    // beginning of clip control offset from right edge
    const offsetX = getZoomTS(
      START_X_FROM_VIEW_WINDOW_END_IN_SECONDS,
      zoomLevel,
    ) // in seconds
    // width of clip control from the offset beginning
    const widthX = getZoomTS(INITIAL_CLIP_LENGTH_IN_SECONDS, zoomLevel)
    const startX = Math.abs(viewWindowPosition) - offsetX
    const leftTs = getInverseZoomTS(startX, zoomLevel) + tsAtMidnight() // transform X into TS

    // finish
    this.setState(
      {
        clipLeftPosition: initLeft,
        clipRightPosition: initLeft + widthX,
        clipWidth: widthX,
        clipLeftPositionTS: leftTs,
        clipRightPositionTS: leftTs + INITIAL_CLIP_LENGTH_IN_SECONDS,
        initClipControlsPosition: startX,
      },
      this.setExportRange,
    )
  }

  // update in parent component (VideoStreamV2, where API eventually is called)
  setExportRange = () => {
    this.props.changeExportTSRange(
      this.state.clipLeftPositionTS,
      this.state.clipRightPositionTS,
    )
  }

  startDrag = evt => {
    this.selectedElement = evt.target
    this.offset = this.getMousePosition(evt)
    this.offset.x -= parseFloat(this.state[`${this.selectedElement.id}`])

    // https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
    // FUTURE: @eric keep this. will want to get drag position of the right edge of the bounding rect of the clip control side, not the mouse position
    window.addEventListener('mouseup', this.endDrag)
    window.addEventListener('mousemove', this.drag)
  }

  getMousePosition = evt => {
    const CTM = this.svgContainer.current.getScreenCTM()

    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    }
  }

  drag = evt => {
    if (this.selectedElement) {
      evt.preventDefault()
      const coord = this.getMousePosition(evt)
      const cursorPt = this.getMouseCoordinatesWithinSvg(evt)
      const unixTs = this.getTimestampOfMouse(cursorPt)

      const newState = {}
      let valid = false
      const newPosition = coord.x - this.offset.x
      if (
        this.selectedElement.id === 'clipRightPosition' &&
        newPosition > this.state.clipLeftPosition
      ) {
        newState.clipWidth = newPosition - this.state.clipLeftPosition
        valid = true
      } else if (
        this.selectedElement.id === 'clipLeftPosition' &&
        newPosition < this.state.clipRightPosition
      ) {
        newState.clipWidth = this.state.clipRightPosition - newPosition
        valid = true
      }
      if (valid) {
        newState[this.selectedElement.id] = newPosition
        newState[`${this.selectedElement.id}TS`] = unixTs
        this.setState(newState, () => this.setExportRange())
      }
    }
  }

  endDrag = evt => {
    this.selectedElement = null
    window.removeEventListener('mouseup', this.endDrag)
    window.removeEventListener('mousemove', this.drag)
    this.setExportRange()
  }

  stopPlayerClock = () => {
    if (this.streamClockInterval) {
      clearInterval(this.streamClockInterval)
      this.streamClockInterval = null
    }
  }

  startPlayerClock = () => {
    this.streamClockInterval = setInterval(() => {
      const { playbackStatus } = this.props
      if (playbackStatus === PlaybackStatusEnum.LIVE) {
        this.handleStartPlayerClockWhenLive()
      } else if (playbackStatus === PlaybackStatusEnum.PLAYING) {
        this.handleStartPlayerClockWhenPlaying()
      }
    }, 1000)
  }

  handleStartPlayerClockWhenLive = () => {
    const { timelineWidth } = this.state

    const { isFollowing, videoStreamTS, zoomLevel } = this.props
    const incrementAmount = getZoomTS(1, zoomLevel)
    const endTimelineWidth = timelineWidth + incrementAmount

    const newClockState = {
      timelineWidth: endTimelineWidth,
      playpointerPosition: endTimelineWidth,
      currentCatalogPlaying: null,
    }

    // TODO: if follow mode is on, can set view window to current, set follow when initially
    // switching to LIVE,  set to unfollow when user moves around
    if (isFollowing) {
      newClockState.viewWindowPosition = getZoomTS(
        -secSinceMidnight(videoStreamTS),
        zoomLevel,
      )
    }

    this.setState(newClockState)
  }

  // This is where the magic happens
  // When isFollowing, this locks the ViewWindowPosition to Playhead
  //
  handleStartPlayerClockWhenPlaying = () => {
    const { currentCatalogPlaying, playpointerPosition } = this.state

    const {
      catalogue,
      dataFromTS,
      isFollowing,
      onTimelineSelection,
      stopVideoElem,
      subtractDays,
      videoStreamTS,
      zoomLevel,
    } = this.props
    const newClockState = {}

    // check if ts has data, if not, move to next catalogue slot
    const nextData = dataFromTS(catalogue, videoStreamTS)
    if (
      currentCatalogPlaying &&
      !nextData.el &&
      !this.withinNonMotionRetentionDuration(videoStreamTS)
    ) {
      // search for next data point
      const nextIndex = currentCatalogPlaying.index + 1
      const nextCatalogueObj = catalogue[nextIndex]
      if (nextCatalogueObj) {
        newClockState.currentCatalogPlaying = {
          el: nextCatalogueObj,
          index: nextIndex,
        }
        const startUnixTs = nextCatalogueObj.start_ts / 1000
        const playheadX = startUnixTs - tsAtMidnight(subtractDays)
        newClockState.playpointerPosition = playheadX

        if (isFollowing) {
          // if following, sync VWP with playhead
          newClockState.viewWindowPosition = -playheadX
        }

        // move stream to next ts slot
        onTimelineSelection(startUnixTs)
      } else {
        stopVideoElem()
      }
    } else {
      const incrementAmount = getZoomTS(1, zoomLevel)

      // this creates the "lock" functionality, keeping the playhead in sync with viewWindow position
      const playheadX = playpointerPosition + incrementAmount
      newClockState.playpointerPosition = playheadX
      if (isFollowing) {
        newClockState.viewWindowPosition = -playheadX
      }
    }

    this.setState(newClockState)
  }

  convertPositionToTS = position => {
    return position + tsAtMidnight(this.props.subtractDays)
  }

  tsToSliderPosition = ts => {
    // 100% = SEC_IN_DAY
    const diff = ts - tsAtMidnight(this.props.subtractDays)
    return (diff / SEC_IN_DAY) * 100
  }

  // Fetches and Renders Alert Markers
  renderAlertMarkers = () => {
    const { isAlertsVisible, subtractDays, zoomLevel } = this.props
    const { customAlert } = this.state
    const markers = []

    if (isAlertsVisible) {
      const alertMarkers = (
        <AlertMarkerContainer
          accountSlug={this.props.accountSlug}
          siteSlugs={[this.props.siteSlug]}
          streamIds={[this.props.streamId]}
          startTs={getInverseZoomTS(this.state.startTimelineTS, zoomLevel)}
          endTs={getInverseZoomTS(this.state.endTimelineTS, zoomLevel)}
          subtractDays={subtractDays}
          handleToggleAlert={this.handleToggleAlert}
          handleToggleHoverAlert={this.handleToggleHoverAlert}
          customAlert={customAlert}
          zoomLevel={zoomLevel}
        />
      )
      markers.push(alertMarkers)
    }
    return markers
  }

  onMouseDown = e => {
    // e.preventDefault();
    // this.props.setStopFollowing() // NOTE: Cancel NO longer following
    window.addEventListener('mouseup', this.onMouseUp)
  }

  withinNonMotionRetentionDuration = unixTs => {
    const nonmotionSegmentRetentionDays =
      this.props.retention.nonmotion_segment_retention_days || 0
    const nonmotionSegmentRetentionDuration =
      nonmotionSegmentRetentionDays * SEC_IN_DAY
    return nonmotionSegmentRetentionDays > 0
      ? getCurrUnixTimestamp() - nonmotionSegmentRetentionDuration <= unixTs
      : false
  }

  onMouseUp = evt => {
    window.removeEventListener('mouseup', this.onMouseUp)
    if (this.props.catalogue) {
      const cursorPt = this.getMouseCoordinatesWithinSvg(evt)
      const unixTs = this.getTimestampOfMouse(cursorPt)
      const currentCatalogue = this.props.dataFromTS(
        this.props.catalogue,
        unixTs,
      )

      if (
        currentCatalogue.el ||
        this.withinNonMotionRetentionDuration(unixTs)
      ) {
        // make function that describes
        const svgContainerBoundingBox = this.svgContainer.current.getBoundingClientRect()
        let playpointerPosition
        // const svgWidth = this.getSvgWidth()

        const windowOffset = this.getMainTimelineContainerOffsetX(
          this.props.playheadFixedPosition,
        )
        if (this.props.isZoomIn) {
          playpointerPosition =
            evt.clientX -
            svgContainerBoundingBox.left +
            Math.abs(this.state.viewWindowPosition) -
            windowOffset // NOTE: ADDED and works now when clicking to get playhead at right position
        } else {
          playpointerPosition =
            evt.clientX -
            svgContainerBoundingBox.left +
            Math.abs(this.state.viewWindowPosition)
        }
        this.setState(
          {
            playpointerPosition,
            currentCatalogPlaying: currentCatalogue,
          },
          () => {
            this.props.onTimelineSelection(unixTs)
            this.restartClock()
          },
        )
      } else {
        this.props.sendTooltipMessage('No Recorded Data')
      }
    } else {
      this.props.sendTooltipMessage('No Recorded Data')
    }
  }

  onMouseLeave = () => {
    this.setState({
      isHoveringOnTimeline: false,
    })
  }

  // used to get the timestamp of a click or hover event
  getTimestampOfMouse = cursorPt => {
    const { subtractDays, zoomLevel } = this.props

    // setup
    const windowOffset = this.getMainTimelineContainerOffsetX(
      this.props.playheadFixedPosition,
    )
    const viewWindowPosition = Math.abs(this.state.viewWindowPosition)
    const cursorPtX = cursorPt.x

    // calculate with zoom proportion
    const startOfDayUnixTs = tsAtMidnight(subtractDays)
    const timeX = viewWindowPosition - windowOffset + cursorPtX
    const timeUnixTs = getInverseZoomTS(timeX, zoomLevel)

    // combine and return
    return startOfDayUnixTs + timeUnixTs
  }

  getMouseCoordinatesWithinSvg = evt => {
    this.svgPt.x = evt.clientX
    this.svgPt.y = evt.clientY
    return this.svgPt.matrixTransform(
      this.svgContainer.current.getScreenCTM().inverse(),
    )
  }

  isHoveringInsideCatalog = hoverTs => {
    const { catalogue } = this.props
    if (catalogue) {
      const hoverMs = hoverTs * 1000
      const catalogContainsHover = catalogue.filter(c => {
        return c.start_ts < hoverMs && hoverMs < c.end_ts
      })
      if (catalogContainsHover.length > 0) {
        this.setState({ isHoveringOnMotionMarker: true })
      } else {
        this.setState({ isHoveringOnMotionMarker: false })
      }
    }
  }

  onDraggableTimelineHover = evt => {
    this.setState({ isHoveringOnDraggableTimeline: true })
  }

  onDraggableTimelineHoverOff = evt => {
    this.setState({ isHoveringOnDraggableTimeline: false })
  }

  onTimelineHover = evt => {
    const cursorPt = this.getMouseCoordinatesWithinSvg(evt)
    const unixTs = this.getTimestampOfMouse(cursorPt)
    const svgContainerBoundingBox = this.svgContainer.current.getBoundingClientRect()
    const mouseIndicatorX = evt.clientX - svgContainerBoundingBox.left
    const mouseIndicatorY = evt.clientY - svgContainerBoundingBox.top
    const hoverIndicatorX = -this.state.viewWindowPosition + mouseIndicatorX

    const newState = {
      isHoveringOnTimeline: true,
      hoveringTs: unixTs,
      mouseIndicatorY,
      mouseIndicatorX,
      hoverIndicatorX,
    }

    if (this.props.catalogue) {
      this.isHoveringInsideCatalog(unixTs)

      newState.hasData =
        this.checkIfUnixTsHasData(unixTs) ||
        this.withinNonMotionRetentionDuration(unixTs)
    }

    this.setState(newState)
  }

  // @param: dragX (number) - how far the user has dragged
  // @param: dragCoeff (number) - a multiplier on how fast the timeline pixel drags based on the pixel dragged difference
  //
  convertDraggableSpeedToPixel = draggableSpeedName => {
    switch (draggableSpeedName) {
      case 'SLOW':
        return 1
      case 'FAST':
        return 60
      default:
        return 15
    }
  }

  onDraggableTimeline = (
    dragX,
    dragSpeed = this.convertDraggableSpeedToPixel(this.state.draggableSpeed),
  ) => {
    const dragSpeedX = getZoomTS(dragSpeed, this.props.zoomLevel)
    const timelineReposition = dragX * dragSpeedX * -1
    this.props.setStopFollowing()
    this.setState({
      viewWindowPosition: this.state.viewWindowPosition + timelineReposition,
      dragging: true,
    })
  }

  // stores calculated playhead fixed position
  //
  setPlayheadFixedPositionWithDefault = defaultPosition => {
    const stats = this.calculatePlayheadStats()
    // @Future - if we need to adhere to the default user defined position ('left/right/center')
    // then we can store another variable - playheadFixedPosition and customPlayheadFixedPosition
    // if (this.state.playheadFixedPosition) {
    //   this.props.setPlayheadFixedPosition(this.state.playheadFixedPosition)
    // }
    if (stats.playhead.isInWindowRange) {
      const positionName = this.getCanonicalPlayheadFixedPositionName(
        stats.playhead.relativeDecimal,
      )
      this.props.setPlayheadFixedPosition(positionName)
    } else {
      this.props.setPlayheadFixedPosition(defaultPosition)
    }
  }

  // transforms 0-1 to position name if it is equal to defined names
  // FUTURE @Eric
  // standardize positions in enum
  // set a threshold range in which it will 'lock' to standard positions (ie. within .05 either way)
  //
  getCanonicalPlayheadFixedPositionName = relativeDecimalPosition => {
    if (
      this.isValueWithinRangeWithThreshold(
        relativeDecimalPosition,
        PLAYHEAD_POSITION.left,
        PLAYHEAD_RANGE_THRESHOLD,
      )
    ) {
      return 'left'
    }
    if (
      this.isValueWithinRangeWithThreshold(
        relativeDecimalPosition,
        PLAYHEAD_POSITION.center,
        PLAYHEAD_RANGE_THRESHOLD,
      )
    ) {
      return 'center'
    }
    if (
      this.isValueWithinRangeWithThreshold(
        relativeDecimalPosition,
        PLAYHEAD_POSITION.right,
        PLAYHEAD_RANGE_THRESHOLD,
      )
    ) {
      return 'right'
    }

    return relativeDecimalPosition
  }

  isValueWithinRangeWithThreshold = (value, centerPoint, threshold) => {}

  calculatePlayheadStats = () => {
    const { playpointerPosition, viewWindowPosition } = this.state
    const playheadFixedOffset = this.getMainTimelineContainerOffsetX(
      this.props.playheadFixedPosition,
    )

    // range to validate is left within left and right
    const svgWidth = this.getSvgWidth()
    const leftWindowX = Math.abs(viewWindowPosition) - playheadFixedOffset
    const rightWindowX = leftWindowX + svgWidth

    const validatePlayheadInRange =
      playpointerPosition >= leftWindowX && playpointerPosition <= rightWindowX

    let playheadFixedPosition
    let relativePlayheadX
    if (validatePlayheadInRange) {
      relativePlayheadX = playpointerPosition - leftWindowX
      playheadFixedPosition = (relativePlayheadX / svgWidth).toFixed(3)
    }

    return {
      window: {
        leftX: leftWindowX,
        rightX: rightWindowX,
        width: svgWidth,
      },
      playhead: {
        x: playpointerPosition,
        relativeX: relativePlayheadX,
        relativeDecimal: playheadFixedPosition,
        isInWindowRange: validatePlayheadInRange,
      },
    }
  }

  checkIfUnixTsHasData = unixTs => {
    return !!this.props.dataFromTS(this.props.catalogue, unixTs).el
  }

  moveViewBoxLeft = () => {
    const { width } = this.svgContainer.current.getBoundingClientRect()
    const moveWidth = width - 60 * 2 // don't move entire width so reference time can still be seen
    this.props.setStopFollowing()
    this.setState({
      viewWindowPosition: this.state.viewWindowPosition + moveWidth,
    })
  }

  moveViewBoxRight = () => {
    const { width } = this.svgContainer.current.getBoundingClientRect()
    const moveWidth = width - 60 * 2 // don't move entire width so reference time can still be seen
    this.props.setStopFollowing()
    this.setState({
      viewWindowPosition: this.state.viewWindowPosition - moveWidth,
    })
  }

  getSvgWidth = () => {
    // eslint-disable-line
    if (this.svgContainer.current) {
      return this.svgContainer.current.getBoundingClientRect().width
    }

    return null
  }

  handleStopDragging = () => {
    this.setState({
      dragging: false,
    })
  }

  onSeekToTimeChange = timeString => {
    this.setState({ seekInput: timeString })
  }

  xCoordinateFromTS = unixTs => {
    // Get startTimelineTS calculate amount of distance from unix midnight time to desired
    const timeSinceMidnight = unixTs - this.props.startTimelineTS
    return timeSinceMidnight
  }

  setInitTSByUnixTS = (unixTs, currentCatalogue, getNearest) => {
    // Need to get where the X will be from a TS
    const playpointerPosition = this.xCoordinateFromTS(unixTs)
    const newState = {
      // THIS SHOULDN"T HAVE ZOOMIN
      playpointerPosition: this.props.isZoomIn
        ? playpointerPosition
        : playpointerPosition / 60,
    }
    if (currentCatalogue) {
      newState.currentCatalogPlaying = currentCatalogue
    } else {
      const newCurrentCatalogue = this.props.dataFromTS(
        this.props.catalogue,
        unixTs,
        getNearest,
      )
      // if(!this.props.isTSWithinRetentionDays(unix_ts) || currentCatalogue.closest && currentCatalogue.el){
      // Set unix_ts to middle of closest block
      // unix_ts = ((currentCatalogue.el.start_ts/1000) + (currentCatalogue.el.end_ts / 1000)) / 2;
      // }
      newState.currentCatalogPlaying = newCurrentCatalogue
    }
    this.setState(newState, () => {
      this.props.onTimelineSelection(unixTs)
      this.setViewWindowPositionAroundPlayhead()
    })
  }

  handleSeekSelection = () => {
    const timeTuple = this.state.seekInput && this.state.seekInput.split(':')
    if (timeTuple && timeTuple.length === 3) {
      const hour = Number(timeTuple[0])
      const min = Number(timeTuple[1])
      const sec = Number(timeTuple[2])
      // Get midnight of today - days to subtract + hour and min to get desired TS
      const currDate = new Date()
      const month = currDate.getMonth()
      const date = currDate.getDate()
      const year = currDate.getFullYear()
      const seekDate = new Date(year, month, date, hour, min, sec, 0)
      const unixTs =
        seekDate.getTime() / 1000 - this.props.subtractDays * 3600 * 24

      if (this.props.catalogue) {
        // Get cursorPt location from time
        const currentCatalogue = this.props.dataFromTS(
          this.props.catalogue,
          unixTs,
        )
        if (
          currentCatalogue.el ||
          this.withinNonMotionRetentionDuration(unixTs)
        ) {
          this.setInitTSByUnixTS(unixTs, currentCatalogue)
        } else {
          this.props.sendTooltipMessage('No Recorded Data at Inputted Time.')
        }
      } else {
        this.props.sendTooltipMessage('No Recorded Data at Inputted Time.')
      }
    } else {
      this.props.sendTooltipMessage('Please enter time in format hh:mm:ss.')
    }
  }

  handleStepVideoAndControlsInSeconds = sec => {
    const { handleStepInSeconds } = this.props
    handleStepInSeconds(sec)
    this.handleStepInSecondsForPlayhead(sec)
  }

  // @param: key <String> name of key from https://www.npmjs.com/package/react-keyboard-event-handler
  // @param: the keypress event from 'react-keyboard-event-handler'
  //
  handleKeyDown = (key, e) => {
    const {
      handleExitFullScreenVideo,
      handleEnterFullScreenVideo,
      handlePlayPauseButton,
      isFullScreenVideo,
    } = this.props

    if (key === 'meta') {
      this.setState({ draggableSpeed: 'FAST' })
    } else if (key === 'alt') {
      this.setState({ draggableSpeed: 'SLOW' })
    } else if (key === 'space' || key === 'k') {
      handlePlayPauseButton()
    } else if (key === 'left') {
      this.handleStepVideoAndControlsInSeconds(-10)
    } else if (key === 'right') {
      this.handleStepVideoAndControlsInSeconds(10)
    } else if (key === 'j') {
      this.handleStepVideoAndControlsInSeconds(-5)
    } else if (key === 'l') {
      this.handleStepVideoAndControlsInSeconds(5)
    } else if (key === 'm') {
      this.handleStepVideoAndControlsInSeconds(-1)
    } else if (key === '/') {
      this.handleStepVideoAndControlsInSeconds(1)
    } else if (key === ',') {
      this.handleStepVideoAndControlsInSeconds(-0.5)
    } else if (key === '.') {
      this.handleStepVideoAndControlsInSeconds(0.5)
    } else if (key === 'f') {
      if (isFullScreenVideo) {
        handleExitFullScreenVideo()
      } else {
        handleEnterFullScreenVideo()
      }
    }
  }

  // reset back to normal
  handleKeyUp = (key, e) => {
    if (key === 'meta') {
      this.setState({ draggableSpeed: 'NORMAL' })
    } else if (key === 'alt') {
      this.setState({ draggableSpeed: 'NORMAL' })
    }
    this.setState({ draggableSpeed: 'NORMAL' })
  }

  getAlertMarkerPositionX = xPos => {
    const { viewWindowPosition } = this.state
    const svgWidth = this.getSvgWidth()
    const CONTENT_WIDTH = 250 // AlertContent component width
    // here xPos is from the alert Marker component -> the offset from the MainTimeLine element(g#timeline-main-container)
    // and then the maintimeline offset can be calculated by viewWindowPosition + windowOffset
    // check MainTimeLine component line#84

    const windowOffset = this.getMainTimelineContainerOffsetX(
      this.props.playheadFixedPosition,
    )

    let customAlertPositionX = xPos + viewWindowPosition + windowOffset

    if (customAlertPositionX < CONTENT_WIDTH / 2) {
      // need to check if the alert content will be shown outside of the video container
      customAlertPositionX = CONTENT_WIDTH / 2
    } else if (customAlertPositionX > svgWidth - CONTENT_WIDTH / 2) {
      customAlertPositionX = svgWidth - CONTENT_WIDTH / 2
    }

    return customAlertPositionX
  }

  handleToggleAlert = (alert, xPos = 0) => {
    const { customAlert } = this.state
    const customAlertPositionX = this.getAlertMarkerPositionX(xPos)

    if (!customAlert || !alert) {
      this.setState({
        customAlert: alert,
        customAlertPositionX,
      })
    } else {
      // custom Alert exists - check if need to toggle
      this.setState({
        customAlert: customAlert.id === alert.id ? null : alert,
        customAlertPositionX,
      })
    }
  }

  handleToggleHoverAlert = (alert, xPos = 0) => {
    const customHoverAlertPositionX = this.getAlertMarkerPositionX(xPos)
    this.setState({
      customHoverAlert: alert,
      customHoverAlertPositionX,
    })
  }

  render() {
    const {
      mouseIndicatorX,
      viewWindowPosition,
      customAlert,
      customAlertPositionX,
      customHoverAlert,
      customHoverAlertPositionX,
    } = this.state
    const {
      darkMode,
      handleViewableStartTS,
      handleViewableEndTS,
      isArchiveVisible,
      isCatalogueMissing,
      isHoveringOnTopControls,
      isSeekTimeVisible,
      showDispatchMenu,
      streamId,
      vms,
      zoomLevel,
    } = this.props
    const alertMarkers = this.renderAlertMarkers()

    // let hasDataDisplay
    // if (this.props.loadingArchivalVideo) {
    //   hasDataDisplay = 'Loading Archival Video...'
    // } else if (this.state.hasData) {
    //   hasDataDisplay = 'Recorded Data'
    // } else {
    //   hasDataDisplay = 'No Recorded Data'
    // }

    const svgWidth = this.getSvgWidth()
    const windowOffset = this.getMainTimelineContainerOffsetX(
      this.props.playheadFixedPosition,
    )
    // calculate start and end TS
    // make viewwindowstart and viewwindowend
    // put in useEffect in functional component
    const viewWindowEndXinTS = getInverseZoomTS(
      Math.abs(viewWindowPosition),
      zoomLevel,
    )
    const viewWindowStartXinTS =
      viewWindowEndXinTS - getInverseZoomTS(Math.floor(svgWidth), zoomLevel)
    handleViewableStartTS(viewWindowStartXinTS)
    handleViewableEndTS(viewWindowEndXinTS)

    const waiting = this.props.loadingArchivalVideo ? 'waiting' : null

    // TODO: need to figure out how to set clipLocation
    const clipControl = isArchiveVisible ? (
      <ClipControl
        clipLeftPositionTS={this.state.clipLeftPositionTS}
        clipRightPositionTS={this.state.clipRightPositionTS}
        initClipControlsPosition={this.state.initClipControlsPosition}
        clipLeftPosition={this.state.clipLeftPosition}
        clipRightPosition={this.state.clipRightPosition}
        clipWidth={this.state.clipWidth}
        startDrag={this.startDrag}
        isZoomOut={!this.props.isZoomIn} // replace with Zoom level
      />
    ) : null

    // Conditionally display tooltip
    let isTooltipVisible
    let tooltipContent
    if (this.state.isHoveringOnTimeline) {
      isTooltipVisible = true
      tooltipContent = <TimeContent ts={this.state.hoveringTs} format='12h' />
    } else if (this.state.dragging) {
      isTooltipVisible = false
    } else if (this.props.displayMessage) {
      isTooltipVisible = true
      tooltipContent = this.props.message
    } else {
      isTooltipVisible = false
    }

    // Entity search selector component
    // NOTE: has Entity Only Feature
    const displayEntitySelector = this.props.displayEntitySelector ? (
      <div className='entity_selector_container'>
        <Select
          options={this.state.entity_options_select_format}
          value={this.props.selectedEntities}
          onChange={this.props.handleEntitySelection}
          isMulti
          styles={entityColorStyles}
          placeholder='Select Entities'
          autoFocus
        />
      </div>
    ) : null

    const markers = (
      <MarkersContainer
        catalog={this.props.catalogue}
        checkIfUnixTsHasData={this.checkIfUnixTsHasData}
        entityMetadata={this.props.metadata}
        isHoveringOnTimeline={this.state.isHoveringOnTimeline}
        retention={this.props.retention}
        selectedEntities={this.props.selectedEntities}
        setDisplayedEntityMarkers={this.props.setDisplayedEntityMarkers}
        subtractDays={this.props.subtractDays}
        viewWindowPosition={this.state.viewWindowPosition}
        withinNonMotionRetentionDuration={this.withinNonMotionRetentionDuration}
        zoomLevel={this.props.zoomLevel}
      />
    )
    // https://github.com/atomiks/tippyjs-react
    // forwardref component children
    const timeline = (
      <MainTimeline
        alertMarkers={alertMarkers}
        clipControl={clipControl}
        darkMode={darkMode}
        handleStopDragging={this.handleStopDragging}
        hoverIndicatorX={this.state.hoverIndicatorX}
        isHoveringOnDraggableTimeline={this.state.isHoveringOnDraggableTimeline}
        isHoveringOnTimeline={this.state.isHoveringOnTimeline}
        isHoveringOnTimelineContainer={this.state.isHoveringOnTimelineContainer}
        isHoveringOnTopControls={isHoveringOnTopControls}
        markers={markers}
        mouseIndicatorX={mouseIndicatorX}
        moveViewBoxLeft={this.moveViewBoxLeft}
        moveViewBoxRight={this.moveViewBoxRight}
        onDraggableTimeline={this.onDraggableTimeline}
        onDraggableTimelineHover={this.onDraggableTimelineHover}
        onDraggableTimelineHoverOff={this.onDraggableTimelineHoverOff}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.onMouseLeave}
        onTimelineHover={this.onTimelineHover}
        playpointerPosition={this.state.playpointerPosition}
        position={vms.timeline.settings.position}
        readableTSPlaying={this.props.readableTSPlaying}
        streamId={streamId}
        svgRef={this.svgContainer}
        svgWidth={svgWidth} // variation of window
        timelineContainer={this.timelineContainer}
        timelineWidth={this.state.timelineWidth}
        videoStreamTS={this.props.videoStreamTS}
        viewWindowPosition={this.state.viewWindowPosition}
        waiting={waiting}
        windowOffset={windowOffset}
        zoomLevel={zoomLevel}
      />
    )

    // puts 'overlay', 'below' and 'fullscreen' classes on container
    const containerClass = clsx(
      vms.timeline.settings.position, // oneOf(['overlay', 'below'])
      { fullscreen: vms.isFullscreenMode },
    )

    const handleHoveringContainer = () =>
      this.setState({ isHoveringOnTimelineContainer: true })
    const handleHoveringOffContainer = () =>
      this.setState({ isHoveringOnTimelineContainer: false })
    const isHoveringOnVideo = get(
      vms,
      `timeline.custom[${streamId}].isHoveringOnVideo`,
    )
    const isControlsVisible =
      isHoveringOnVideo ||
      this.state.isHoveringOnTimelineContainer ||
      isHoveringOnTopControls

    const getGradientBottomClass = () => {
      if (this.props.vms.timeline.settings.position === 'overlay') {
        return clsx('gradient-bottom-dark', { visible: isControlsVisible })
      }
      return clsx('gradient-bottom-none', { visible: isControlsVisible })
    }

    // a little bit of a hack to spread the offset prop when not in fullscreen mode, but not
    // have offset attribute set in fullscreen mode (else it won't show up - just a bit buggy)
    const mainTippyProps = {}
    const motionIndicatorTippyProps = {}
    const alertTippyProps = {}

    if (!vms.isFullscreenMode) {
      const mainOffset = 45
      mainTippyProps.offset = mouseIndicatorX - mainOffset // x-axis
      motionIndicatorTippyProps.offset = mouseIndicatorX - mainOffset + 12 // x-axis

      // note, the hitbox on the alert is a transparent larger diamond
      // However, this obscures the mouseIndicatorX
      alertTippyProps.offset = mouseIndicatorX - 125 // x-axis: offset
    }

    return (
      <div
        id='vms-timeline-container'
        className={containerClass}
        onMouseEnter={handleHoveringContainer}
        onMouseLeave={handleHoveringOffContainer}
      >
        <>
          {customAlert && (
            <AlertContent
              handleToggleAlert={this.handleToggleAlert}
              alert={customAlert}
              positionX={customAlertPositionX}
            />
          )}
          {customHoverAlert && (
            <AlertContent
              alert={customHoverAlert}
              positionX={customHoverAlertPositionX}
            />
          )}
          {displayEntitySelector}
          <KeypressContainer onPress={this.handleKeyDown} />
          <KeypressContainer
            handleEventType='keyup'
            onPress={this.handleKeyUp}
          />
          <Tippy
            theme='ambient'
            animation='scale-subtle'
            content={tooltipContent}
            placement='top-start'
            arrow={false}
            distance={
              vms.isFullscreenMode ? -(window.innerHeight / 2) + 220 : 50
            } // y-axis, positive is above the timeline
            visible={isTooltipVisible}
            duration={[100, 200]}
            interactive
            {...mainTippyProps}
          >
            <Tippy
              theme='ambient-yellow'
              animation='scale-subtle'
              content={<MotionContent />}
              placement='top-start'
              arrow={false}
              distance={80} // y-axis, positive is above the timeline
              visible={isTooltipVisible && this.state.isHoveringOnMotionMarker}
              duration={[100, 200]}
              {...motionIndicatorTippyProps}
            >
              <Tippy
                theme='ambient-naked'
                content={<DragSpeedContent speed={this.state.draggableSpeed} />}
                placement='top'
                arrow={false}
                distance={35} // y-axis
                duration={[250, 200]}
                // visible={this.state.isHoveringOnDraggableTimeline} // only on hover now
              >
                <Tippy
                  theme='ambient-white'
                  animation='scale-subtle'
                  content={
                    <ArchivePopupContent
                      placeholder='Save Clip'
                      exportStartTS={this.props.exportStartTS}
                      exportEndTS={this.props.exportEndTS}
                      handleExport={this.props.handleExport}
                      toggleExportMode={this.props.toggleExportMode}
                    />
                  }
                  interactive
                  placement='top-end'
                  arrow={false}
                  distance={70} // y-axis, positive is above the timeline
                  offset={-10}
                  visible={isArchiveVisible}
                  duration={[100, 200]}
                >
                  <Tippy
                    theme='ambient-white'
                    animation='scale-subtle'
                    content={
                      <CustomAlertPopupContent
                        createDispatchRequest={this.props.createDispatchRequest}
                        creatingDispatchRequest={
                          this.props.creatingDispatchRequest
                        }
                        videoStreamTS={this.props.videoStreamTS}
                        toggleDispatchMenu={this.props.toggleDispatchMenu}
                      />
                    }
                    interactive
                    placement='top-end'
                    arrow={false}
                    distance={-60} // y-axis, positive is above the timeline
                    offset={-10}
                    visible={showDispatchMenu}
                    duration={[100, 200]}
                  >
                    <Tippy
                      theme='ambient-white'
                      animation='scale-subtle'
                      content={
                        <SeekToTimeContent
                          onSeekToTimeChange={this.onSeekToTimeChange}
                          handleSeekSelection={this.handleSeekSelection}
                          toggleVisible={this.props.toggleSeekTime}
                        />
                      }
                      interactive
                      placement='top-start'
                      arrow={false}
                      distance={-60} // y-axis, positive is above the timeline
                      offset={SEEK_CONTENT_X_OFFSET}
                      visible={isSeekTimeVisible}
                      duration={[100, 200]}
                      hideOnClick={false}
                    >
                      <Tippy
                        theme='ambient-yellow'
                        animation='scale-subtle'
                        content={<span>"No Recorded Data"</span>}
                        placement='top'
                        arrow={false}
                        distance={70}
                        visible={isCatalogueMissing}
                        hideOnClick={false}
                      >
                        <span style={{ zIndex: 100 }}>{timeline}</span>
                      </Tippy>
                    </Tippy>
                  </Tippy>
                </Tippy>
              </Tippy>
            </Tippy>
          </Tippy>
        </>
        <div id='gradient-bottom' className={getGradientBottomClass()} />
      </div>
    )
  }
}

TimelineContainer.defaultProps = {
  accountSlug: '',
  catalogue: [],
  changeExportTSRange: () => {},
  createDispatchRequest: () => {},
  creatingDispatchRequest: () => {},
  darkMode: false,
  dataFromTS: () => {},
  displayEntitySelector: false,
  displayMessage: false,
  endTimelineTS: null,
  exportEndTS: null,
  exportStartTS: null,
  handleEnterFullScreenVideo: () => {},
  handleEntitySelection: () => {},
  handleExitFullScreenVideo: () => {},
  handleExport: () => {},
  handlePlayPauseButton: () => {},
  handleStepInSeconds: () => {},
  handleViewableEndTS: () => {},
  handleViewableStartTS: () => {},
  initTS: null,
  isAlertsVisible: true,
  isArchiveVisible: false,
  isFollowing: true,
  isFullScreenVideo: false,
  isHoveringOnTimeline: false,
  isHoveringOnTopControls: false,
  isSeekTimeVisible: false,
  isCatalogueMissing: false,
  isZoomIn: 1,
  loadingArchivalVideo: false,
  message: '',
  metadata: [],
  onTimelineSelection: () => {},
  playheadFixedPosition: 'right',
  playbackStatus: PlaybackStatusEnum.LIVE,
  readableTSPlaying: '',
  retention: {},
  selectedEntities: [],
  sendTooltipMessage: () => {},
  setDisplayedEntityMarkers: () => {},
  setInitTS: false,
  setIsFollowing: () => {},
  setIsPlayheadInRange: () => {},
  setPlayheadFixedPosition: () => {},
  setShouldResetPlayheadInRange: () => {},
  setStopFollowing: () => {},
  shouldResetPlayheadInRange: false,
  showDispatchMenu: false,
  siteSlug: '',
  startTimelineTS: null,
  stopVideoElem: () => {},
  streamId: null,
  subtractDays: 0,
  toggleDispatchMenu: () => {},
  toggleExportMode: () => {},
  toggleSeekTime: () => {},
  toggleSetInitTS: () => {},
  videoStreamTS: null,
  vms: VmsPropTypeDefault,
  zoomLevel: 5,
  // isTSWithinRetentionDays={props.isTSWithinRetentionDays}
}

TimelineContainer.propTypes = {
  accountSlug: PropTypes.string,
  catalogue: PropTypes.array,
  changeExportTSRange: PropTypes.func,
  createDispatchRequest: PropTypes.func,
  creatingDispatchRequest: PropTypes.func,
  darkMode: PropTypes.bool,
  dataFromTS: PropTypes.func,
  displayEntitySelector: PropTypes.bool,
  displayMessage: PropTypes.bool,
  endTimelineTS: PropTypes.number,
  exportEndTS: PropTypes.number,
  exportStartTS: PropTypes.number,
  handleEnterFullScreenVideo: PropTypes.func,
  handleEntitySelection: PropTypes.func,
  handleExitFullScreenVideo: PropTypes.func,
  handleExport: PropTypes.func,
  handlePlayPauseButton: PropTypes.func,
  handleStepInSeconds: PropTypes.func,
  handleViewableEndTS: PropTypes.func,
  handleViewableStartTS: PropTypes.func,
  initTS: PropTypes.number,
  isAlertsVisible: PropTypes.bool,
  isArchiveVisible: PropTypes.bool,
  isCatalogueMissing: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isFullScreenVideo: PropTypes.bool,
  isHoveringOnTimeline: PropTypes.bool,
  isHoveringOnTopControls: PropTypes.bool,
  isSeekTimeVisible: PropTypes.bool,
  isZoomIn: PropTypes.number,
  loadingArchivalVideo: PropTypes.bool,
  message: PropTypes.string,
  metadata: PropTypes.array,
  onTimelineSelection: PropTypes.func,
  playheadFixedPosition: PropTypes.string,
  playbackStatus: PropTypes.string,
  readableTSPlaying: PropTypes.string,
  retention: PropTypes.shape({
    motion_segment_retention_days: PropTypes.number,
    nonmotion_segment_retention_days: PropTypes.number,
  }),
  selectedEntities: PropTypes.array,
  sendTooltipMessage: PropTypes.func,
  setDisplayedEntityMarkers: PropTypes.func,
  setInitTS: PropTypes.bool,
  setIsFollowing: PropTypes.func,
  setIsPlayheadInRange: PropTypes.func,
  setShouldResetPlayheadInRange: PropTypes.func,
  setStopFollowing: PropTypes.func,
  setPlayheadFixedPosition: PropTypes.func,
  showDispatchMenu: PropTypes.bool,
  shouldResetPlayheadInRange: PropTypes.bool,
  siteSlug: PropTypes.string,
  startTimelineTS: PropTypes.number,
  stopVideoElem: PropTypes.func,
  streamId: PropTypes.number,
  subtractDays: PropTypes.number,
  toggleDispatchMenu: PropTypes.func,
  toggleExportMode: PropTypes.func,
  toggleSeekTime: PropTypes.func,
  toggleSetInitTS: PropTypes.func,
  videoStreamTS: PropTypes.number,
  vms: VmsPropType,
  zoomLevel: PropTypes.bool,
}

const mapStateToProps = state => ({
  vms: state.vms,
})

export default connect(
  mapStateToProps,
  null,
)(TimelineContainer)

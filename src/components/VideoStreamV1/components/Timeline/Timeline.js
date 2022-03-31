/* eslint-disable no-restricted-globals */
import React, { Component } from 'react'
import Slider from 'rc-slider'
import { SearchableSelectDropdown } from 'ambient_ui'
import chroma from 'chroma-js'
import PropTypes from 'prop-types'

import Tooltip from '../../../Tooltip'
import TooltipText from '../../../Tooltip/TooltipText'
import PlaybackStatus from '../../data/PlaybackStatus'
import getCurrUnixTimestamp from '../../utils/getCurrUnixTimestamp'
import formatUnixTimeToReadable from '../../utils/formatUnixTimeToReadable'
import tsAtMidnight from '../../utils/tsAtMidnight'
import 'rc-slider/assets/index.css'
import './Timeline.css'
import { msToUnix } from '../../../../utils'

const { Handle } = Slider

const colorPalette = [
  '#1ab394',
  '#0ABFFC',
  '#a800b7',
  '#000000',
  '#f8ac59',
  '#ff19eb',
]

// Used to see how many documents we need before being sure to say a entity was detected
const MIN_ENTITY_DOC_COUNT = 1
const WIDTH_OF_ENTITY_MARKER_MIN = 10
const WIDTH_OF_ENTITY_MARKER_HRS = 2

const PLAYPOINTER_POSITION_OFFSET = 200
const VIEWWINDOW_OFFSET_HRS = 60 * 60 * 5
const VIEWWINDOW_OFFSET_MIN = 60 * 60 * 4

const convertMinutesToTime = minutes => {
  let hrs = Math.floor(minutes / 60).toFixed(0)
  if (hrs < 10) {
    hrs = `0${hrs}`
  }
  const remainder = minutes % 60
  let mins = Math.floor(remainder / 60).toFixed(0)
  if (mins < 10) {
    mins = `0${mins}`
  }
  return `${hrs}:${mins}`
}

const convertSecondsToTime = seconds => {
  let hrs = Math.floor(seconds / 3600).toFixed(0)
  if (hrs < 10) {
    hrs = `0${hrs}`
  }
  const remainder = seconds % 3600
  let mins = Math.floor(remainder / 60).toFixed(0)
  if (mins < 10) {
    mins = `0${mins}`
  }
  let sec = (remainder % 60).toFixed(0)
  if (sec < 10) {
    sec = `0${sec}`
  }
  return `${hrs}:${mins}:${sec}`
}

class Timeline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startTimelineTS:
        this.props.isZoomIn === 1
          ? this.props.startTimelineTS
          : this.props.startTimelineTS / 60,
      endTimelineTS:
        this.props.isZoomIn === 1
          ? this.props.endTimelineTS
          : this.props.endTimelineTS / 60,
      timelineWidth:
        this.props.isZoomIn === 1
          ? this.props.videoStreamTS - tsAtMidnight()
          : (this.props.videoStreamTS - tsAtMidnight()) / 60,
      playpointerPosition:
        this.props.isZoomIn === 1
          ? this.props.videoStreamTS -
            tsAtMidnight() +
            PLAYPOINTER_POSITION_OFFSET
          : (this.props.videoStreamTS -
              tsAtMidnight() +
              PLAYPOINTER_POSITION_OFFSET) /
            60,
      viewWindowPosition:
        this.props.isZoomIn === 1
          ? (this.props.videoStreamTS - tsAtMidnight()) * -1 +
            PLAYPOINTER_POSITION_OFFSET +
            VIEWWINDOW_OFFSET_MIN
          : ((this.props.videoStreamTS -
              tsAtMidnight(this.props.subtractDays)) *
              -1 +
              PLAYPOINTER_POSITION_OFFSET +
              VIEWWINDOW_OFFSET_HRS) /
            60,
      xAxisIncrements: this.props.isZoomIn === 1 ? 60 * 5 : 60, // 5 mins
      playpointerHasData: false,
      hoverIndicatorX: 0,
      currentCatalogPlaying: null, // set to null if playbackStatus is LIVE
      clipLeftPosition: 0,
      clipRightPosition: 0,
      clipWidth: 0,
      initClipControlsPosition: 0,
      maxSeekBar: this.props.isZoomIn === 1 ? 86400 : 1440,
      entityOptionsSelectFormat: [],
      showInputSearch: false,
    }

    this.streamClockInterval = null
    this.timelineContainer = React.createRef()
    this.thumbnail = React.createRef()
    this.svgContainer = React.createRef()
    this.quickScrollBar = React.createRef()
    this.selectedElement = null
    this.offset = null

    this.renderTimelineMarkers = this.renderTimelineMarkers.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.getWidthOfClickInDecimal = this.getWidthOfClickInDecimal.bind(this)
    this.onTimelineHover = this.onTimelineHover.bind(this)
    this.getTimestampOfMouse = this.getTimestampOfMouse.bind(this)
    this.filterCatalogue = this.filterCatalogue.bind(this)
    this.getMouseCoordinatesWithinSvg = this.getMouseCoordinatesWithinSvg.bind(
      this,
    )
    this.renderXAxisMarkers = this.renderXAxisMarkers.bind(this)
    this.convertPositionToTS = this.convertPositionToTS.bind(this)
    this.displayClipControls = this.displayClipControls.bind(this)
    this.handleViewWindowSlider = this.handleViewWindowSlider.bind(this)

    this.startDrag = this.startDrag.bind(this)
    this.drag = this.drag.bind(this)
    this.endDrag = this.endDrag.bind(this)
    this.getMousePosition = this.getMousePosition.bind(this)
    this.handleQuickScroll = this.handleQuickScroll.bind(this)
    this.dragQuickScroll = this.dragQuickScroll.bind(this)
    this.endDragQuickScroll = this.endDragQuickScroll.bind(this)
    this.quickScrollLocationToX = this.quickScrollLocationToX.bind(this)
    this.getSvgWidth = this.getSvgWidth.bind(this)
    this.stopDragging = this.stopDragging.bind(this)
    this.createSliderMarks = this.createSliderMarks.bind(this)
    this.renderHandle = this.renderHandle.bind(this)
    this.handleQuickScrollMouseEnter = this.handleQuickScrollMouseEnter.bind(
      this,
    )
    this.handleQuickScrollMouseLeave = this.handleQuickScrollMouseLeave.bind(
      this,
    )
    this.setInitTSByUnixTS = this.setInitTSByUnixTS.bind(this)

    this.unixTimeHasData = this.unixTimeHasData.bind(this)

    this.determineViewWindowOffset = this.determineViewWindowOffset.bind(this)

    this.onSeekChange = this.onSeekChange.bind(this)
    this.handleSeekClick = this.handleSeekClick.bind(this)
    this.xCoordinateFromTS = this.xCoordinateFromTS.bind(this)

    this.withinNonMotionRetentionDuration = this.withinNonMotionRetentionDuration.bind(
      this,
    )
  }

  componentDidMount() {
    this.svgPt = this.svgContainer.current.createSVGPoint()
    const progressContainerOffset = this.determineViewWindowOffset()

    const newState = {}
    if (this.props.isZoomIn === 1) {
      newState.viewWindowPosition =
        (this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays)) *
          -1 +
        progressContainerOffset / 2
    } else {
      newState.viewWindowPosition =
        ((this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays)) *
          -1 +
          progressContainerOffset / 2) /
        60
    }
    this.setState(newState, () => {
      this.stopPlayerClock()
      this.startPlayerClock()
    })
  }

  componentWillUnmount() {
    this.stopPlayerClock()
  }

  determineViewWindowOffset() {
    // If progress container is past 12, jump to location, else set offset to 0
    let progressContainerOffset
    if (
      (this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays) <
        86400 / 2 &&
        !this.props.isZoomIn) ||
      (this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays) < 300 &&
        this.props.isZoomIn)
    ) {
      progressContainerOffset =
        this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays)
    } else {
      const progressContainerWidth = document.getElementById(
        'progress-container',
      ).offsetWidth
      const progressContainerWidthHalf = Math.floor(progressContainerWidth / 2)
      progressContainerOffset = progressContainerWidthHalf
    }
    return progressContainerOffset
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const progressContainerOffset = this.determineViewWindowOffset()

    if (this.props.setInitTS === true) {
      this.stopPlayerClock()
      // TODO: @rodaan - messy clean this up
      this.props.toggleSetInitTS(() => {
        this.setInitTSByUnixTS(this.props.initTS, null, true)
      })
    } else {
      if (
        this.props.playbackStatus !== prevProps.playbackStatus ||
        this.props.isFollowing !== prevProps.isFollowing
      ) {
        const newState = {}
        if (this.props.playbackStatus === PlaybackStatus.LIVE) {
          if (this.props.isZoomIn === 1) {
            newState.viewWindowPosition =
              (this.props.videoStreamTS -
                tsAtMidnight(this.props.subtractDays)) *
                -1 +
              progressContainerOffset
          } else {
            newState.viewWindowPosition =
              ((this.props.videoStreamTS -
                tsAtMidnight(this.props.subtractDays)) *
                -1 +
                progressContainerOffset) /
              60
          }
          newState.timelineWidth =
            this.props.isZoomIn === 1
              ? this.props.videoStreamTS - tsAtMidnight()
              : (this.props.videoStreamTS - tsAtMidnight()) / 60
          newState.playpointerPosition =
            this.props.videoStreamTS -
            tsAtMidnight() +
            PLAYPOINTER_POSITION_OFFSET
          this.setState(newState, () => {
            this.stopPlayerClock()
            this.startPlayerClock()
          })
        } else {
          if (this.props.subtractDays > 0) {
            newState.timelineWidth = this.props.isZoomIn === 1 ? 86400 : 1440
          }
          newState.playpointerPosition =
            this.props.isZoomIn === 1
              ? this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays)
              : (this.props.videoStreamTS -
                  tsAtMidnight(this.props.subtractDays)) /
                60
          this.setState(newState, () => {})
        }
      }

      if (this.props.exportMode !== prevProps.exportMode) {
        this.displayClipControls()
      }

      if (this.props.isZoomIn !== prevProps.isZoomIn) {
        // when zoom is changed, transition everything to new format
        let newState = {}
        // check to zoom in to convert
        if (this.props.playbackStatus === PlaybackStatus.LIVE) {
          if (this.props.isZoomIn === 1) {
            newState = {
              startTimelineTS: this.props.startTimelineTS,
              endTimelineTS: this.props.endTimelineTS,
              timelineWidth:
                this.props.videoStreamTS -
                tsAtMidnight(this.props.subtractDays),
              playpointerPosition:
                this.props.videoStreamTS -
                tsAtMidnight(this.props.subtractDays),
              viewWindowPosition:
                (this.props.videoStreamTS -
                  tsAtMidnight(this.props.subtractDays)) *
                  -1 +
                progressContainerOffset,
              xAxisIncrements: 60 * 5, // 5 mins
              maxSeekBar: 86400,
            }
          } else {
            newState = {
              startTimelineTS: this.props.startTimelineTS / 60,
              endTimelineTS: this.props.endTimelineTS / 60,
              timelineWidth:
                (this.props.videoStreamTS -
                  tsAtMidnight(this.props.subtractDays)) /
                60,
              playpointerPosition:
                (this.props.videoStreamTS -
                  tsAtMidnight(this.props.subtractDays)) /
                60,
              viewWindowPosition:
                ((this.props.videoStreamTS -
                  tsAtMidnight(this.props.subtractDays)) *
                  -1 +
                  progressContainerOffset) /
                60,
              xAxisIncrements: 60, // 5 mins
              maxSeekBar: 1440,
            }
          }
          this.setState(newState, () => {})
        } else if (
          this.props.playbackStatus === PlaybackStatus.PLAYING ||
          this.props.playbackStatus === PlaybackStatus.PAUSED
        ) {
          if (this.props.isZoomIn === 1) {
            newState.timelineWidth = 86400
            newState.xAxisIncrements = 60 * 5
            newState.maxSeekBar = 86400
            newState.startTimelineTS = this.props.startTimelineTS
            newState.endTimelineTS = this.props.endTimelineTS
            newState.playpointerPosition =
              this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays)
            newState.viewWindowPosition =
              (this.props.videoStreamTS -
                tsAtMidnight(this.props.subtractDays)) *
                -1 +
              progressContainerOffset
          } else {
            newState.timelineWidth = 1440
            newState.xAxisIncrements = 60 // 5 mins
            newState.maxSeekBar = 1440
            newState.startTimelineTS = this.props.startTimelineTS / 60
            newState.endTimelineTS = this.props.endTimelineTS / 60
            newState.playpointerPosition =
              (this.props.videoStreamTS -
                tsAtMidnight(this.props.subtractDays)) /
              60
            newState.viewWindowPosition =
              ((this.props.videoStreamTS -
                tsAtMidnight(this.props.subtractDays)) *
                -1 +
                progressContainerOffset) /
              60
          }
          this.setState(newState, () => {})
        }
      }

      if (
        this.props.subtractDays !== prevProps.subtractDays &&
        this.props.subtractDays > 0
      ) {
        const newState = {}
        if (this.props.isZoomIn === 1) {
          newState.timelineWidth = 86400
          newState.xAxisIncrements = 60 * 5
          newState.maxSeekBar = 86400
          newState.startTimelineTS = this.props.startTimelineTS
          newState.endTimelineTS = this.props.endTimelineTS
          newState.playpointerPosition =
            this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays)
          newState.viewWindowPosition =
            (this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays)) *
              -1 +
            progressContainerOffset / 2
        } else {
          newState.timelineWidth = 1440
          newState.xAxisIncrements = 60 // 5 mins
          newState.maxSeekBar = 1440
          newState.startTimelineTS = this.props.startTimelineTS / 60
          newState.endTimelineTS = this.props.endTimelineTS / 60
          newState.playpointerPosition =
            (this.props.videoStreamTS - tsAtMidnight(this.props.subtractDays)) /
            60
          newState.viewWindowPosition =
            ((this.props.videoStreamTS -
              tsAtMidnight(this.props.subtractDays)) *
              -1 +
              (progressContainerOffset / 2) * 60) /
            60
        }
        this.setState(newState, () => {
          this.stopPlayerClock()
          this.startPlayerClock()
        })
      }

      if (
        this.props.entitySelectorOptions !== prevProps.entitySelectorOptions
      ) {
        let k = 0
        const entityOptionsSelectFormat = Array.isArray(
          this.props.entitySelectorOptions,
        )
          ? this.props.entitySelectorOptions.map((entity, i) => {
              if (k === colorPalette.length) {
                k = 0
              }
              const selectedColor = colorPalette[k]
              k += 1
              return {
                label: entity.name,
                value: entity.id,
                idx: i,
                color: selectedColor,
                type: entity.type || 'entity',
              }
            })
          : []

        const entityOptionsColorObject = {}
        for (let i = 0; i < entityOptionsSelectFormat.length; ++i) {
          entityOptionsColorObject[entityOptionsSelectFormat[i].label] =
            entityOptionsSelectFormat[i].color
        }
        this.setState(
          {
            entityOptionsSelectFormat,
            entityOptionsColorObject,
          },
          () => {},
        )
      }
    }
  }

  /* Clip Controls methods */

  displayClipControls() {
    let viewWindowPosition
    if (this.props.isZoomIn === 1) {
      viewWindowPosition = this.state.viewWindowPosition
    } else {
      viewWindowPosition = this.state.viewWindowPosition * 60
    }
    this.setState(
      {
        clipLeftPosition: 0,
        clipRightPosition: 20,
        clipWidth: 20,
        clipLeftPositionTS: Math.abs(viewWindowPosition) + 60 + tsAtMidnight(),
        clipRightPositionTS:
          Math.abs(viewWindowPosition) + 60 + tsAtMidnight() + 20,
        initClipControlsPosition: Math.abs(this.state.viewWindowPosition) + 60,
      },
      () => {
        this.props.changeExportTSRange(
          this.state.clipLeftPositionTS,
          this.state.clipRightPositionTS,
        )
      },
    )
  }

  startDrag(evt) {
    this.selectedElement = evt.target
    this.offset = this.getMousePosition(evt)
    this.offset.x -= parseFloat(this.state[`${this.selectedElement.id}`])
    window.addEventListener('mouseup', this.endDrag)
    window.addEventListener('mousemove', this.drag)
  }

  getMousePosition(evt) {
    const CTM = this.svgContainer.current.getScreenCTM()

    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    }
  }

  drag(evt) {
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
        this.setState(newState, () => {})
      }
    }
  }

  endDrag(evt) {
    this.selectedElement = null
    window.removeEventListener('mouseup', this.endDrag)
    window.removeEventListener('mousemove', this.drag)
    this.props.changeExportTSRange(
      this.state.clipLeftPositionTS,
      this.state.clipRightPositionTS,
    )
  }

  stopPlayerClock() {
    if (this.streamClockInterval) {
      clearInterval(this.streamClockInterval)
      this.streamClockInterval = null
    }
  }

  startPlayerClock() {
    this.streamClockInterval = setInterval(() => {
      const newClockState = {}
      const incrementAmount = this.props.isZoomIn === 1 ? 1 : 1 / 60

      if (this.props.playbackStatus === PlaybackStatus.LIVE) {
        newClockState.timelineWidth = this.state.timelineWidth + incrementAmount
        newClockState.playpointerPosition =
          this.state.timelineWidth + incrementAmount
        newClockState.currentCatalogPlaying = null
        // TODO: if follow mode is on, can set view window to current, set follow when initially switching to LIVE, set to unfollow when user moves around
        if (this.props.isFollowing) {
          newClockState.viewWindowPosition =
            (this.props.videoStreamTS - tsAtMidnight()) * -1
        }
      } else if (this.props.playbackStatus === PlaybackStatus.PLAYING) {
        // check if ts has data, if not, move to next catalogue slot
        const nextData = this.props.dataFromTS(
          this.props.catalogue,
          this.props.videoStreamTS,
        )
        if (
          this.state.currentCatalogPlaying &&
          !nextData.el &&
          !this.withinNonMotionRetentionDuration(this.props.videoStreamTS)
        ) {
          // search for next data point
          const nextCatalogueObj = this.props.catalogue[
            this.state.currentCatalogPlaying.index + 1
          ]
          if (nextCatalogueObj) {
            newClockState.currentCatalogPlaying = {
              el: nextCatalogueObj,
              index: this.state.currentCatalogPlaying.index + 1,
            }
            newClockState.playpointerPosition =
              nextCatalogueObj.startTs / 1000 -
              tsAtMidnight(this.props.subtractDays)

            if (this.props.isZoomIn === 0) {
              newClockState.playpointerPosition /= 60
            }

            // move stream to next ts slot
            this.props.onTimelineSelection(nextCatalogueObj.startTs / 1000)
          } else {
            this.props.stopVideoElem()
          }
        } else {
          newClockState.playpointerPosition =
            this.state.playpointerPosition + incrementAmount
        }
      }
      newClockState.quickScrollLocation = this.quickScrollLocationToX()
      this.setState(newClockState, () => {})
    }, 1000)
  }

  convertPositionToTS(position) {
    const finalPosition = this.props.isZoomIn === 1 ? position : position * 60
    return finalPosition + tsAtMidnight(this.props.subtractDays)
  }

  tsToSliderPosition(ts) {
    // 100% = 86400
    const diff = ts - tsAtMidnight(this.props.subtractDays)
    return (diff / 86400) * 100
  }

  renderSVGSliderMarkers = () => {
    const sliderMarkers = []
    if (this.props.catalogue) {
      const filtered = this.props.catalogue

      let curr
      // let currWidth;
      let currX = 0
      let max

      for (let i = 0; i < filtered.length; ++i) {
        curr = filtered[i]

        if (this.props.isZoomIn === 0) {
          max = 1440
        } else {
          max = 86400
        }

        // if(this.props.subtractDays > 0){
        //     currWidth = Math.min(((curr.endTs - curr.startTs)/1000), tsAtMidnight(this.props.subtractDays - 1) - (curr.startTs/1000));
        // } else if (this.props.subtractDays === 0){
        //     currWidth = Math.min(((curr.endTs - curr.startTs)/1000), getCurrUnixTimestamp() - (curr.startTs/1000));
        // }

        currX = curr.startTs / 1000 - tsAtMidnight(this.props.subtractDays)

        if (this.props.isZoomIn === 0) {
          // currWidth /= 60;
          currX /= 60
          max = 1440
        } else {
          max = 86400
        }

        if (currX <= max && !isNaN(currX)) {
          // eslint-disable-line
          // eslint-disable-line
          const sliderX = this.tsToSliderPosition(curr.startTs / 1000)
          sliderMarkers.push(
            <circle
              key={`circle-${sliderX}`}
              className='datapoint slider-marker'
              cx={`${sliderX}%`}
              fill='#337ab7'
              r='5'
              cy='15'
            />,
          )
        }
      }
    }
    // Renders the entity markers
    if (this.props.selectedEntities.length > 0) {
      let curr
      // let currWidth;
      let currX = 0
      let max
      let filtered

      // TODO: Need to handle when different metadata entities are displayed --> Intersection Search
      for (let k = 0; k < this.props.metadata.length; ++k) {
        filtered = this.props.metadata[k].aggregations.byTimeUnit.buckets
        for (let i = 0; i < filtered.length; ++i) {
          curr = filtered[i]

          const keyTs = msToUnix(curr.key)

          currX = keyTs - tsAtMidnight(this.props.subtractDays)

          // This is to set the largest most point of the timeline to be 1440 (number of minutes in a day) vs 86400 (number of seconds in a day)
          // Divides current X by 60 if not zoomed in since currX is in seconds and want to view currX in minutes
          if (this.props.isZoomIn === 0) {
            currX /= 60
            max = 1440
            // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
            // if(this.props.subtractDays >= 0){
            //     currWidth = WIDTH_OF_ENTITY_MARKER_HRS
            // }
          } else {
            max = 86400
            // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
            // if(this.props.subtractDays >= 0){
            //     currWidth = WIDTH_OF_ENTITY_MARKER_MIN
            // }
          }

          if (
            this.unixTimeHasData(keyTs) &&
            curr.docCount >= MIN_ENTITY_DOC_COUNT &&
            currX <= max &&
            !isNaN(currX) // eslint-disable-line
          ) {
            // eslint-disable-line
            const sliderX = this.tsToSliderPosition(keyTs)
            sliderMarkers.push(
              <circle
                className='datapoint slider-marker'
                cx={`${sliderX}%`}
                fill='pink'
                r='5'
                cy='5'
              />,
            )
          }
        }
      }
    }

    if (this.props.tsTimelineHighlight) {
      const tsTimelineHighlight = Number(this.props.tsTimelineHighlight)

      let highlightX =
        tsTimelineHighlight - tsAtMidnight(this.props.subtractDays)
      let max

      // This is to set the largest most point of the timeline to be 1440 (number of minutes in a day) vs 86400 (number of seconds in a day)
      if (this.props.isZoomIn === 0) {
        highlightX /= 60
        max = 1440
        // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
        // if(this.props.subtractDays >= 0){
        //     currWidth = WIDTH_OF_ENTITY_MARKER_HRS
        // }
      } else {
        max = 86400
        // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
        // if(this.props.subtractDays >= 0){
        //     currWidth = WIDTH_OF_ENTITY_MARKER_MIN
        // }
      }
      if (
        this.unixTimeHasData(tsTimelineHighlight) &&
        highlightX <= max &&
        !isNaN(highlightX) // eslint-disable-line
      ) {
        // eslint-disable-line
        const sliderX = this.tsToSliderPosition(tsTimelineHighlight)
        sliderMarkers.push(
          <circle
            className='datapoint slider-marker highlight'
            cx={`${sliderX}%`}
            fill='#FFC803'
            r='5'
            cy='5'
          />,
        )
      }
    }
    return sliderMarkers
  }

  renderTimelineMarkers() {
    const markers = []

    // Renders the non motion marker
    // Check if current day selected is today (this.props.subtractDays === 0)
    const nonMotionTs =
      this.props.subtractDays > 0
        ? tsAtMidnight(this.props.subtractDays - 1)
        : getCurrUnixTimestamp()
    if (this.withinNonMotionRetentionDuration(nonMotionTs)) {
      let nonMotionX = 0
      let nonmotionWidth =
        this.props.subtractDays > 0
          ? 86400
          : getCurrUnixTimestamp() - tsAtMidnight()
      if (this.props.subtractDays === 0) {
        // If it is current day
        nonmotionWidth = getCurrUnixTimestamp() - tsAtMidnight()
      } else if (
        this.props.subtractDays ===
        this.props.retention.nonmotionSegmentRetentionDays
      ) {
        // Check to see if subtractDays is last day in retention
        nonMotionX = getCurrUnixTimestamp() - tsAtMidnight()
        nonmotionWidth = 86400 - nonMotionX
      } else {
        // If it is not the current day or the last retention day, then whole day is available to click
        nonmotionWidth = 86400
      }

      if (this.props.isZoomIn === 0) {
        nonmotionWidth /= 60
        nonMotionX /= 60
      }

      const nonmotionStartTs = tsAtMidnight(this.props.subtractDays)
      const nonmotionEndTs =
        this.props.subtractDays > 0
          ? nonmotionStartTs + 86400
          : getCurrUnixTimestamp()

      markers.push(
        <rect
          key={`marker-${nonmotionStartTs}`}
          className='datapoint nonmotion'
          rx='3'
          data-readable-start={formatUnixTimeToReadable(
            nonmotionStartTs,
            true,
            true,
          )}
          data-readable-end={formatUnixTimeToReadable(
            nonmotionEndTs,
            true,
            true,
          )}
          data-startts={nonmotionStartTs}
          data-endts={nonmotionEndTs}
          fill='#0ABFFC'
          fillOpacity='0.4'
          height='20'
          width={`${nonmotionWidth}`}
          y='0'
          x='-1'
          transform={`translate(${nonMotionX})`}
        />,
      )
    }

    // Render the catalogue markers if there is catalogue
    if (this.props.catalogue) {
      const viewWindowPosition =
        this.props.isZoomIn === 1
          ? this.state.viewWindowPosition
          : this.state.viewWindowPosition * 60
      const filtered = this.filterCatalogue(
        Math.abs(viewWindowPosition) + tsAtMidnight(this.props.subtractDays),
      )

      let curr
      let currWidth
      let currX = 0
      let max

      for (let i = 0; i < filtered.length; ++i) {
        curr = filtered[i]

        if (this.props.isZoomIn === 0) {
          max = 1440
        } else {
          max = 86400
        }

        if (this.props.subtractDays > 0) {
          currWidth = Math.min(
            (curr.endTs - curr.startTs) / 1000,
            tsAtMidnight(this.props.subtractDays - 1) - curr.startTs / 1000,
          )
        } else if (this.props.subtractDays === 0) {
          currWidth = Math.min(
            (curr.endTs - curr.startTs) / 1000,
            getCurrUnixTimestamp() - curr.startTs / 1000,
          )
        }

        currX = curr.startTs / 1000 - tsAtMidnight(this.props.subtractDays)

        if (this.props.isZoomIn === 0) {
          currWidth /= 60
          currX /= 60
          max = 1440
        } else {
          max = 86400
        }

        if (currX <= max && !isNaN(currX)) {
          // eslint-disable-line
          // eslint-disable-line
          markers.push(
            <rect
              key={`marker-${curr.startTs}`}
              className='datapoint catalogue'
              rx='3'
              data-readable-start={formatUnixTimeToReadable(
                curr.startTs / 1000,
                true,
                true,
              )}
              data-readable-end={formatUnixTimeToReadable(
                curr.endTs / 1000,
                true,
                true,
              )}
              data-startts={curr.startTs / 1000}
              data-endts={curr.endTs / 1000}
              fill='#337ab7'
              fillOpacity='0.5'
              height='10'
              width={`${currWidth}`}
              x='-1'
              transform={`translate(${currX})`}
            />,
          )
        }
      }
    }

    // Renders the entity markers
    if (this.props.selectedEntities.length > 0) {
      let curr
      let currWidth
      let currX = 0
      let max
      let filtered

      // TODO: Need to handle when different metadata entities are displayed --> Intersection Search
      for (let k = 0; k < this.props.metadata.length; ++k) {
        filtered = this.props.metadata[k].aggregations.byTimeUnit.buckets
        for (let i = 0; i < filtered.length; ++i) {
          curr = filtered[i]
          const keyTs = msToUnix(curr.key)

          currX = keyTs - tsAtMidnight(this.props.subtractDays)

          // This is to set the largest most point of the timeline to be 1440 (number of minutes in a day) vs 86400 (number of seconds in a day)
          // Divides current X by 60 if not zoomed in since currX is in seconds and want to view currX in minutes
          if (this.props.isZoomIn === 0) {
            currX /= 60
            max = 1440
            // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
            if (this.props.subtractDays >= 0) {
              currWidth = WIDTH_OF_ENTITY_MARKER_HRS
            }
          } else {
            max = 86400
            // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
            if (this.props.subtractDays >= 0) {
              currWidth = WIDTH_OF_ENTITY_MARKER_MIN
            }
          }

          if (
            this.unixTimeHasData(keyTs) &&
            curr.docCount >= MIN_ENTITY_DOC_COUNT &&
            currX <= max &&
            !isNaN(currX) // eslint-disable-line
          ) {
            // eslint-disable-line
            markers.push(
              <rect
                key={`marker-${keyTs}`}
                className='datapoint metadata'
                rx='3'
                data-readable-start={formatUnixTimeToReadable(
                  keyTs,
                  true,
                  true,
                )}
                data-readable-end={formatUnixTimeToReadable(keyTs, true, true)}
                data-startts={keyTs}
                data-endts={keyTs}
                fill='pink'
                fillOpacity='0.8'
                height='10'
                width={`${currWidth}`}
                x='-1'
                transform={`translate(${currX})`}
              />,
            )
          }
        }
      }
    }

    // Render Timeline Highlight
    if (this.props.tsTimelineHighlight) {
      const highlightTs = Number(this.props.tsTimelineHighlight)
      let highlightX = highlightTs - tsAtMidnight(this.props.subtractDays)
      let maxTimeline
      let highlightWidth
      if (this.props.isZoomIn === 0) {
        highlightX /= 60
        maxTimeline = 1440
        // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
        if (this.props.subtractDays >= 0) {
          highlightWidth = WIDTH_OF_ENTITY_MARKER_HRS
        }
      } else {
        maxTimeline = 86400
        // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current
        if (this.props.subtractDays >= 0) {
          highlightWidth = WIDTH_OF_ENTITY_MARKER_MIN
        }
      }
      if (
        this.unixTimeHasData(highlightTs) &&
        highlightX <= maxTimeline &&
        !isNaN(highlightX) // eslint-disable-line
      ) {
        // eslint-disable-line
        markers.push(
          <rect
            className='datapoint metadata highlight'
            rx='3'
            data-readable-start={formatUnixTimeToReadable(
              highlightTs,
              true,
              true,
            )}
            data-readable-end={formatUnixTimeToReadable(
              highlightTs,
              true,
              true,
            )}
            data-startts={highlightTs}
            data-endts={highlightTs}
            fill='#FFC803'
            fillOpacity='0.8'
            height='10'
            width={`${highlightWidth}`}
            x='-1'
            transform={`translate(${highlightX})`}
          />,
        )
      }
    }

    return markers
  }

  renderXAxisMarkers() {
    // need to see what time window is and change index based on viewWindowPosition
    const markers = []
    let lowestMultiple
    let largestMultiple
    if (this.props.isZoomIn === 1) {
      const minTime =
        Math.abs(Math.floor(this.state.viewWindowPosition)) -
        this.state.xAxisIncrements * 3 // 15 min time window
      const maxTime =
        Math.abs(Math.floor(this.state.viewWindowPosition)) +
        this.state.xAxisIncrements * 15

      // get lowest multiple of 5 within time range
      for (let i = minTime; i <= maxTime; ++i) {
        if (i % this.state.xAxisIncrements === 0) {
          lowestMultiple = i
          break
        }
      }

      for (let i = maxTime; i >= minTime; --i) {
        if (i % this.state.xAxisIncrements === 0) {
          largestMultiple = i
          break
        }
      }
    } else {
      lowestMultiple = 0
      largestMultiple = 1440
    }

    let tsAtLocation
    let unixTS
    let isZoomOut

    for (
      let i = lowestMultiple;
      i <= largestMultiple;
      i += this.state.xAxisIncrements
    ) {
      if (this.props.isZoomIn === 1) {
        unixTS = i + tsAtMidnight()
        isZoomOut = false
      } else {
        unixTS = i * 60 + tsAtMidnight()
        isZoomOut = true
      }
      tsAtLocation = formatUnixTimeToReadable(unixTS, false, true, isZoomOut)

      markers.push(
        <g
          key={i}
          className='tick'
          opacity='1'
          transform={`translate(${i}, -30)`}
        >
          <line stroke='#676a6c' y2='18' />
          <text y='20' dy='0.71em' fill='#676a6c'>
            {tsAtLocation}
          </text>
        </g>,
      )
    }

    return markers
  }

  filterCatalogue(selectedTS) {
    let startTS
    let endTS
    if (this.props.isZoomIn === 1) {
      startTS = selectedTS - 3600 * 3
      endTS = selectedTS + 3600 * 3
    } else {
      startTS = selectedTS - 3600 * 10
      endTS = selectedTS + 3600 * 10
    }
    if (this.props.catalogue.length > 0) {
      return this.props.catalogue.filter(el => {
        // get only elements in the catalogue that are within the 3 hour range
        return msToUnix(el.endTs) >= startTS && msToUnix(el.startTs) <= endTS
      })
    }
    return []
  }

  onMouseDown(e) {
    // e.preventDefault();
    this.props.noLongerFollowing()
    window.addEventListener('mouseup', this.onMouseUp)
  }

  withinNonMotionRetentionDuration(unixTs) {
    const nonmotionSegmentRetentionDays =
      this.props.retention.nonmotionSegmentRetentionDays || 0
    const nonmotionSegmentRetentionDuration =
      nonmotionSegmentRetentionDays * 86400
    return nonmotionSegmentRetentionDays > 0
      ? getCurrUnixTimestamp() - nonmotionSegmentRetentionDuration <= unixTs
      : false
  }

  onMouseUp(evt) {
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
        const svgContainerBoundingBox = this.svgContainer.current.getBoundingClientRect()
        let playpointerPosition
        if (this.props.isZoomIn) {
          playpointerPosition =
            evt.clientX -
            svgContainerBoundingBox.left +
            Math.abs(this.state.viewWindowPosition)
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
            this.stopPlayerClock()
            this.startPlayerClock()
          },
        )
      } else {
        this.props.sendTooltipMessage('No Recorded Data')
      }
    } else {
      this.props.sendTooltipMessage('No Recorded Data')
    }
  }

  onMouseLeave() {
    this.setState({
      isHoveringOnTimeline: false,
    })
  }

  getWidthOfClickInDecimal(evt) {
    const mouseX = evt.clientX
    const boundingRect = this.timelineContainer.current.getBoundingClientRect()
    // subtract mouseX location from left most edge of timeline view to get difference
    return (
      (mouseX - boundingRect.left) / (boundingRect.right - boundingRect.left)
    )
  }

  // used to get the timestamp of a click or hover event
  getTimestampOfMouse(cursorPt) {
    let cursorPtX
    let viewWindowPosition
    if (this.props.isZoomIn) {
      viewWindowPosition = Math.abs(this.state.viewWindowPosition)
      cursorPtX = cursorPt.x
    } else {
      viewWindowPosition = Math.abs(this.state.viewWindowPosition * 60)
      cursorPtX = cursorPt.x * 60
    }
    return (
      viewWindowPosition +
      (tsAtMidnight() - 3600 * 24 * this.props.subtractDays) +
      cursorPtX
    )
  }

  getMouseCoordinatesWithinSvg(evt) {
    this.svgPt.x = evt.clientX
    this.svgPt.y = evt.clientY
    return this.svgPt.matrixTransform(
      this.svgContainer.current.getScreenCTM().inverse(),
    )
  }

  onTimelineHover(evt) {
    const cursorPt = this.getMouseCoordinatesWithinSvg(evt)
    const unixTs = this.getTimestampOfMouse(cursorPt)
    const readableDate = formatUnixTimeToReadable(unixTs, false, true)

    const svgContainerBoundingBox = this.svgContainer.current.getBoundingClientRect()
    const mouseIndicatorX = evt.clientX - svgContainerBoundingBox.left
    const mouseIndicatorY = evt.clientY - svgContainerBoundingBox.top
    const hoverIndicatorX =
      evt.clientX -
      svgContainerBoundingBox.left +
      this.state.viewWindowPosition * -1

    const newState = {
      isHoveringOnTimeline: true,
      thumbnailDate: readableDate,
      mouseIndicatorY,
      mouseIndicatorX,
      hoverIndicatorX,
    }

    if (this.props.catalogue) {
      newState.hasData =
        this.unixTimeHasData(unixTs) ||
        this.withinNonMotionRetentionDuration(unixTs)
    }

    this.setState(newState, () => {})
  }

  unixTimeHasData(unixTs) {
    return !!this.props.dataFromTS(this.props.catalogue, unixTs).el
  }

  moveViewBoxLeft = () => {
    this.props.noLongerFollowing()
    this.setState(
      {
        viewWindowPosition:
          this.state.viewWindowPosition +
          Number(this.props.viewWindowIncrementSize),
      },
      () => {},
    )
  }

  moveViewBoxRight = () => {
    this.props.noLongerFollowing()
    this.setState(
      {
        viewWindowPosition:
          this.state.viewWindowPosition -
          Number(this.props.viewWindowIncrementSize),
      },
      () => {},
    )
  }

  getMousePositionQuickScroll(evt) {
    const CTM = this.svgContainer.current.getScreenCTM()

    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    }
  }

  handleQuickScroll(evt) {
    this.props.noLongerFollowing()
    // bar goes from 0 to -86400
    // Ohr = 0 and 24hr to -86400
    const quickScrollBoundingBox = this.quickScrollBar.current.getBoundingClientRect()

    const relativeMousePosition = evt.clientX - quickScrollBoundingBox.left

    const newViewWindowLocation =
      (relativeMousePosition / quickScrollBoundingBox.width) * 86400

    window.addEventListener('mouseup', this.endDragQuickScroll)
    window.addEventListener('mousemove', this.dragQuickScroll)

    this.setState(
      {
        viewWindowPosition: newViewWindowLocation * -1,
      },
      () => {},
    )
  }

  dragQuickScroll(evt) {
    const quickScrollBoundingBox = this.quickScrollBar.current.getBoundingClientRect()

    const relativeMousePosition = evt.clientX - quickScrollBoundingBox.left

    const newViewWindowLocation =
      (relativeMousePosition / quickScrollBoundingBox.width) * 86400

    this.setState(
      {
        viewWindowPosition: newViewWindowLocation * -1,
      },
      () => {},
    )
  }

  quickScrollLocationToX() {
    // eslint-disable-line
    if (this.quickScrollBar.current) {
      return Math.abs(this.state.viewWindowPosition) / 86400
    }

    return null
  }

  endDragQuickScroll() {
    window.removeEventListener('mouseup', this.endDragQuickScroll)
    window.removeEventListener('mousemove', this.dragQuickScroll)
  }

  getSvgWidth() {
    // eslint-disable-line
    if (this.svgContainer.current) {
      const boundingRect = this.svgContainer.current.getBoundingClientRect()
      return boundingRect.width
    }

    return null
  }

  handleViewWindowSlider(value) {
    this.props.noLongerFollowing()
    this.setState(
      {
        viewWindowPosition: value * -1,
        dragging: true,
      },
      () => {},
    )
  }

  stopDragging() {
    this.setState({
      dragging: false,
    })
  }

  createSliderMarks() {
    const marks = {}
    const scalar = this.props.isZoomIn === 1 ? 3600 : 60
    for (let i = 0; i < 25; ++i) {
      if (i % 2 === 0) {
        marks[i * scalar] = {
          style: {
            fontSize: '0.7em',
          },
          label: `${i}:00`,
        }
      }
    }

    // indicator for playhead
    marks[this.state.playpointerPosition] = {
      style: {
        color: '#ed5565',
        fontSize: '0.7em',
        marginTop: '-0.7em',
      },
      label: <i className='fa fa-sort-up' />,
    }

    return marks
  }

  handleQuickScrollMouseEnter() {
    window.addEventListener('mouseup', this.handleQuickMouseLeave)
    this.setState({
      hoveringOnHandle: true,
    })
  }

  handleQuickScrollMouseLeave() {
    this.setState(
      {
        hoveringOnHandle: false,
      },
      () => {
        window.removeEventListener('mouseup', this.handleQuickMouseLeave)
      },
    )
  }

  handleQuickScrollClick() {
    this.setState({
      hoveringOnHandle: true,
    })
  }

  // eslint-disable-next-line
  renderHandle(props) {
    const { value, ...restProps } = props
    return (
      <Handle
        // onMouseClick={this.handleQuickScrollMouseEnter} // REACT Warning: Unknown event handler property `onMouseClick`. It will be ignored.
        value={value}
        {...restProps}
      />
    )
  }

  onSeekChange(e) {
    const seekInput =
      e.target.value.length < 8 ? `${e.target.value}:00` : e.target.value
    this.setState(
      {
        seekInput,
      },
      () => {},
    )
  }

  xCoordinateFromTS(unixTs) {
    // Get startTimelineTS calculate amount of distance from unix midnight time to desired
    const timeSinceMidnight = unixTs - this.props.startTimelineTS
    return timeSinceMidnight
  }

  setInitTSByUnixTS(unixTs, currentCatalogue, getNearest) {
    // Need to get where the X will be from a TS
    const playpointerPosition = this.xCoordinateFromTS(unixTs)
    const newState = {
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
      // unix_ts = ((currentCatalogue.el.startTs/1000) + (currentCatalogue.el.endTs / 1000)) / 2;
      // }
      newState.currentCatalogPlaying = newCurrentCatalogue
    }
    this.setState(
      newState,
      () => {
        this.props.onTimelineSelection(unixTs)
      },
      () => {},
    )
  }

  handleSeekClick() {
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

  render() {
    const markers = this.renderTimelineMarkers()
    const sliderMarkers = this.renderSVGSliderMarkers()
    const xAxisMarkers = this.renderXAxisMarkers()
    const hoverIndicator = this.state.isHoveringOnTimeline
      ? '#1ab394'
      : 'transparent'

    let hasDataDisplay
    if (this.props.loadingArchivalVideo) {
      hasDataDisplay = 'Loading Archival Video...'
    } else if (this.state.hasData) {
      hasDataDisplay = 'Recorded Data'
    } else {
      hasDataDisplay = 'No Recorded Data'
    }

    const isZoomOut = !this.props.isZoomIn
    const clipLeftPositionDisplay = this.state.clipLeftPositionTS
      ? formatUnixTimeToReadable(
          this.state.clipLeftPositionTS,
          false,
          true,
          isZoomOut,
        )
      : null
    const clipRightPositionDisplay = this.state.clipRightPositionTS
      ? formatUnixTimeToReadable(
          this.state.clipRightPositionTS,
          false,
          true,
          isZoomOut,
        )
      : null

    const svgWidth = this.getSvgWidth()

    const waiting = this.props.loadingArchivalVideo ? 'waiting' : null

    // TODO: need to figure out how to set clipLocation
    const clipControl = this.props.exportMode ? (
      <g
        className='clip'
        transform={`translate(${this.state.initClipControlsPosition}, 0)`}
      >
        <g className='clip-selector'>
          <rect
            className='selection'
            height='40'
            fill='#1ab394'
            opacity='0.6'
            x={`${this.state.clipLeftPosition}`}
            width={`${this.state.clipWidth}`}
          />
          <g
            className='left'
            transform={`translate(${this.state.clipLeftPosition}, 0)`}
          >
            <rect
              id='clipLeftPosition'
              onMouseDown={this.startDrag}
              className='handle draggable '
              rx='3'
              ry='3'
              width='16'
              transform='translate(-16,0)'
              height='40'
              fill='#1ab394'
            />
            <rect
              className='dragable line'
              transform='translate(-1)'
              height='40'
              fill='#10a580'
              width='1'
            />
            <rect
              className='dragable grabLine'
              fill='white'
              transform='translate(-14, 5)'
              width='1'
              height='30'
            />
          </g>
          <g
            className='right'
            transform={`translate(${this.state.clipRightPosition}, 0)`}
          >
            <rect
              id='clipRightPosition'
              onMouseDown={this.startDrag}
              className='handle draggable '
              rx='3'
              ry='3'
              width='16'
              height='40'
              fill='#1ab394'
            />
            <rect
              className='dragable line'
              transform='translate(-1)'
              height='40'
              fill='#10a580'
              width='1'
            />
            <rect
              className='dragable grabLine'
              fill='white'
              transform='translate(13, 5)'
              width='1'
              height='30'
            />
          </g>
          <rect
            className='playpointer-time'
            fill='#f2f2f2'
            width='46'
            opacity='0.5'
            height='1em'
            x={`${this.state.clipLeftPosition}`}
            transform='translate(-22,41)'
          />
          <text
            className='start label time'
            textAnchor='middle'
            height='22'
            dy='50'
            fill='#676a6c'
            fontSize='12'
            x={`${this.state.clipLeftPosition}`}
          >
            {clipLeftPositionDisplay}
          </text>
          <rect
            className='playpointer-time'
            fill='#f2f2f2'
            width='46'
            opacity='0.5'
            height='1em'
            x={`${this.state.clipRightPosition}`}
            transform='translate(-22,41)'
          />
          <text
            className='end label time'
            textAnchor='middle'
            height='22'
            dy='50'
            fill='#676a6c'
            fontSize='12'
            x={`${this.state.clipRightPosition}`}
          >
            {clipRightPositionDisplay}
          </text>
        </g>
      </g>
    ) : null

    let leftEdgeEffectX
    let rightEdgeEffectX
    // let leftEdgeFill;
    if (this.state.viewWindowPosition > 0) {
      //   leftEdgeFill = 'transparent'
      leftEdgeEffectX = this.state.viewWindowPosition * -1
      rightEdgeEffectX = svgWidth - 10 - this.state.viewWindowPosition
    } else {
      //  leftEdgeFill = 'url("#leftEdge")'
      leftEdgeEffectX = Math.abs(this.state.viewWindowPosition)
      rightEdgeEffectX = Math.abs(this.state.viewWindowPosition) + svgWidth - 10
    }

    let displayTooltip
    let displayTooltipContent
    if (this.state.isHoveringOnTimeline) {
      displayTooltip = true
      displayTooltipContent = (
        <TooltipText>
          {this.state.thumbnailDate} -{hasDataDisplay}
        </TooltipText>
      )
    } else if (this.state.dragging) {
      displayTooltip = true
      const svgContainerBoundingBox = this.svgContainer.current.getBoundingClientRect()
      const startRange = Math.abs(this.state.viewWindowPosition)
      const endRange = startRange + Math.floor(svgContainerBoundingBox.width)

      if (this.props.isZoomIn === 1) {
        displayTooltipContent = (
          <TooltipText>
            Time Range: {convertSecondsToTime(startRange)} -{' '}
            {convertSecondsToTime(endRange)}
          </TooltipText>
        )
      } else {
        displayTooltipContent = (
          <TooltipText>
            Time Range: {convertMinutesToTime(startRange)} -{' '}
            {convertMinutesToTime(endRange)}
          </TooltipText>
        )
      }
    } else if (this.props.displayMessage) {
      displayTooltip = true
      displayTooltipContent = <TooltipText>{this.props.message}</TooltipText>
    } else {
      displayTooltip = false
    }

    // Entity search selector component
    const displayEntitySelector = this.props.displayEntitySelector ? (
      <div className='entity_selector_container'>
        <SearchableSelectDropdown
          options={this.state.entityOptionsSelectFormat}
          value={this.props.selectedEntities}
          onChange={this.props.handleEntitySelection}
          isMulti
          styles={{
            control: styles => ({ ...styles, backgroundColor: 'white' }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
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
          }}
          placeholder='Select Entities'
          autoFocus
        />
        {/* <div>
                    <input type='checkbox' onChange={this.props.toggleEntitiesOnly} checked={this.props.entitiesOnly} />
                    Entities Only
                </div> */}
      </div>
    ) : null

    const seekInputBottom = this.props.displayEntitySelector ? '194px' : '155px'

    const seekInputDisplay = this.props.showSeekInputDisplay ? (
      <div className='seek-input' style={{ bottom: seekInputBottom }}>
        <input
          className='form-control'
          type='time'
          step='1'
          onChange={this.onSeekChange}
        />
        <button className='btn btn-primary' onClick={this.handleSeekClick}>
          Seek
        </button>
      </div>
    ) : null

    return (
      <div>
        <Tooltip
          placement='top'
          content={displayTooltipContent}
          interactive
          visible={displayTooltip}
        >
          <div id='progress-container' className='progress-container'>
            <div>
              {displayEntitySelector}
              {seekInputDisplay}
              <svg
                ref={this.svgContainer}
                width='988'
                height='60'
                className='svg-container-v1'
              >
                <defs>
                  <linearGradient id='leftEdge'>
                    <stop offset='0%' stopColor='white' stopOpacity='1' />
                    <stop offset='100%' stopColor='white' stopOpacity='0' />
                  </linearGradient>
                  <linearGradient id='rightEdge'>
                    <stop offset='0%' stopColor='white' stopOpacity='0' />
                    <stop offset='100%' stopColor='white' stopOpacity='1' />
                  </linearGradient>
                </defs>
                <g
                  transform={`matrix(1, 0, 0, 1, ${this.state.viewWindowPosition}, 0)`}
                  width='758'
                >
                  <rect
                    rx='5'
                    transform='translate(0)'
                    x='0'
                    y='0'
                    fill='#e5e5e5'
                    width={`${this.state.timelineWidth}`}
                    height='25'
                  />
                  <g
                    className='x-axis'
                    transform='translate(0, 60)'
                    fill='none'
                    fontSize='10'
                    textAnchor='middle'
                  >
                    <path
                      className='domain'
                      stroke='#000'
                      d='M0.5,18V0.5H758.5V18'
                    />
                    {xAxisMarkers}
                  </g>
                  <g className='datapoints' transform='translate(0)'>
                    {markers}
                  </g>
                  <g className='playpointer-group'>
                    <g
                      className='playpointer'
                      transform={`translate(${this.state.playpointerPosition}, -30)`}
                    >
                      <rect
                        className='playpointer-grab-area'
                        fill='none'
                        width='10'
                        height='30'
                        x='-5'
                        y='30'
                      />
                      <rect
                        className='playpointer-line'
                        fill='#ed5565'
                        width='2'
                        height='30'
                        x='-1'
                        y='30'
                      />
                      <rect
                        className='playpointer-time'
                        fill='#f2f2f2'
                        width='56'
                        opacity='0.5'
                        height='18'
                        transform='translate(-30,65)'
                      />
                      <circle r='4' cy='60' fill='#ed5565' />
                      <text textAnchor='middle' dy='78' fontSize='12'>
                        {this.props.readableTSPlaying}
                      </text>
                    </g>
                  </g>
                  <rect
                    className='hoverline'
                    height='25'
                    transform='translate(0)'
                    fill={`${hoverIndicator}`}
                    width='1'
                    x={`${this.state.hoverIndicatorX}`}
                    y='0'
                  />
                  <rect
                    id='clickable timeline'
                    className={`interactible ${waiting}`}
                    ref={this.timelineContainer}
                    onMouseMove={this.onTimelineHover}
                    onMouseLeave={this.onMouseLeave}
                    onMouseDown={this.onMouseDown}
                    transform='translate(0)'
                    x='0'
                    y='0'
                    fill='transparent'
                    width={`${this.state.timelineWidth}`}
                    height='25'
                  />
                  {clipControl}
                  <rect
                    className='leftEdge'
                    width='10'
                    height='80'
                    fill='url("#leftEdge")'
                    transform={`translate(${leftEdgeEffectX})`}
                  />
                  <rect
                    className='rightEdge'
                    width='10'
                    height='80'
                    fill='url("#rightEdge")'
                    transform={`translate(${rightEdgeEffectX})`}
                  />
                </g>
              </svg>
              <div style={{ width: '100%' }}>
                <svg
                  ref={this.svgSliderContainer}
                  width='100%'
                  height='20'
                  className='svg-slider-container'
                >
                  <g>{sliderMarkers}</g>
                </svg>
                <Slider
                  handle={this.renderHandle}
                  marks={this.createSliderMarks()}
                  tipFormatter={val => {
                    return `${val}`
                  }}
                  tipProps={{
                    placement: 'top',
                    prefixCls: 'rc-slider-tooltip',
                  }}
                  min={0}
                  max={this.state.maxSeekBar}
                  defaultValue={3}
                  value={Math.abs(this.state.viewWindowPosition)}
                  onAfterChange={this.stopDragging}
                  onChange={this.handleViewWindowSlider}
                />
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    )
  }
}

Timeline.defaultProps = {
  viewWindowIncrementSize: 10,
  isHoveringOnTimeline: false,
  thumbnailDate: '',
  onTimelineSelection: () => {},
  startTimelineTS: null,
  endTimelineTS: null,
  playbackStatus: PlaybackStatus.LIVE,
  catalogue: [],
  videoStreamTS: null,
  readableTSPlaying: '',
  streamId: null,
  exportMode: false,
  changeExportTSRange: () => {},
  isFollowing: false,
  noLongerFollowing: () => {},
  loadingArchivalVideo: false,
  subtractDays: 0,
  message: '',
  displayMessage: false,
  dataFromTS: () => {},
  stopVideoElem: () => {},
  isZoomIn: 0,
  entitySelectorOptions: [],
  displayEntitySelector: false,
  metadata: [],
  handleEntitySelection: () => {},
  selectedEntities: [],
  showSeekInputDisplay: false,
  sendTooltipMessage: () => {},
  retention: {},
  setInitTS: false,
  toggleSetInitTS: () => {},
  initTS: null,
  tsTimelineHighlight: null,
}

Timeline.propTypes = {
  viewWindowIncrementSize: PropTypes.number,
  isHoveringOnTimeline: PropTypes.bool,
  thumbnailDate: PropTypes.string,
  onTimelineSelection: PropTypes.func,
  startTimelineTS: PropTypes.number,
  endTimelineTS: PropTypes.number,
  playbackStatus: PropTypes.string,
  catalogue: PropTypes.array,
  videoStreamTS: PropTypes.number,
  readableTSPlaying: PropTypes.string,
  streamId: PropTypes.number,
  exportMode: PropTypes.bool,
  changeExportTSRange: PropTypes.func,
  isFollowing: PropTypes.bool,
  noLongerFollowing: PropTypes.func,
  loadingArchivalVideo: PropTypes.bool,
  subtractDays: PropTypes.number,
  message: PropTypes.string,
  displayMessage: PropTypes.bool,
  dataFromTS: PropTypes.func,
  stopVideoElem: PropTypes.func,
  isZoomIn: PropTypes.number,
  entitySelectorOptions: PropTypes.array,
  displayEntitySelector: PropTypes.bool,
  metadata: PropTypes.array,
  handleEntitySelection: PropTypes.func,
  selectedEntities: PropTypes.array,
  showSeekInputDisplay: PropTypes.bool,
  sendTooltipMessage: PropTypes.func,
  retention: PropTypes.shape({
    motionSegmentRetentionDays: PropTypes.number,
    nonmotionSegmentRetentionDays: PropTypes.number,
  }),
  setInitTS: PropTypes.bool,
  toggleSetInitTS: PropTypes.func,
  initTS: PropTypes.number,
  tsTimelineHighlight: PropTypes.number,
}

export default Timeline

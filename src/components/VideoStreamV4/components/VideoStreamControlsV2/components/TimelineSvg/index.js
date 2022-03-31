import React, {
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import moment from 'moment'
// src
import {
  DEFAULT_TIMEZONE,
  formatTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'
import { useElapsedTime } from 'use-elapsed-time'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { useInterval } from 'common/hooks'
import { createNotification } from 'redux/slices/notifications'
import {
  addTimes,
  setDispatchAlertTS,
  setVideoStreamValues,
} from 'redux/slices/videoStreamControls'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import { StreamStateEnum, StreamTypeUpdatedEnum } from 'enums'
// import useWebRTCSync from 'webrtc/hooks/useWebRTCSync'
import { setQueryTs } from 'redux/slices/reId'

import {
  //  convertDragToTimeDeltaMs,
  currentPlayTimeController,
  displayHoverTime,
  midpointTimeMoment,
  getXDomain,
} from '../../utils'
import { TIMELINE, CURVE_ICONS } from '../../constants'
import formatUnixTimeToReadable from '../../../../../VideoStreamControls/utils/formatUnixTimeToReadable'
import useGotoPlaybackTime from '../../../../hooks/useGotoPlaybackTime'
import useStoreTimelineRange from '../../../../hooks/useStoreTimelineRange'

import TimelineTooltip from './components/TimelineTooltip'
import LivePlayhead from './components/LivePlayhead'
import Playhead from './components/Playhead'
import TimeAxis from './components/TimeAxis'
import {
  CurveContainer,
  ForensicsMarkers,
  IncidentMarker,
  MotionMarkers,
  RetentionMarkers,
} from './components/TimelineMarkers'

// WE actually need another state machine here to decide what it should do on each render.
// 1. static - controlled - give start and end
// 2. dynamic - playtime and duration
const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  clickX: PropTypes.number,
  controlledTime: PropTypes.bool, // // These are mutually exclusive settings (ie. should have state machine here to encapsulate that logic) if controlledTime is true, it uses startTime and endTime, else it uses playTime and duration
  getMetadata: PropTypes.func,
  hoverX: PropTypes.number,
  initTs: PropTypes.number,
  isHovering: PropTypes.bool,
  liveTime: PropTypes.instanceOf(Date),
  liveX: PropTypes.number,
  resetClickX: PropTypes.func,
  streamId: PropTypes.number,
  timezone: PropTypes.string,
  videoStreamKey: PropTypes.string, // for interfacing with redux
  widthPx: PropTypes.number,
}

const defaultProps = {
  timezone: DEFAULT_TIMEZONE,
  widthPx: 0,
}

const is24hr = false
const timeFormat = is24hr ? 'HH:mm:ss' : 'hh:mm:ss a'
const timeLabelWidth = is24hr ? 70 : 96

const TimelineSvg = ({
  accountSlug,
  siteSlug,
  clickX,
  controlledTime, // // These are mutually exclusive settings (ie. should have state machine here to encapsulate that logic) if controlledTime is true, it uses startTime and endTime, else it uses playTime and duration
  getMetadata,
  hoverX,
  initTs,
  isHovering,
  resetClickX,
  streamId,
  timezone,
  videoStreamKey,
  widthPx,
}) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const storeTimelineRange = useStoreTimelineRange({ videoStreamKey })
  const startTime = useRef(new Date())
  const endTime = useRef(new Date())

  const [isTooltipVisible, setIsTooltipVisible] = useState(isHovering) // eslint-disable-line

  const streamType = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'mode' }),
  )
  const isPlayingLive =
    streamType === StreamTypeUpdatedEnum.NORMAL ||
    streamType === StreamTypeUpdatedEnum.SPE

  const dispatchAlertManualTimeMode = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'dispatchAlertManualTimeMode',
    }),
  )

  const timeDomainSliderValue = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timeDomainSliderValue',
    }),
  )

  const timelineDuration = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timelineDuration',
    }),
  )

  const playTime = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playTime',
    }),
  )

  const isPlaying =
    useSelector(getStreamFeedData({ videoStreamKey, property: 'status' })) ===
    StreamStateEnum.PLAYING

  const speed = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'speed',
    }),
  )

  const key = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'key',
    }),
  )

  const startAt = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'startAt',
    }),
  )

  const times = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'times',
      defaultValue: [],
    }),
  ) // array of second durations [30, 120, 60] for calculating total time (esp when playing at 2x speed)

  const gotoPlaybackTime = useGotoPlaybackTime({ videoStreamKey })
  const { elapsedTime, reset } = useElapsedTime(isPlaying, {
    duration: 100000,
    autoResetKey: key,
  })

  const setVMSProps = useCallback(
    props => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props,
        }),
      )
    },
    [videoStreamKey, dispatch],
  )

  // useWebRTCSync(videoStreamKey, setVMSProps)

  const animateToTime = useRef(undefined)

  const prevAnimationPlayTime = useRef(undefined)
  const prevPlayTime = useRef(playTime)
  const playTimeDiff = useRef(undefined)
  const playTimeDirection = useRef(undefined)
  const totalTime = times.reduce((a, b) => a + b, 0)
  const elapsedTotalTime = speed * elapsedTime // current segment of time (in between speed)

  const [xDomain, setXDomain] = useState(() =>
    getXDomain(controlledTime, startTime, endTime, playTime, timelineDuration),
  ) // domain of time in d3 parlance, range is [0, width]

  const xRange = [0, widthPx]

  // Live Time
  const timeRange = getXDomain(false, null, null, playTime, timelineDuration)
  const playpointerTime = playTime || midpointTimeMoment(startTime, endTime) // will use controlled to decide if it uses playTime or midpointTime
  const [currentPlayTime, setCurrentPlayTime] = useState(playpointerTime)
  // const currentPlayTime = playTime || midpointTimeMoment(startTime, endTime) // will use controlled to decide if it uses playTime or midpointTimeMoment

  // const [framesTime, setFramesTime] = useState(0) // the total count of aggregated frames, +1 and -1 frames at a time
  const oldSpeed = useRef(speed)

  const setAddPlayTime = secPassed => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          playTime: moment(startAt)
            .add(secPassed.toFixed(1), 'seconds')
            .toDate(),
        },
      }),
    )
  }
  // Returns tenths decimal place
  // for 3.9523, will return 9,  for 3.2345 will return 2
  const getDecimalAsInteger = value =>
    Math.floor((value - Math.floor(value)) * 10)

  // ANIMATION LOOP
  //
  useLayoutEffect(() => {
    // elapsedTotalTime - the time elapsed at the current speed and length of playing at this speed
    // totalTime - time elapsed from all segments of playing speeds, it is the aggregation of the times array
    // framesTime - an accumulation of the time added or subtracted from the calculated time due to user pressing next frame and prev frame
    const timePassed = elapsedTotalTime + totalTime

    if (timeDomainSliderValue < 1) {
      setAddPlayTime(timePassed)
    } else if (timeDomainSliderValue < 2) {
      if (getDecimalAsInteger(timePassed) % 3 === 0) {
        // will update 3 times per second .3, .6, .9
        setAddPlayTime(timePassed)
      }
    } else if (getDecimalAsInteger(timePassed) % 9 === 0) {
      // will update once per second
      setAddPlayTime(timePassed)
    }
  }, [elapsedTotalTime]) // eslint-disable-line

  // Animates a timeline click  by request Animation frame
  // based on the
  useLayoutEffect(() => {
    const diff = moment
      .duration(moment(playTime).diff(moment(prevPlayTime.current)))
      .asSeconds()

    if (clickX && Math.floor(Math.abs(diff)) > 2) {
      if (playTimeDiff.current === undefined) {
        requestAnimationFrame(step)
        // set animation to reference end point
        animateToTime.current = displayHoverTime(clickX / widthPx, timeRange)
      }
      resetClickX()
    }

    // This "step" function is called recursively until animation time runs out
    // This is custom code to handle smooth transition on clicking the timeline, for the
    // timeline to calculate and move smoothly from the current playhead time to the
    // clicked playhead time (animating the timeline move smoothly rather than a jump)
    //
    const ANIMATION_TIME = 250 // ms
    let start

    function step(timestamp) {
      // Setup
      // first time thru, assign values
      if (start === undefined) {
        start = timestamp
      }
      if (playTimeDiff.current === undefined) {
        playTimeDiff.current = Math.abs(diff)
      }
      if (prevAnimationPlayTime.current === undefined) {
        prevAnimationPlayTime.current = prevPlayTime
      }

      prevPlayTime.current = playTime
      // store the direction of movement as well since we take abs value of the diff
      if (diff > 0) {
        playTimeDirection.current = 'add'
      } else {
        playTimeDirection.current = 'subtract'
      }

      // determine the amount of the diff to move this step
      const elapsed = timestamp - start // in milliseconds
      const ratioToMoveThisStep = Math.min(elapsed / ANIMATION_TIME, 1) // min ensures ratio is never greater than 1
      const diffToMoveThisStep = Math.abs(
        playTimeDiff.current * ratioToMoveThisStep,
      ) // and the diff to move is never greater than diff

      // the intermediate time to animate to this RAF
      let intermediatePlayTime
      // update the playtime by the step diff, and do this only if the remaining value is > 0 and the amount ot move is > 0
      if (playTimeDiff.current > 0 && diffToMoveThisStep > 0) {
        // use the direction to determine which way to move
        if (playTimeDirection.current === 'add') {
          // use end animation reference point (animateToTime.current) to base the move off of
          intermediatePlayTime = moment(animateToTime.current)
            .subtract(playTimeDiff.current, 'seconds')
            .add(diffToMoveThisStep, 'seconds')
            .toDate()
        } else if (playTimeDirection.current === 'subtract') {
          intermediatePlayTime = moment(animateToTime.current)
            .add(playTimeDiff.current, 'seconds')
            .subtract(diffToMoveThisStep, 'seconds')
            .toDate()
        }
        setVMSProps({ playTime: intermediatePlayTime })
      }

      // update the value of the remaining diff (ie. )
      // Does this belong BEFORE or AFTER (line 276 or 290)
      playTimeDiff.current -= diffToMoveThisStep
      prevAnimationPlayTime.current = intermediatePlayTime

      // kick off recursion ONLY if animation time hasn't completed and
      if (elapsed < ANIMATION_TIME && playTimeDiff.current > 0) {
        // Stop the animation after ANIMATION_TIME
        requestAnimationFrame(step)
      } else {
        // if animation is finished, reset
        playTimeDiff.current = undefined
        prevAnimationPlayTime.current = undefined
      }
    }
  }, [clickX, playTime, resetClickX, setVMSProps, widthPx, timeRange])

  // Dragging the Timeline -- NOTE: This was breaking streams by sending unnecessary messages - @rodaan
  //
  // useLayoutEffect(() => {
  //   const setDragPlayTimeX = dx => {
  //     let newTime
  //     const deltaMs = convertDragToTimeDeltaMs(dx / widthPx, timeRange)

  //     const velocityMs = deltaMs * 1

  //     if (deltaMs < 0) {
  //       newTime = moment(playTime)
  //         .add(-velocityMs, 'milliseconds')
  //         .toDate()
  //     } else {
  //       newTime = moment(playTime)
  //         .subtract(velocityMs, 'milliseconds')
  //         .toDate()
  //     }

  //     // ensure time doesn't go past now time
  //     if (moment(newTime).isBefore(moment().subtract(30, 'seconds'))) {
  //       reset(0) // reset
  //       gotoPlaybackTime(newTime)
  //     }
  //   }

  //   if (dragX !== 0) {
  //     setDragPlayTimeX(dragX)
  //   }
  // }, [dragX, gotoPlaybackTime, widthPx]) //eslint-disable-line

  // uses times array on every speed change
  useEffect(() => {
    dispatch(addTimes({ videoStreamKey, time: oldSpeed.current * elapsedTime }))
    reset(0)
    oldSpeed.current = speed
  }, [speed]) // eslint-disable-line

  // Set TimeRange in Redux.
  // This is handled separately from the playTime, which is updated in RAF (request anim frame)
  // This affects person curve, which gets requeried anytime timeRange changes in redux.
  //
  // Set Timerange on 1) Open and 2) when duration is changed 3) timeline is clicked
  useEffect(() => {
    storeTimelineRange(moment(startAt).toDate(), timelineDuration)
  }, [startAt, timelineDuration, storeTimelineRange])

  // Set Timerange in redux 4) every 10 second interval.
  useInterval(() => {
    storeTimelineRange(moment(playTime).toDate(), timelineDuration)
  }, 15_000)

  // Handle Click
  useEffect(() => {
    if (clickX) {
      const handleTimelineWrapperClick = clickedX => {
        const clickDate = displayHoverTime(clickedX / widthPx, timeRange)

        const clickDateUnix = clickDate.unix()
        // Needed for ReID
        dispatch(setQueryTs(clickDateUnix)) // set query ts on click

        if (dispatchAlertManualTimeMode) {
          dispatch(
            createNotification({
              message: `Custom Alert Time Selected: ${formatUnixTimeToReadable(
                clickDateUnix,
                true,
                true,
              )}`,
            }),
          )
          dispatch(setDispatchAlertTS({ videoStreamKey, ts: clickDateUnix }))
        } else if (
          moment(clickDate).isBefore(moment().subtract(30, 'seconds'))
        ) {
          // default click handler
          gotoPlaybackTime(clickDate) // PUT THIS BACK
        } else {
          dispatch(createNotification({ message: 'Select a time in the past' }))
        }
      }
      handleTimelineWrapperClick(clickX)
      // resetClickX()
    }
  }, [
    clickX,
    dispatch,
    dispatchAlertManualTimeMode,
    gotoPlaybackTime,
    resetClickX,
    widthPx,
    timeRange,
    videoStreamKey,
  ])

  // Layout
  // OPTIMIZE - Could remove this
  useLayoutEffect(() => {
    setXDomain(
      getXDomain(
        controlledTime,
        startTime,
        endTime,
        playTime,
        timelineDuration,
      ),
    )

    setCurrentPlayTime(
      currentPlayTimeController(
        controlledTime,
        startTime,
        endTime,
        playTime,
        timelineDuration,
      ),
    )
  }, [startTime, endTime, playTime, timelineDuration, controlledTime])

  const centerWidthPx = widthPx / 2
  const hoverTime = displayHoverTime(
    hoverX / widthPx,
    getXDomain(controlledTime, startTime, endTime, playTime, timelineDuration),
  )

  // <svg onClick={handleTimelineWrapperClick}
  return (
    <>
      {isHovering && (
        <TimelineTooltip
          x={Math.min(
            Math.max(hoverX - TIMELINE.tooltip.width / 2, 0),
            widthPx - TIMELINE.tooltip.width,
          )} //  keeps tooltip on screen
          visible={isHovering}
          time={hoverTime.toDate()}
          videoStreamKey={videoStreamKey}
          streamId={streamId}
        />
      )}
      <svg
        width={widthPx}
        height={TIMELINE.container.height}
        viewBox={`0 0 ${widthPx || 0} ${TIMELINE.container.height}`}
      >
        {/* TIMELINE BG */}
        <rect
          x={0}
          y={0}
          width={TIMELINE.timeline.width}
          fill={palette.grey[900]}
        />
        {/* AXIS */}
        <TimeAxis
          xDomain={xDomain}
          xRange={xRange}
          timezone={timezone}
          videoStreamKey={videoStreamKey}
        />
        <g transform={`translate(0, ${TIMELINE.axis.height})`}>
          <CurveContainer
            initialQueries={[CURVE_ICONS[0].query]} // array of queries to initialize with.  [0].query is person, [1].query is car
            height={TIMELINE.curve.height}
            xDomain={xDomain}
            xRange={xRange}
            getMetadata={getMetadata}
            videoStreamKey={videoStreamKey}
          />
        </g>
        {initTs && (
          <g transform={`translate(0, ${TIMELINE.axis.height})`}>
            <IncidentMarker initTs={initTs} xDomain={xDomain} xRange={xRange} />
          </g>
        )}
        <g
          transform={`translate(0, ${TIMELINE.curve.height +
            TIMELINE.axis.height})`}
        >
          <ForensicsMarkers
            xDomain={xDomain}
            xRange={xRange}
            videoStreamKey={videoStreamKey}
          />
        </g>
        <g
          transform={`translate(0, ${TIMELINE.curve.height +
            TIMELINE.axis.height +
            4})`}
        >
          <MotionMarkers
            accountSlug={accountSlug}
            siteSlug={siteSlug}
            streamId={streamId}
            xDomain={xDomain}
            xRange={xRange}
            videoStreamKey={videoStreamKey}
          />
        </g>
        <g
          transform={`translate(0, ${TIMELINE.curve.height +
            TIMELINE.axis.height +
            8})`}
        >
          <RetentionMarkers
            xDomain={xDomain}
            xRange={xRange}
            videoStreamKey={videoStreamKey}
          />
        </g>
        {/* START DATE */}
        <rect
          id='start-date-bg'
          x={24}
          y={4}
          width={40}
          height={12}
          transform='translate(-12)'
          fill={palette.grey[900]} // to blend into the timeline
          opacity={1}
        />
        <text
          id='start-date'
          x={32} // this is hardcoded now...
          y={14}
          className='am-overline'
          fill='white'
          textAnchor='middle'
          opacity={1}
        >
          {moment(xDomain[0]).format('MM/DD')}
        </text>
        {/* LIVE TEXT
           show if recorded or is paused */}
        {(!isPlayingLive || !isPlaying) && (
          <LivePlayhead
            widthPx={widthPx} // will move this to redux i think
            timeRange={timeRange} // probably also this to redux
            label='Live'
            labelWidth={36}
            color={TIMELINE.playhead.nowColor}
          />
        )}
        {/*  PLAYTIME if Paused */}
        {!isPlaying && (
          <Playhead
            color={TIMELINE.playhead.playingColor}
            label={formatTimeWithTZ(playTime, timeFormat, timezone)}
            labelWidth={timeLabelWidth}
            x={centerWidthPx}
            opacity={1}
            textOpacity={
              isHovering ? TIMELINE.playhead.textOpacityOnHoveringTimeline : 1
            }
          />
        )}
        {/* NOW PLAYTIME if LIVE */}
        {isPlaying && isPlayingLive && (
          <Playhead
            color={TIMELINE.playhead.playingColor}
            label={formatTimeWithTZ(playTime, timeFormat, timezone)}
            labelWidth={timeLabelWidth}
            x={centerWidthPx}
            opacity={1}
            textOpacity={
              isHovering ? TIMELINE.playhead.textOpacityOnHoveringTimeline : 1
            }
          />
        )}
        {/* CURRENT NOW PLAYTIME if RECORDED */}
        {isPlaying && !isPlayingLive && (
          <Playhead
            color={TIMELINE.playhead.playingColor}
            label={formatTimeWithTZ(currentPlayTime, timeFormat, timezone)}
            labelWidth={timeLabelWidth}
            x={centerWidthPx}
            opacity={1}
            textOpacity={
              isHovering ? TIMELINE.playhead.textOpacityOnHoveringTimeline : 1
            }
          />
        )}
        {/* HOVER */}
        <Playhead
          label={formatTimeWithTZ(hoverTime, timeFormat, timezone)}
          x={hoverX}
          labelWidth={timeLabelWidth}
          color={
            dispatchAlertManualTimeMode
              ? TIMELINE.playhead.alertDispatchColor
              : TIMELINE.playhead.hoverColor
          }
          opacity={isHovering ? 1 : 0}
        />
      </svg>
    </>
  )
}

TimelineSvg.propTypes = propTypes
TimelineSvg.defaultProps = defaultProps
export default TimelineSvg

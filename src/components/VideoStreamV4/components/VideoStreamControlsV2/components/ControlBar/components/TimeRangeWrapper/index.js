// @ERIC
// "Forked" into code and incorporated this library with ambient -style and logic  adjustments:
// https://github.com/lizashkod/react-timeline-range-slider
// https://codesandbox.io/s/react-timeline-range-slider-ve7w2?file=/src/App.js
//
// 1) not showing tick marks
// 2) colors/styles,
// 3) positioning at 0 for absolute positioning
//
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import clsx from 'clsx'
// src
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import {
  useFuturisticStyles,
  useFlexStyles,
  useCursorStyles,
} from 'common/styles/commonStyles'
import { useExportStream } from 'webrtc/hooks'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { Button, Icon } from 'ambient_ui'

import { getXDomain } from '../../../../utils'

import useStyles from './styles'
import TimeRange from './TimeRange'

const propTypes = {
  handleClose: PropTypes.func,
  videoStreamKey: PropTypes.string,
}

const is24hr = false
const timeFormat = is24hr ? 'HH:mm:ss' : 'hh:mm:ss a'

function TimeRangeWrapper({ handleClose, videoStreamKey }) {
  const { palette } = useTheme()
  const futuristicClasses = useFuturisticStyles()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const classes = useStyles()
  const dispatch = useDispatch()
  const now = useMemo(() => new Date(), [])

  const playTime = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playTime',
    }),
  )

  const timelineDuration = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timelineDuration',
    }),
  )

  const timeRange = getXDomain(false, null, null, playTime, timelineDuration)

  const duration = useMemo(
    () => moment.duration(moment(timeRange[1]).subtract(moment(timeRange[0]))),
    [timeRange],
  )
  const asSeconds = useMemo(() => duration.as('seconds'), [duration])
  const midPoint = useMemo(
    () => new Date((timeRange[1].getTime() + timeRange[0].getTime()) / 2),
    [timeRange],
  )
  const startAt = useMemo(
    () =>
      moment(midPoint)
        .subtract(1, 'minute')
        .toDate(),
    [midPoint],
  )

  const [error, setError] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState([startAt, midPoint])

  // takes an array of objects, with start/end times
  const disabledIntervals = useMemo(() => [{ start: now, end: timeRange[1] }], [
    now,
    timeRange,
  ])

  const errorHandler = useCallback(({ errorMsg }) => setError(errorMsg), [])

  // this function handles all the logic for:
  // 1) ensuring interval is less than 30 minutes
  // 2) moving the handle if the interval is extended past 30 minutes
  // 3) ensuring the interval doesn't go into the future
  //
  const errorCorrectInterval = useCallback(
    (old, interval) => {
      if (!interval) {
        return
      }

      const start = interval[0]
      const end = interval[1]
      const maxIntervalLength = 30 * 60
      const intervalLengthInSeconds =
        moment(interval[1]).diff(moment(interval[0])) / 1000
      const isEndPastNow = moment(interval[1]).diff(moment(now)) >= 0
      const didLeftHandleMove =
        Math.abs(moment(old[0]).diff(moment(interval[0]))) > 0

      if (intervalLengthInSeconds > maxIntervalLength) {
        if (didLeftHandleMove) {
          // ie. left handle changed position
          setSelectedInterval([
            start,
            moment(start)
              .add(maxIntervalLength, 'seconds')
              .toDate(),
          ])
        } else {
          // right handle changed position
          // eslint-disable-next-line
          if (isEndPastNow) {
            setSelectedInterval([
              start,
              moment(now)
                .subtract(1, 'second')
                .toDate(), // get 1 second before now, so it always shows green
            ])
          } else {
            setSelectedInterval([
              moment(end)
                .subtract(maxIntervalLength, 'seconds')
                .toDate(),
              end,
            ])
          }
        }
      } else if (isEndPastNow) {
        // Can't select into the future
        setSelectedInterval([
          start,
          moment(now)
            .subtract(1, 'second')
            .toDate(), // get 1 second before now, so it always shows green
        ])
      } else {
        setSelectedInterval(interval)
      }
    },
    [now],
  )

  const onChangeCallback = useCallback(
    newSelectedInterval => {
      errorCorrectInterval(selectedInterval, newSelectedInterval)
    },
    [errorCorrectInterval, selectedInterval],
  )

  // propagate to redux
  useEffect(() => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          selectedArchiveInterval: selectedInterval,
        },
      }),
    )
  }, [selectedInterval, dispatch, videoStreamKey])

  // only handle seconds and minutes, since max selected archive time is measured only in minutes (ie. 30 minutes)
  const formatSelectedDuration = useCallback(interval => {
    const durationToFormat = moment.duration(
      moment(interval[1]).subtract(moment(interval[0])),
    )
    let unit
    let showMax = false
    if (durationToFormat.asMinutes() === 30) {
      unit = 'mins'
      showMax = true
    } else if (durationToFormat.asSeconds() < 60) {
      unit = 'secs'
    } else {
      unit = 'mins'
    }
    return (
      <div>
        <span className='am-overline'>Selected: </span>
        <span>
          {durationToFormat.format('mm:ss')} {unit}{' '}
          {showMax && <span className='am-overline'>MAX</span>}
        </span>
      </div>
    )
  }, [])

  // archive / export
  const requestExport = useExportStream()
  const oldTrackId = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'oldTrackId' }),
  )
  const nodeId = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'nodeId' }),
  )
  const streamId = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'streamId' }),
  )
  const selectedArchiveInterval = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'selectedArchiveInterval',
    }),
  )

  const handleExport = useCallback(() => {
    requestExport({
      nodeId,
      videoStreamKey,
      streamId,
      oldTrackId,
      startTs: moment(selectedArchiveInterval[0]).unix() * 1000,
      endTs: moment(selectedArchiveInterval[1]).unix() * 1000,
    })
  }, [
    nodeId,
    videoStreamKey,
    streamId,
    oldTrackId,
    selectedArchiveInterval,
    requestExport,
  ])

  const handleSave = useCallback(() => {
    handleExport()
    handleClose()
  }, [handleExport, handleClose])

  return (
    <>
      <TimeRange
        error={error}
        ticksNumber={asSeconds}
        selectedInterval={selectedInterval}
        timelineInterval={timeRange}
        onUpdateCallback={errorHandler}
        onChangeCallback={onChangeCallback}
        disabledIntervals={disabledIntervals}
      />
      <div
        className={classes.labelContainer}
        style={{ background: 'rgba(0,0,0,.7)' }}
      >
        <div
          className={clsx(
            futuristicClasses.iceSheet,
            flexClasses.row,
            flexClasses.centerAll,
          )}
        >
          <div
            className={clsx(
              'am-subtitle2',
              classes.label,
              flexClasses.column,
              flexClasses.centerAll,
            )}
          >
            <div>
              {moment(selectedInterval[0]).format(timeFormat)} -{' '}
              {moment(selectedInterval[1]).format(timeFormat)}
            </div>
            <div>{formatSelectedDuration(selectedInterval)}</div>
          </div>
          <div
            className={clsx(
              classes.saveButton,
              flexClasses.row,
              flexClasses.centerAll,
            )}
          >
            <Button size='small' variant='outlined' onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,.7)' }}>
          <div
            onClick={handleClose}
            className={clsx(
              futuristicClasses.iceSheet,
              classes.closeButton,
              flexClasses.row,
              flexClasses.centerAll,
              cursorClasses.pointer,
            )}
          >
            <Icon icon='close' size={16} color={palette.grey[500]} />
          </div>
        </div>
      </div>
    </>
  )
}

TimeRangeWrapper.propTypes = propTypes

export default memo(TimeRangeWrapper)

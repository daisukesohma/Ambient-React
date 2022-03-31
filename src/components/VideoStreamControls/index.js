/* eslint-disable no-prototype-builtins, no-console */
/*
   This is the react component which enables Live Streaming
   It can be imported into another react application or called as a method (see index.js)
   author: rodaan@ambient.ai

   How to Use:

      <VideoStreamControls
        accountSlug={accountSlug}
        siteSlug={siteSlug}
        streamId={streamId}
        nodeId={nodeId}
        previewFreq={previewFreq} --> Determines how quickly to pull the preview frame of a stream
        debugMode={false} --> increases speed of preview frame
        autoReconnectAttempts={false} --> Determines if the stream should try to autoconnect [true or false]
        reconnectTimeoutMs={false}
        willAutoLoad={willAutoLoad} --> Will start the video play on load [true or false]
        key={makeUniqueId()} --> Lets react differential it from other similar components
        showPlaybackControls={showPlaybackControls} --> Shows playback controls [true or false]
        initTS={startTS} --> Sets an initTS to start stream at [unixTS in secs] // TODO: FOR BACKWARD COMPATIBILITY. Will need to remove when we migrate to Streaming V2
      />,
*/
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { StreamTypeUpdatedEnum, StreamStateEnum } from 'enums'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchStreamCatalogueDataRequested,
  fetchMetadataRequested,
  setVideoStreamValues,
  cleanupVideoStreamControls,
} from 'redux/slices/videoStreamControls'
import useInterval from 'common/hooks/useInterval'

import getVideoStreamControlsState from '../../selectors/videoStreamControls/getVideoStreamControlsState'
import getCurrUnixTimestamp from 'utils/dateTime/getCurrUnixTimestamp'
import tsAtMidnight from 'utils/dateTime/tsAtMidnight'

import PlaybackControls from './components/PlaybackControls'
import {
  PROGRESS_BAR_WIDTH_INCREMENT,
  PLAY_POINTER_POSITION_INCREMENT_HRS,
  PLAY_POINTER_POSITION_INCREMENT_MINS,
  SECONDS_IN_DAY,
} from './constants'
import { msToUnix } from 'utils'

const propTypes = {
  accountSlug: PropTypes.string.isRequired,
  siteSlug: PropTypes.string.isRequired,
  videoStreamKey: PropTypes.string.isRequired,
  streamId: PropTypes.number,
  nodeId: PropTypes.string,
  initTs: PropTypes.number,
}

const defaultProps = {
  streamId: null,
  nodeId: null,
  initTs: null,
}

const VideoStreamControls = ({
  accountSlug,
  siteSlug,
  videoStreamKey,
  streamId,
  nodeId,
  initTs,
}) => {
  const now = getCurrUnixTimestamp()
  const dispatch = useDispatch()

  const streams = useSelector(state => state.webrtc.streams)
  const videoStreamTS = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'videoStreamTS' }),
  )
  const playPointerPosition = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playPointerPosition',
    }),
  )
  const isZoomIn = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'isZoomIn',
    }),
  )

  const startTimelineTS = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'startTimelineTS',
    }),
  )

  const subtractDays = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'subtractDays',
      defaultValue: 0,
    }),
  )

  const selectedEntities = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'selectedEntities',
    }),
  )

  const ready = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'ready' }),
  )

  const timelineWidth = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'timelineWidth' }),
  )

  const streamData = streams ? streams[videoStreamKey] : null
  const streamState = streamData ? streamData.status : null
  const streamMode = streamData ? streamData.mode : null

  const [datePickerSelection] = useState(now)
  const [progressBarWidth, setProgressBarWidth] = useState(100)

  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  useInterval(() => {
    const positionIncrement = isZoomIn
      ? PLAY_POINTER_POSITION_INCREMENT_MINS
      : PLAY_POINTER_POSITION_INCREMENT_HRS
    if (streamState === StreamStateEnum.PLAYING) {
      if (streamMode === StreamTypeUpdatedEnum.RECORDED) {
        const props = {
          videoStreamTS: videoStreamTS + 1,
          playPointerPosition: playPointerPosition + positionIncrement,
        }
        if (subtractDays === 0) {
          props.timelineWidth = timelineWidth + positionIncrement
        }
        dispatch(
          setVideoStreamValues({
            videoStreamKey,
            props,
          }),
        )
        setProgressBarWidth(progressBarWidth + PROGRESS_BAR_WIDTH_INCREMENT)
      } else {
        // if PLAYING AND LIVE/SPE
        dispatch(
          setVideoStreamValues({
            videoStreamKey,
            props: {
              videoStreamTS: now,
              playPointerPosition: videoStreamTS - tsAtMidnight(),
              endTimelineTS: now,
              timelineWidth: timelineWidth + positionIncrement,
            },
          }),
        )
      }
    }
  }, 1000)

  const isCurrentDay = useCallback(() => {
    return getCurrUnixTimestamp() - datePickerSelection < 3600 * 24
  }, [datePickerSelection])

  useEffect(() => {
    // Create model based on selections
    const getMetadata = (startDateInput, endDate, callback) => {
      const queryString = selectedEntities.map(el => {
        return `${el.type}_${el.label}`
      })

      dispatch(
        fetchMetadataRequested({
          accountSlug,
          siteSlug,
          streamId,
          startTs: startDateInput,
          endTs: endDate,
          videoStreamKey,
          queryString,
        }),
      )
    }
    if (selectedEntities && selectedEntities.length > 0) {
      getMetadata(startTimelineTS, startTimelineTS + SECONDS_IN_DAY, () => {})
    }

    return function cleanup() {
      cleanupVideoStreamControls({
        videoStreamKey,
      })
    }
  }, [
    selectedEntities,
    accountSlug,
    dispatch,
    siteSlug,
    startTimelineTS,
    streamId,
    videoStreamKey,
  ])

  useEffect(() => {
    if (streamMode && streamState) {
      const curr = new Date()
      curr.setHours(0, 0, 0, 0)

      const startTs = msToUnix(curr.getTime()) - 3600 * 24 * subtractDays
      const endTs = isCurrentDay
        ? getCurrUnixTimestamp()
        : startTs + 3600 * 24 - 1

      dispatch(
        fetchStreamCatalogueDataRequested({
          videoStreamKey,
          accountSlug,
          siteSlug,
          streamId,
          startTs,
          endTs,
          isInitial: true,
          initTs,
        }),
      )
    }
  }, [
    streamMode,
    streamState,
    subtractDays,
    initTs,
    accountSlug,
    dispatch,
    isCurrentDay,
    siteSlug,
    streamId,
    videoStreamKey,
  ])

  return (
    <div>
      {ready && (
        <PlaybackControls
          videoStreamKey={videoStreamKey}
          accountSlug={accountSlug}
          siteSlug={siteSlug}
          streamId={streamId}
          nodeId={nodeId}
          progressBarWidth={progressBarWidth}
        />
      )}
    </div>
  )
}

VideoStreamControls.propTypes = propTypes
VideoStreamControls.defaultProps = defaultProps

export default VideoStreamControls

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
import ReIdSelector from 'components/ReId/components/ReIdSelector'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import getCurrUnixTimestamp from 'utils/dateTime/getCurrUnixTimestamp'
import tsAtMidnight from 'utils/dateTime/tsAtMidnight'

import VideoStreamFeed from '../VideoStreamFeed'

import PlaybackControls from './components/PlaybackControls'
import {
  PROGRESS_BAR_WIDTH_INCREMENT,
  PLAY_POINTER_POSITION_INCREMENT_HRS,
  PLAY_POINTER_POSITION_INCREMENT_MINS,
  SECONDS_IN_DAY,
} from './constants'
import { msToUnix } from '../../utils'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  initTs: PropTypes.number,
  isOnAlertModal: PropTypes.bool, // may want to also use isOnVideoModal
  isOnVideoWall: PropTypes.bool, // if false, implicitly isOnVideoModal
  nodeId: PropTypes.string,
  showIndicator: PropTypes.bool,
  showPlaybackControls: PropTypes.bool,
  streamId: PropTypes.number,
  timezone: PropTypes.string,
  videoStreamKey: PropTypes.string.isRequired,
  willAutoLoad: PropTypes.bool,
}

const defaultProps = {
  initTs: null,
  isOnAlertModal: false,
  isOnVideoWall: false,
  nodeId: null,
  showIndicator: true,
  showPlaybackControls: false,
  streamId: null,
  timezone: DEFAULT_TIMEZONE,
  videoStreamKey: 'videoStream',
  willAutoLoad: true,
}

function VideoStreamFeedWithControls({
  accountSlug,
  siteSlug,
  initTs,
  isOnAlertModal,
  isOnVideoWall,
  nodeId,
  showIndicator,
  showPlaybackControls,
  streamId,
  timezone,
  videoStreamKey,
  willAutoLoad,
}) {
  const now = getCurrUnixTimestamp()
  const dispatch = useDispatch()

  const isReIdSearchOpen = useSelector(state => state.reId.isOpen)
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
          timezone,
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
              playPointerPosition: videoStreamTS - tsAtMidnight(0, timezone),
              endTimelineTS: now,
              timelineWidth: timelineWidth + positionIncrement,
              timezone,
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
        timezone,
      }),
    )
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
    timezone,
  ])

  return (
    <>
      <VideoStreamFeed
        accountSlug={accountSlug}
        streamId={streamId}
        nodeId={nodeId}
        videoStreamKey={videoStreamKey}
        willAutoLoad={willAutoLoad}
        isOnVideoWall={isOnVideoWall}
        isOnAlertModal={isOnAlertModal}
        showIndicator={showIndicator}
        showPlaybackControls={showPlaybackControls}
        initTs={initTs}
      />
      {ready && !isOnVideoWall && (
        <PlaybackControls
          videoStreamKey={videoStreamKey}
          accountSlug={accountSlug}
          siteSlug={siteSlug}
          streamId={streamId}
          nodeId={nodeId}
          progressBarWidth={progressBarWidth}
          timezone={timezone}
          initTs={initTs}
        />
      )}
      {ready &&
        !isOnVideoWall &&
        streamMode !== StreamStateEnum.LOADING &&
        isReIdSearchOpen && (
          <div>
            <ReIdSelector account={accountSlug} />
          </div>
        )}
    </>
  )
}

VideoStreamFeedWithControls.propTypes = propTypes
VideoStreamFeedWithControls.defaultProps = defaultProps

export default VideoStreamFeedWithControls

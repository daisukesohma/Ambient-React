import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import moment from 'moment'
// src
import { reset } from 'redux/slices/reId'
import {
  cleanupVideoStreamControls,
  resetSearch,
  setVideoStreamValues,
  initControls,
} from 'redux/slices/videoStreamControls'
import { createNotification } from 'redux/slices/notifications'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import { MixPanelEventEnum } from 'enums'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'

import constants from '../../constants'
import VideoStreamFeed from '../VideoStreamFeed'
import { useVideoStreamV4State } from '../../common/hooks/video'

import VideoControlEffects from './components/VideoControlEffects'
import VideoStreamControlsV2 from './components/VideoStreamControlsV2'

const propTypes = {
  accountSlug: PropTypes.string.isRequired,
  siteSlug: PropTypes.string.isRequired,
  initTs: PropTypes.number,
  isOnAlertModal: PropTypes.bool, // may want to also use isOnVideoModal
  isOnVideoWall: PropTypes.bool, // if false, implicitly isOnVideoModal
  nodeId: PropTypes.string,
  showIndicator: PropTypes.bool,
  showPlaybackControls: PropTypes.bool,
  streamId: PropTypes.number,
  timezone: PropTypes.string,
  userActive: PropTypes.bool,
  videoStreamKey: PropTypes.string,
  willAutoLoad: PropTypes.bool,
  isMobile: PropTypes.bool,
}

const defaultProps = {
  accountSlug: null,
  siteSlug: null,
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
  isMobile: false,
}

const VideoStreamV4 = ({
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
  userActive,
  videoStreamKey,
  willAutoLoad,
  isMobile,
}) => {
  const videoRef = useRef(null)
  const dispatch = useDispatch()
  const videoStyles = {
    height: '100%',
  }
  // If you want to use Redux state for video controls
  const { ready, getMetadata } = useVideoStreamV4State({
    accountSlug,
    siteSlug,
    videoStreamKey,
    streamId,
  })

  const initPlayTs =
    initTs &&
    initTs <= new Date().getTime() / 1000 - constants.NEW_ALERT_RECORDING_LIMIT
      ? initTs - constants.ALERT_EVENT_ADJUSTMENT
      : null

  useEffect(() => {
    // reset reId state on open
    dispatch(reset())
    dispatch(initControls({ videoStreamKey, initTs: initPlayTs, timezone }))
    // set initial start time only on open

    // Sent notification if initTS is too young
    if (
      initTs &&
      initTs >=
        new Date().getTime() / 1000 - constants.NEW_ALERT_RECORDING_LIMIT
    ) {
      dispatch(
        createNotification({
          message:
            'Requested footage not finished recording. Showing live stream.',
        }),
      )
    }

    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          initPlayTs,
          showAlertPanel: initTs && isOnAlertModal,
        },
      }),
    )

    return () => {
      dispatch(cleanupVideoStreamControls({ videoStreamKey }))
      dispatch(resetSearch({ videoStreamKey }))
    }
  }, [dispatch, initTs, initPlayTs, isOnAlertModal, videoStreamKey, timezone])

  return (
    <>
      <VideoStreamFeed
        {...{
          accountSlug,
          siteSlug,
          isOnAlertModal,
          isOnVideoWall,
          nodeId,
          showIndicator,
          showPlaybackControls,
          streamId,
          userActive,
          videoRef,
          videoStreamKey,
          videoStyles,
          willAutoLoad,
          isMobile,
        }}
        initTs={initPlayTs}
      />
      {showPlaybackControls && ready && (
        <VideoStreamControlsV2
          {...{
            accountSlug,
            siteSlug,
            isOnAlertModal,
            isOnVideoWall,
            nodeId,
            streamId,
            timezone,
            userActive,
            videoRef,
            videoStreamKey,
            willAutoLoad,
            getMetadata,
          }}
          initTs={initPlayTs}
        />
      )}
      <VideoControlEffects videoStreamKey={videoStreamKey} />
    </>
  )
}

VideoStreamV4.propTypes = propTypes
VideoStreamV4.defaultProps = defaultProps

export default VideoStreamV4

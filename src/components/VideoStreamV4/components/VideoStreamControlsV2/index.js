import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'
// src
import { useVideoCommands } from 'common/hooks'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import ControlBar from './components/ControlBar'
import KeypressContainer from './components/KeypressContainer'
import { DEFAULT_KEYS, DISABLED_KEYS } from './constants'
import AnimatedTimeline from './components/AnimatedTimeline'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  getMetadata: PropTypes.func,
  initTs: PropTypes.number,
  isOnAlertModal: PropTypes.bool,
  nodeId: PropTypes.string,
  streamId: PropTypes.number,
  timezone: PropTypes.string,
  userActive: PropTypes.bool,
  videoRef: PropTypes.oneOfType([
    PropTypes.func, // Either a function
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }), // Or the instance of a DOM native element (see the note about SSR)
  ]),
  videoStreamKey: PropTypes.string,
}

const defaultProps = {
  initTs: null,
  isOnAlertModal: false,
  timezone: DEFAULT_TIMEZONE,
  userActive: false,
}

const VideoStreamControlsV2 = ({
  accountSlug,
  siteSlug,
  getMetadata,
  initTs,
  isOnAlertModal,
  nodeId,
  streamId,
  timezone,
  videoRef,
  videoStreamKey,
}) => {
  const { stopStream, playStream } = useVideoCommands({
    videoStreamKey,
  })

  const isCalendarOpen = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'modalOpen.calendar',
    }),
  )

  // Disabling timeline keyboard shortcuts
  //
  const isForensicsSearchOpen = useSelector(
    state => state.videoStreamControls.forensicsSearchBarFocused,
  )
  const isAlertCommentFocused = useSelector(
    state => state.videoStreamControls.isAlertCommentFocused,
  )
  const shouldDisableKeys =
    isCalendarOpen || isForensicsSearchOpen || isAlertCommentFocused
  const supportedKeys = shouldDisableKeys ? DISABLED_KEYS : DEFAULT_KEYS
  return (
    <>
      {!isMobile && (
        <AnimatedTimeline
          accountSlug={accountSlug}
          siteSlug={siteSlug}
          getMetadata={getMetadata}
          initTs={initTs}
          nodeId={nodeId}
          streamId={streamId}
          timezone={timezone}
          videoStreamKey={videoStreamKey}
        />
      )}
      <ControlBar
        accountSlug={accountSlug}
        siteSlug={siteSlug}
        getMetadata={getMetadata}
        initTs={initTs}
        isOnAlertModal={isOnAlertModal}
        playStream={playStream}
        stopStream={stopStream}
        streamId={streamId}
        timezone={timezone}
        videoRef={videoRef}
        videoStreamKey={videoStreamKey}
      />
      <KeypressContainer
        handleKeys={supportedKeys}
        videoStreamKey={videoStreamKey}
      />
    </>
  )
}

VideoStreamControlsV2.propTypes = propTypes
VideoStreamControlsV2.defaultProps = defaultProps

export default VideoStreamControlsV2

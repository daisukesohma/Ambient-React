import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'

// src
import { useVideoPlayerCommands } from 'common/hooks/video'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import { StreamStateEnum, StreamTypeUpdatedEnum } from 'enums'

import VideoStreamControlsDesktop from './views/desktop'
// import VideoStreamControlsMobileOnly from './views/mobileOnly'

const propTypes = {
  videoStreamKey: PropTypes.string,
  initTs: PropTypes.number,
}

function ControlBar({ videoStreamKey, initTs, ...props }) {
  const {
    gotoPlaybackTime,
    playerMoveSeconds,
    playerNextFrame,
    playerPauseRecorded,
    playerPlayPause,
    playerPreviousFrame,
    playerUnpauseRecorded,
  } = useVideoPlayerCommands({ videoStreamKey })

  const isPlaying =
    useSelector(getStreamFeedData({ videoStreamKey, property: 'status' })) ===
    StreamStateEnum.PLAYING

  const streamType = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'mode' }),
  )
  const isPlayingLive =
    streamType === StreamTypeUpdatedEnum.NORMAL ||
    streamType === StreamTypeUpdatedEnum.SPE

  return (
    <>
      {!isMobile && (
        <VideoStreamControlsDesktop
          gotoPlaybackTime={gotoPlaybackTime}
          handleNextFrame={playerNextFrame}
          handlePauseRecorded={playerPauseRecorded}
          handlePreviousFrame={playerPreviousFrame}
          handleUnpauseRecorded={playerUnpauseRecorded}
          initTs={initTs}
          isPlaying={isPlaying}
          isPlayingLive={isPlayingLive}
          playerMoveSeconds={playerMoveSeconds} // change name
          playerPauseRecorded={playerPauseRecorded}
          playerPlayPause={playerPlayPause}
          videoStreamKey={videoStreamKey}
          {...props}
        />
      )}
      {/* TODO: Support Mobile Version */}
      {/* <BrowserView> */}
      {/*   <VideoStreamControlsDesktop */}
      {/*     videoStreamKey={videoStreamKey} */}
      {/*     handleNextFrame={handleNextFrame} */}
      {/*     handlePauseRecorded={handlePauseRecorded} */}
      {/*     handlePreviousFrame={handlePreviousFrame} */}
      {/*     handleUnpauseRecorded={handleUnpauseRecorded} */}
      {/*     isPlaying={isPlaying} */}
      {/*     isPlayingLive={isPlayingLive} */}
      {/*     gotoPlaybackTime={gotoPlaybackTime} */}
      {/*     {...props} */}
      {/*   /> */}
      {/* </BrowserView> */}
      {/* <MobileOnlyView> */}
      {/*   <VideoStreamControlsMobileOnly */}
      {/*     videoStreamKey={videoStreamKey} */}
      {/*     handleNextFrame={handleNextFrame} */}
      {/*     handlePauseRecorded={handlePauseRecorded} */}
      {/*     handlePreviousFrame={handlePreviousFrame} */}
      {/*     handleUnpauseRecorded={handleUnpauseRecorded} */}
      {/*     isPlaying={isPlaying} */}
      {/*     isPlayingLive={isPlayingLive} */}
      {/*     gotoPlaybackTime={gotoPlaybackTime} */}
      {/*     {...props} */}
      {/*   /> */}
      {/* </MobileOnlyView> */}
    </>
  )
}

ControlBar.propTypes = propTypes

export default memo(ControlBar)

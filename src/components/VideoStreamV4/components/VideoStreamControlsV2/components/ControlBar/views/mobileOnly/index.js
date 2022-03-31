import React, { useState, useCallback, memo } from 'react'
import { useDispatch } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icon as IconKit } from 'react-icons-kit'
import { paus } from 'react-icons-kit/entypo/paus'
import { thinLeft } from 'react-icons-kit/entypo/thinLeft'
import { thinRight } from 'react-icons-kit/entypo/thinRight'
import { video } from 'react-icons-kit/entypo/video'
import clsx from 'clsx'
import { withOrientationChange } from 'react-device-detect'
// src
import { Icon } from 'ambient_ui'
import { useVideoCommands } from 'common/hooks'

import {
  DEFAULT_SLIDER_VALUE,
  SLIDER_TO_SPEED,
} from '../../components/Slider/PlaySpeedSlider/constants'
import PlaySpeedSlider from '../../components/Slider/PlaySpeedSlider'
import TimeRangeWrapper from '../../components/TimeRangeWrapper'
import LiveRecordedGroup from '../../components/LiveRecordedGroup'
import { setVideoStreamValues } from '../../../../../../../../redux/slices/videoStreamControls'
import TimeBanner from '../../../TimeBanner'

import useStyles from './styles'

const propTypes = {
  isPlaying: PropTypes.bool,
  handleIsPlayingToggle: PropTypes.func,
  isPlayingLive: PropTypes.bool,
  videoStreamKey: PropTypes.string,
  // videoRef,
  handleUnpauseRecorded: PropTypes.func,
  handlePauseRecorded: PropTypes.func,
  handleModeButton: PropTypes.func,
  handleNextFrame: PropTypes.func,
  handlePreviousFrame: PropTypes.func,
  isPortrait: PropTypes.bool,
  handleGoRecorded: PropTypes.func,
  timezone: PropTypes.string,
  initTs: PropTypes.number,
}
// FIND OUT WHAT THe correct states of state machine are
function VideoStreamControlsMobileOnly({
  isPlaying,
  handleIsPlayingToggle,
  isPlayingLive,
  videoStreamKey,
  // videoRef,
  // setSpeed,
  handleUnpauseRecorded,
  handlePauseRecorded,
  handleModeButton,
  handleNextFrame,
  handlePreviousFrame,
  isPortrait, // device detect
  handleGoRecorded,
  timezone,
  initTs,
}) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const classes = useStyles({ isPlaying })
  const [speedLabel, setSpeedLabel] = useState(
    SLIDER_TO_SPEED[DEFAULT_SLIDER_VALUE].readable,
  )
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false)

  const { devicePause, deviceChangeSpeed } = useVideoCommands({
    videoStreamKey,
  })

  const handleSlider = (event, newValue) => {
    // setSpeed(SLIDER_TO_SPEED[newValue].speed)
    deviceChangeSpeed(SLIDER_TO_SPEED[newValue].speed)
    setSpeedLabel(SLIDER_TO_SPEED[newValue].readable)
  }

  const handlePlayOrPause = useCallback(() => {
    if (isPlaying) {
      handlePauseRecorded()
    } else {
      handleUnpauseRecorded()
    }
  }, [isPlaying, handlePauseRecorded, handleUnpauseRecorded])

  const handleToggleClip = useCallback(() => {
    if (!isTimeRangeOpen) {
      devicePause()
      setIsTimeRangeOpen(true)
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: { isPlaying: false },
        }),
      )
    } else {
      // deviceUnpause()
      setIsTimeRangeOpen(false)
      // setIsPlaying(true)
    }
  }, [devicePause, isTimeRangeOpen, dispatch, videoStreamKey])

  const fadeIn = !isPlaying
  return (
    <div id='video-control-bar-mobile' className={classes.fullScreenRoot}>
      <div style={{ position: 'absolute', bottom: 4, left: 8 }}>
        <LiveRecordedGroup
          isPlayingLive={isPlayingLive}
          videoStreamKey={videoStreamKey}
          initTs={initTs}
        />
      </div>
      <TimeBanner videoStreamKey={videoStreamKey} timezone={timezone} />
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% - 100)',
          width: 200,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className={clsx(classes.invisible, { fadeIn })}
          style={{
            color: palette.primary[500],
            opacity: isPlaying ? 0 : 1,
            marginRight: 12,
          }}
          onClick={handlePreviousFrame}
        >
          <IconKit icon={thinLeft} size={18} />
        </div>
        <div onClick={handlePlayOrPause} style={{ marginTop: 4 }}>
          {isPlaying ? (
            <div style={{ color: palette.primary[500] }}>
              <IconKit icon={paus} size={24} />
            </div>
          ) : (
            <Icon icon='play' color={palette.primary[500]} size={24} />
          )}
        </div>
        <div
          className={clsx(classes.invisible, { fadeIn })}
          style={{
            color: palette.primary[500],
            opacity: isPlaying ? 0 : 1,
            marginLeft: 8,
          }}
          onClick={handleNextFrame}
        >
          <IconKit icon={thinRight} size={18} />
        </div>
      </div>
      {!isPlayingLive && (
        <div
          onClick={handleIsPlayingToggle}
          className={clsx(
            isPortrait
              ? classes.playSpeedContainerPortrait
              : classes.playSpeedContainerBase,
          )}
        >
          <div>
            <PlaySpeedSlider onChange={handleSlider} speedLabel={speedLabel} />
          </div>
        </div>
      )}
      {isTimeRangeOpen && (
        <div style={{ position: 'absolute', bottom: 40, width: '100%' }}>
          <TimeRangeWrapper videoStreamKey={videoStreamKey} />
        </div>
      )}
      {!isPlaying && (
        <div
          className={clsx(classes.invisible, { fadeIn })}
          style={{
            position: 'absolute',
            bottom: 16,
            left: '60%',
            color: isTimeRangeOpen
              ? palette.primary[500]
              : palette.primary[200],
            opacity: isPlaying ? 0 : 1,
            marginLeft: 8,
          }}
          onClick={handleToggleClip}
        >
          <IconKit icon={video} size={18} />
        </div>
      )}
    </div>
  )
}

VideoStreamControlsMobileOnly.propTypes = propTypes

export default memo(withOrientationChange(VideoStreamControlsMobileOnly))

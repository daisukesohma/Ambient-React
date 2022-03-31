import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'react-icons-kit'
import { pause } from 'react-icons-kit/fa/pause'
import { play } from 'react-icons-kit/fa/play'
import { StreamStateEnum } from 'enums'
import { updateStreamStatus } from 'redux/slices/webrtc'
import { useSelector, useDispatch } from 'react-redux'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
}

const PlayPauseButton = ({ videoStreamKey }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const streamState = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'status' }),
  )

  const stopStream = useCallback(() => {
    dispatch(
      updateStreamStatus({ videoStreamKey, status: StreamStateEnum.STOPPED }),
    )
  }, [dispatch, videoStreamKey])

  const playStream = useCallback(() => {
    dispatch(
      updateStreamStatus({ videoStreamKey, status: StreamStateEnum.PLAYING }),
    )
  }, [dispatch, videoStreamKey])

  const handlePlayPauseButton = useCallback(() => {
    if (streamState === StreamStateEnum.PLAYING) {
      stopStream()
    } else if (streamState === StreamStateEnum.STOPPED) {
      playStream()
    }
  }, [streamState, stopStream, playStream])

  return (
    <div className='play-pause'>
      <button
        id='play-pause'
        className='playback-button'
        type='button'
        data-state='play'
        onClick={handlePlayPauseButton}
      >
        <span style={{ color: palette.grey[600], paddingRight: 5 }}>
          {streamState === StreamStateEnum.PLAYING ? (
            <Icon icon={pause} />
          ) : (
            <Icon icon={play} />
          )}
        </span>
      </button>
    </div>
  )
}

PlayPauseButton.propTypes = propTypes

export default PlayPauseButton

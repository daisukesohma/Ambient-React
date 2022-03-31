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
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { useUpdateArchivalStreamTs } from 'webrtc/hooks'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
}

const PlayPauseButton = ({ videoStreamKey }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const updateArchivalStreamTs = useUpdateArchivalStreamTs()
  const streamState = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'status' }),
  )
  const nodeId = useSelector(
    getStreamFeedData({
      videoStreamKey,
      property: 'nodeId',
    }),
  )
  const streamId = useSelector(
    getStreamFeedData({
      videoStreamKey,
      property: 'streamId',
    }),
  )
  const oldTrackId = useSelector(
    getStreamFeedData({
      videoStreamKey,
      property: 'oldTrackId',
    }),
  )
  const videoStreamTS = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'videoStreamTS' }),
  )

  const stopStream = useCallback(() => {
    dispatch(
      updateStreamStatus({ videoStreamKey, status: StreamStateEnum.STOPPED }),
    )
  }, [dispatch, videoStreamKey])

  const playStream = useCallback(() => {
    updateArchivalStreamTs({
      nodeId,
      videoStreamKey,
      streamId,
      oldTrackId,
      ts: videoStreamTS * 1000,
    })
    dispatch(
      updateStreamStatus({ videoStreamKey, status: StreamStateEnum.PLAYING }),
    )
  }, [
    dispatch,
    videoStreamKey,
    nodeId,
    oldTrackId,
    videoStreamTS,
    streamId,
    updateArchivalStreamTs,
  ])

  const handlePlayPauseButton = useCallback(() => {
    if (streamState === StreamStateEnum.PLAYING) {
      stopStream()
    } else {
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

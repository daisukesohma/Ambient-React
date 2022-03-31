import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { StreamTypeUpdatedEnum } from 'enums'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import { circle } from 'react-icons-kit/fa/circle'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import { useRequestStream, useHangUpStream } from 'webrtc/hooks'

import { presetVideoControlsState } from 'utils/initializeVideoControlsState'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
}

const LiveIncidentButton = ({ videoStreamKey }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const streamMode = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'mode' }),
  )
  const nodeId = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'nodeId' }),
  )
  const streamId = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'streamId' }),
  )
  const newTrackId = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'newTrackId' }),
  )
  const initTs = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'initTs' }),
  )
  const hangUpStream = useHangUpStream()
  const requestStream = useRequestStream()

  const onClick = useCallback(() => {
    hangUpStream({ videoStreamKey, nodeId, newTrackId })

    const streamRequestProps = {
      nodeId,
      videoStreamKey,
      streamId,
      mode: streamMode,
    }
    const videoProps = {}

    // Toggle between incident time fragment and live video
    if (initTs && streamMode !== StreamTypeUpdatedEnum.RECORDED) {
      videoProps.initTs = initTs
      streamRequestProps.ts = initTs * 1000
      streamRequestProps.mode = StreamTypeUpdatedEnum.RECORDED
    }

    requestStream(streamRequestProps)
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: presetVideoControlsState(videoProps),
      }),
    )
  }, [
    videoStreamKey,
    hangUpStream,
    newTrackId,
    nodeId,
    requestStream,
    streamId,
    dispatch,
    initTs,
    streamMode,
  ])

  const [liveIconColor, liveDisabled] = useMemo(() => {
    return streamMode === StreamTypeUpdatedEnum.RECORDED
      ? [palette.error.main, false]
      : [palette.primary.main, false]
  }, [streamMode])

  return (
    <div className='live-button'>
      <button
        id='live'
        style={{ display: 'flex' }}
        className='playback-button playback-live-indicator'
        type='button'
        onClick={onClick}
        disabled={liveDisabled}
      >
        <span style={{ color: liveIconColor, paddingRight: 5 }}>
          <Icon icon={circle} />
        </span>
        <span
          id='live-button-text'
          className={clsx('am-caption', 'buttonText')}
        >
          {initTs && streamMode !== StreamTypeUpdatedEnum.RECORDED
            ? 'Incident'
            : 'Live'}
        </span>
      </button>
    </div>
  )
}

LiveIncidentButton.propTypes = propTypes

export default LiveIncidentButton

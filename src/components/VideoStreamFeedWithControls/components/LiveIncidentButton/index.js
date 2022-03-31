import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { StreamTypeUpdatedEnum } from 'enums'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import { circle } from 'react-icons-kit/fa/circle'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import { setVideoStreamFeedValues } from 'redux/slices/webrtc'

import { presetVideoControlsState } from '../../../../utils/initializeVideoControlsState'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  initTs: PropTypes.number,
}
const defaultProps = {
  initTs: null,
}

const LiveIncidentButton = ({ videoStreamKey, timezone, initTs }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const streamMode = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'mode' }),
  )
  const streamV2Type = useSelector(state => state.settings.streamV2Type)

  const onClick = useCallback(() => {
    const videoProps = { timezone }
    // Toggle between incident time fragment and live video
    if (streamMode === StreamTypeUpdatedEnum.RECORDED) {
      dispatch(
        setVideoStreamFeedValues({
          videoStreamKey,
          props: { mode: streamV2Type },
        }),
      )
    } else if (initTs) {
      dispatch(
        setVideoStreamFeedValues({
          videoStreamKey,
          props: { mode: StreamTypeUpdatedEnum.RECORDED },
        }),
      )
    }
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: presetVideoControlsState(videoProps),
      }),
    )
  }, [videoStreamKey, timezone, streamV2Type, dispatch, initTs, streamMode])

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

LiveIncidentButton.defaultProps = defaultProps
LiveIncidentButton.propTypes = propTypes

export default LiveIncidentButton

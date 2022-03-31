import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import { PlaybackStatusEnum } from 'enums'
import IndicatorStatusBadge from 'components/IndicatorStatusBadge'

/*
  StatusButton is the "Live" status button indicator
  This button sits inside the ControlBar and uses a modded version of the StatusIndicatorButton
  It also has an onClick wrapper for going "live"
*/

const StatusButton = ({
  darkMode,
  liveButtonFunction,
  isLiveDisabled,
  playbackStatus,
  initTS,
}) => {
  const { palette } = useTheme()
  // Utility function for Live button style and text - can make hook if desired
  const getIndicatorStatusPulseColor = status => {
    let pulseColor = palette.grey[500]
    const RED = palette.error.main
    if (status === PlaybackStatusEnum.LIVE) {
      pulseColor = RED
    } else if (status === PlaybackStatusEnum.PLAYING && initTS) {
      pulseColor = RED
    }
    return pulseColor
  }

  const getIndicatorText = status => {
    let text = 'Live'
    if (status === PlaybackStatusEnum.LIVE && initTS) {
      text = 'To Incident'
    }
    return text
  }

  return (
    <div
      id='live-button'
      style={{
        marginTop: -12,
        userSelect: 'none',
      }}
    >
      <div onClick={liveButtonFunction} disabled={isLiveDisabled}>
        <IndicatorStatusBadge
          status={getIndicatorText(playbackStatus)}
          display='flex'
          variant='filled'
          pulseColor={getIndicatorStatusPulseColor(playbackStatus)}
          pulseRippleColor='white'
          style={{
            position: 'relative',
            background: 'transparent',
          }}
          fontStyle={{ color: darkMode ? 'white' : 'black' }}
        />
      </div>
    </div>
  )
}

StatusButton.defaultProps = {
  darkMode: false,
  liveButtonFunction: () => {},
  isLiveDisabled: false,
  playbackStatus: PlaybackStatusEnum.LIVE,
  initTS: null,
}

StatusButton.propTypes = {
  darkMode: PropTypes.bool,
  liveButtonFunction: PropTypes.func,
  isLiveDisabled: PropTypes.bool,
  playbackStatus: PropTypes.string,
  initTS: PropTypes.number,
}

export default StatusButton

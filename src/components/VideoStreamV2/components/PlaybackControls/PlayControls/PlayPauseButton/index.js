import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { Icons } from 'ambient_ui'

import KeyShortcutDisplay from '../../KeyShortcutDisplay'
import Tooltip from '../../../../../Tooltip'
import { PlaybackStatusEnum } from '../../../../../../enums'

const { Pause, Play } = Icons
const SIZE = 24

const PlayPauseButton = ({
  darkMode,
  handlePlayPauseButton,
  playbackStatus,
}) => {
  const { palette } = useTheme()
  const color = darkMode ? palette.common.white : palette.grey[700]
  let button = <Pause stroke={color} height={SIZE} width={SIZE} />

  if (playbackStatus === PlaybackStatusEnum.PAUSED) {
    button = <Play stroke={color} height={SIZE} width={SIZE} />
  }
  const contentName =
    playbackStatus === PlaybackStatusEnum.PAUSED ? 'Play' : 'Pause'

  const content = (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {contentName}
      <KeyShortcutDisplay keyName='space' />
    </div>
  )

  return (
    <Tooltip content={content}>
      <div
        id='play-pause'
        onClick={handlePlayPauseButton}
        style={{ cursor: 'pointer', padding: '0 10px' }}
      >
        {button}
      </div>
    </Tooltip>
  )
}

PlayPauseButton.defaultProps = {
  darkMode: false,
  handlePlayPauseButton: () => {},
  playbackStatus: PlaybackStatusEnum.LIVE,
}

PlayPauseButton.propTypes = {
  darkMode: PropTypes.bool,
  handlePlayPauseButton: PropTypes.func,
  playbackStatus: PropTypes.string,
}

export default PlayPauseButton

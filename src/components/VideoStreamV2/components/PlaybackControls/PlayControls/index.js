import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'react-icons-kit'
import { arrowLeft } from 'react-icons-kit/feather/arrowLeft'
import { arrowRight } from 'react-icons-kit/feather/arrowRight'
import { Icons } from 'ambient_ui'

import KeyShortcutDisplay from '../KeyShortcutDisplay'
import Tooltip from 'components/Tooltip'

import PlayPauseButton from './PlayPauseButton'

const { Back10, Forward10 } = Icons
const SIZE = 24

const PlayControls = ({
  darkMode,
  handlePlayPauseButton,
  handleStepInSeconds,
  playbackStatus,
}) => {
  const { palette } = useTheme()
  const color = darkMode ? palette.common.white : palette.grey[700]
  const backContent = (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      Back 10s
      <KeyShortcutDisplay>
        <Icon icon={arrowLeft} />
      </KeyShortcutDisplay>
    </div>
  )
  const fwdContent = (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      Forward 10s
      <KeyShortcutDisplay>
        <Icon icon={arrowRight} />
      </KeyShortcutDisplay>
    </div>
  )

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', zIndex: 5 }}>
        <Tooltip content={backContent}>
          <div
            onClick={() => {
              handleStepInSeconds(-10)
            }}
            style={{ cursor: 'pointer' }}
          >
            <Back10 width={SIZE} height={SIZE} stroke={color} fill={color} />
          </div>
        </Tooltip>
        <PlayPauseButton
          darkMode={darkMode}
          playbackStatus={playbackStatus}
          handlePlayPauseButton={handlePlayPauseButton}
        />
        <Tooltip content={fwdContent}>
          <div
            onClick={() => {
              handleStepInSeconds(10)
            }}
            style={{ cursor: 'pointer' }}
          >
            <Forward10 width={SIZE} height={SIZE} stroke={color} fill={color} />
          </div>
        </Tooltip>
      </div>
    </>
  )
}

PlayControls.defaultProps = {
  darkMode: false,
  handlePlayPauseButton: () => {},
  handleStepInSeconds: () => {},
  playbackStatus: '',
}

PlayControls.propTypes = {
  darkMode: PropTypes.bool,
  handlePlayPauseButton: PropTypes.func,
  handleStepInSeconds: PropTypes.func,
  playbackStatus: PropTypes.string,
}
export default PlayControls

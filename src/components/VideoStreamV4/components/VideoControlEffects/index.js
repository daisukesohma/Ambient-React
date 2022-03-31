import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
// src
import { Icons } from 'ambient_ui'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import ControlEffect from './components/ControlEffect'

const propTypes = {
  videoStreamKey: PropTypes.string,
}

function VideoControlEffects({ videoStreamKey }) {
  const { palette } = useTheme()
  const iconName = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'effectIconName',
    }),
  )

  const key = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'effectIconKey',
    }),
  )

  // early return
  if (!iconName) return <></>

  const ControlEffectIcon = Icons[iconName]

  return (
    <ControlEffect key={key + iconName}>
      <ControlEffectIcon
        stroke={palette.grey[500]}
        fill={palette.grey[500]}
        height={40}
        width={40}
      />
    </ControlEffect>
  )
}

VideoControlEffects.propTypes = propTypes
export default VideoControlEffects

// getControlIconEffectName = seconds => {
//   if (seconds === -10) return VideoIconControlEffectEnum.BACK10
//   if (seconds === -5) return VideoIconControlEffectEnum.BACK5
//   if (seconds === -1) return VideoIconControlEffectEnum.BACK1
//   if (seconds < 0) return VideoIconControlEffectEnum.BACK
//   if (seconds === 10) return VideoIconControlEffectEnum.FORWARD10
//   if (seconds === 5) return VideoIconControlEffectEnum.FORWARD5
//   if (seconds === 1) return VideoIconControlEffectEnum.FORWARD1
//   if (seconds > 0) return VideoIconControlEffectEnum.FORWARD
//   return VideoIconControlEffectEnum.FORWARD
// }
//

import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { Icons } from 'ambient_ui'

const { Play } = Icons

const HoverPlay = ({ mouseIndicatorX, isHoveringOnTimeline }) => {
  const { palette } = useTheme()
  const xPos = mouseIndicatorX - 75
  const yPos = 15
  const strokeColorPlayIcon = isHoveringOnTimeline
    ? palette.grey[700]
    : 'transparent'
  const strokeColorCircle = isHoveringOnTimeline
    ? palette.grey[800]
    : 'transparent'
  const fillColorCircle = isHoveringOnTimeline
    ? palette.common.white
    : 'transparent'

  return (
    <svg>
      <g transform={`translate(${xPos}, ${yPos})`}>
        <circle
          cx={8}
          cy={10}
          r={10}
          fill={fillColorCircle}
          stroke={strokeColorCircle}
          strokeWidth={2}
        />
        <Play stroke={strokeColorPlayIcon} height={20} width={20} />
      </g>
    </svg>
  )
}

HoverPlay.defaultProps = {
  mouseIndicatorX: 0,
  isHoveringOnTimeline: false,
}

HoverPlay.propTypes = {
  mouseIndicatorX: PropTypes.number,
  isHoveringOnTimeline: PropTypes.bool,
}

export default HoverPlay

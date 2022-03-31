import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import {
  HOVERLINE_HEIGHT,
  HOVERLINE_WIDTH,
  PLAYHEAD_BALL_RADIUS,
  THIN_TIMELINE_HEIGHT,
} from '../constants'

const Hoverline = ({
  hoverIndicatorX,
  isHoveringOnTimeline,
  type,
  windowOffset,
}) => {
  const { palette } = useTheme()
  const xPos = hoverIndicatorX - windowOffset
  const yMid = THIN_TIMELINE_HEIGHT / 2
  const hoverPlayheadBall = (
    <circle
      r={PLAYHEAD_BALL_RADIUS}
      cy={yMid}
      fill={isHoveringOnTimeline ? palette.error.main : 'transparent'}
      opacity={0.75}
    />
  )

  const hoverLine = (
    <rect
      id='hoverline'
      fill={isHoveringOnTimeline ? palette.primary.main : 'transparent'}
      height={HOVERLINE_HEIGHT + 10}
      width={HOVERLINE_WIDTH}
      y={-10}
    />
  )

  const hoverDisplay = type === 'line' ? hoverLine : hoverPlayheadBall

  return (
    <g className='hoverline' transform={`translate(${xPos})`}>
      {hoverDisplay}
    </g>
  )
}

Hoverline.defaultProps = {
  hoverIndicatorX: 0,
  isHoveringOnTimeline: false,
  type: 'ball',
  windowOffset: 0,
}

Hoverline.propTypes = {
  hoverIndicatorX: PropTypes.number,
  isHoveringOnTimeline: PropTypes.bool,
  type: PropTypes.oneOf(['ball', 'line']),
  windowOffset: PropTypes.number,
}

export default Hoverline

import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import {
  PLAYHEAD_BELOW_HEIGHT,
  PLAYHEAD_WIDTH,
  PLAYHEAD_BALL_RADIUS,
  THIN_TIMELINE_HEIGHT,
} from '../constants'

const Playhead = ({
  playpointerPosition,
  showPlayheadBall,
  showPlayheadLine,
}) => {
  const { palette } = useTheme()
  const yMid = THIN_TIMELINE_HEIGHT / 2

  const playheadBall = (
    <circle r={PLAYHEAD_BALL_RADIUS} cy={yMid} fill={palette.error.main} />
  )

  const playheadLineHeight = THIN_TIMELINE_HEIGHT + PLAYHEAD_BELOW_HEIGHT
  const playheadLine = (
    <rect
      className='playpointer-line'
      fill={palette.error.main}
      width={PLAYHEAD_WIDTH}
      height={playheadLineHeight}
      x={-PLAYHEAD_WIDTH}
    />
  )

  return (
    <g className='playpointer' transform={`translate(${playpointerPosition})`}>
      {showPlayheadLine && playheadLine}
      {showPlayheadBall && playheadBall}
    </g>
  )
}

Playhead.defaultProps = {
  playpointerPosition: null,
  showPlayheadBall: true,
  showPlayheadLine: true,
}

Playhead.propTypes = {
  playpointerPosition: PropTypes.number,
  showPlayheadBall: PropTypes.bool,
  showPlayheadLine: PropTypes.bool,
}

export default Playhead

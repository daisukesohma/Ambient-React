import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const TIME_TEXT_WIDTH = 56
const TIME_CONTAINER_WIDTH = 64
const MARGIN = (TIME_CONTAINER_WIDTH - TIME_TEXT_WIDTH) / 2
const TIME_HEIGHT = 22
const TIME_X = TIME_CONTAINER_WIDTH / 2 + 4
const TIME_Y = 38

const ClipTimeDisplay = ({ time }) => {
  const { palette } = useTheme()
  return (
    <g
      id='clip-time-display-container'
      transform={`translate(${-TIME_X},${-TIME_Y})`}
    >
      <rect
        fill={palette.common.black}
        width={TIME_CONTAINER_WIDTH}
        height={TIME_HEIGHT}
      />
      <text
        className='start label time'
        height={TIME_HEIGHT}
        fill={palette.grey[100]}
        y={16}
        x={MARGIN}
      >
        {time}
      </text>
    </g>
  )
}

ClipTimeDisplay.defaultProps = {
  time: '',
}
ClipTimeDisplay.propTypes = {
  time: PropTypes.string,
}

export default ClipTimeDisplay

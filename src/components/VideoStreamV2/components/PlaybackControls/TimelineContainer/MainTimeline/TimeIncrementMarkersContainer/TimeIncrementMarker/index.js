import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

const TimeIncrementMarker = ({ darkMode, xPos, label, position, type }) => {
  const { palette } = useTheme()
  const isLightColor = darkMode || position === 'overlay'
  const yOffset = 4

  const getColor = (isLightColor, type) => {
    if (isLightColor) {
      return palette.common.white
    }
    if (type === 'major') {
      return palette.grey[600]
    }
    return palette.grey[500]
  }

  const markHeight = type === 'major' ? 12 : 8
  const markWidth = type === 'major' ? 2 : 1
  const markColor = getColor(isLightColor, type)

  const textColor = isLightColor ? palette.common.white : palette.grey[700]

  const textY = 18
  const textDy = '.6em'

  return (
    <g
      className={`tick-${type}`}
      opacity='1'
      transform={`translate(${xPos}, ${yOffset})`}
    >
      <line stroke={markColor} y2={markHeight} strokeWidth={markWidth} />
      {label && (
        <text
          y={textY}
          dy={textDy}
          fill={textColor}
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      )}
    </g>
  )
}

TimeIncrementMarker.defaultProps = {
  darkMode: false,
  xPos: null,
  label: null,
  position: null,
  ts: null,
  type: 'major',
}

TimeIncrementMarker.propTypes = {
  darkMode: PropTypes.bool,
  xPos: PropTypes.number,
  label: PropTypes.node,
  position: PropTypes.number,
  ts: PropTypes.number,
  type: PropTypes.oneOf(['major', 'minor']),
}

export default TimeIncrementMarker

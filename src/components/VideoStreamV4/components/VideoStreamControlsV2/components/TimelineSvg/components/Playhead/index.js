import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import { TIMELINE } from '../../../../constants'

const propTypes = {
  x: PropTypes.number,
  labelWidth: PropTypes.number,
  opacity: PropTypes.number,
  color: PropTypes.string,
  label: PropTypes.string,
  textOpacity: PropTypes.number,
}

const Playhead = ({ x, label, labelWidth, color, opacity, textOpacity }) => {
  const { palette } = useTheme()
  return (
    <g opacity={opacity}>
      <rect
        id='playhead'
        x={x}
        y={30}
        width={TIMELINE.playhead.width}
        height={TIMELINE.timeline.height}
        fill={color}
      />
      <rect
        id='playhead-time-background'
        x={x}
        y={3.5}
        width={labelWidth}
        height={16}
        transform={`translate(-${labelWidth / 2})`} // center it on x, width/2
        fill={palette.grey[900]}
        stroke={color}
        strokeWidth={0.5}
        rx={3}
      />
      <text
        id='playhead-time'
        x={x}
        y={15.5}
        className='am-overline'
        fill='white' // color
        textAnchor='middle'
        opacity={textOpacity}
        style={{ fontSize: 12 }}
      >
        {label}
      </text>
    </g>
  )
}

Playhead.propTypes = propTypes

export default Playhead

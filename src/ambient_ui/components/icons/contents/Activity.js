import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
// src
import SvgWrapper from './SvgWrapper'

Activity.defaultProps = {
  width: 24,
  height: 24,
}

Activity.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Activity({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <g
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
      </g>
    </SvgWrapper>
  )
}

import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Video.defaultProps = {
  width: 24,
  height: 24,
}

Video.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Video({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <g
        viewBox='0 0 24 24'
        fill='none'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polygon points='23 7 16 12 23 17 23 7' />
        <rect x='1' y='5' width='15' height='14' rx='2' ry='2' />
      </g>
    </SvgWrapper>
  )
}

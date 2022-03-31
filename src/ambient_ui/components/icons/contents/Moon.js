import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Moon({ width, height, stroke, fill }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <g
        fill={fill}
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
      </g>
    </SvgWrapper>
  )
}

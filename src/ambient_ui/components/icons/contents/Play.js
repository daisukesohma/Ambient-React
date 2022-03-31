import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Play.defaultProps = {
  width: 24,
  height: 24,
}

export default function Play({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <g
        fill='none'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M6 4L18 12L6 20V4Z' fill={stroke || palette.text.primary} />
      </g>
    </SvgWrapper>
  )
}

import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Laptop({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <rect
        x='6'
        y='5'
        width='12'
        height='9'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M6 14L4 19H20L18 14'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinejoin='round'
      />
      <rect
        x='11'
        y='16'
        width='2'
        height='2'
        fill={stroke || palette.text.primary}
      />
    </SvgWrapper>
  )
}

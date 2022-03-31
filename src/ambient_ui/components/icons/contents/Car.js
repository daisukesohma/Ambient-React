import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Car({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <rect
        x='4'
        y='10'
        width='16'
        height='7'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M18 5H6L4 10H20L18 5Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinejoin='round'
      />
      <path
        d='M20 16V19'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4 17V19'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='7.5'
        cy='13.5'
        r='1.5'
        fill={stroke || palette.text.primary}
      />
      <circle
        cx='16.5'
        cy='13.5'
        r='1.5'
        fill={stroke || palette.text.primary}
      />
    </SvgWrapper>
  )
}

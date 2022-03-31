/* eslint-disable */
import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Calendar({ width, height, stroke, ...props }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height} {...props}>
      <rect
        x='4'
        y='6'
        width='16'
        height='14'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <line
        x1='3'
        y1='12'
        x2='21'
        y2='12'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M9 3V9'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M15 3V9'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

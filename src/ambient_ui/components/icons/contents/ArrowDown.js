import React from 'react'
import { useTheme } from '@material-ui/core/styles'
// src
import SvgWrapper from './SvgWrapper'

export default function ArrowDown({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M7 10L12 15L17 10'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

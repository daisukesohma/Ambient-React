import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Grid({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M20 14V20H14V14H20Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M10 14V20H4V14H10Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M10 4V10H4V4H10Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M20 4V10H14V4H20Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

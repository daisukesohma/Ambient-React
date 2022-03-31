import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Chair({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M6 3.5L6.89411 13H19'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M9 13L8 20'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M17 13V20'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

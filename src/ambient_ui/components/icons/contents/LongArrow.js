import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function LongArrow({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <line
        x1='11.6152'
        y1='4'
        x2='11.6152'
        y2='21'
        stroke={stroke || palette.text.primary}
      />
      <path
        d='M16.3162 8.78711L11.6581 4.12904L7.00003 8.78711'
        stroke={stroke || palette.text.primary}
      />
    </SvgWrapper>
  )
}

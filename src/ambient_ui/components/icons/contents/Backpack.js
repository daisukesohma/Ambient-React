import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Backpack({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M19 7H5V13H19V7Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinejoin='round'
      />
      <path
        d='M6 14V20H18V14'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M12 10V16'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M9 3V7'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M15 3V7'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

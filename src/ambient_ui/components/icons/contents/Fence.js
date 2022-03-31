import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Fence({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M3 8L21 8'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M3 18L21 18'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M6 5V21'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M12 3V21'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M18 5V21'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

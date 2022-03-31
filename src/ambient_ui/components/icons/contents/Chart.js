import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Chart({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M12 21V10'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M19 21V3'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M5 21V15'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

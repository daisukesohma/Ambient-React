import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Circle({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M9.00003 17.0001C13.4144 17.0001 17.0001 13.4144 17.0001 9.00003C17.0001 4.58565 13.4144 1 9.00003 1C4.58565 1 1 4.58565 1 9.00003C1 13.4144 4.58565 17.0001 9.00003 17.0001Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

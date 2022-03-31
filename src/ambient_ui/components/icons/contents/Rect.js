import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Rect({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M1 1H17.0001V17.0001H1V1Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

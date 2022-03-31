import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Bike({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M11.8571 17V14.1111L9 11.8889L12.4286 8L16 11H17'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='14.5'
        cy='5.5'
        r='1.5'
        fill={stroke || palette.text.primary}
      />
      <circle
        cx='17.5'
        cy='16.5'
        r='2.5'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <circle
        cx='6.5'
        cy='16.5'
        r='2.5'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

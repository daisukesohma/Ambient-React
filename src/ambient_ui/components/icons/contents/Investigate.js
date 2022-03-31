import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Investigate({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M10.8304 17.6607C14.6027 17.6607 17.6607 14.6027 17.6607 10.8304C17.6607 7.05805 14.6027 4 10.8304 4C7.05805 4 4 7.05805 4 10.8304C4 14.6027 7.05805 17.6607 10.8304 17.6607Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M16 16L20 20'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

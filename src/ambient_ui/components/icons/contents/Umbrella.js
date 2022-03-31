import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Umbrella({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M16.3636 17.6C16.3636 18.2365 16.1338 18.847 15.7246 19.2971C15.3154 19.7471 14.7605 20 14.1818 20C13.6032 20 13.0482 19.7471 12.639 19.2971C12.2299 18.847 12 18.2365 12 17.6V12M20 12C19.81 9.81086 18.8851 7.7782 17.4058 6.29893C15.9266 4.81966 13.9992 4 12 4C10.0008 4 8.07343 4.81966 6.59416 6.29893C5.11489 7.7782 4.18997 9.81086 4 12H20Z'
        stroke={stroke || palette.text.primary}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

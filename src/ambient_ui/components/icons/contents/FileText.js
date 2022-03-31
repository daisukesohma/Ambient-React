import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function FileText({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M6 4H13.6163L19 8.84536V19.2C19 19.3761 18.9232 19.5694 18.7452 19.7295C18.5638 19.8928 18.2972 20 18 20H6C5.70277 20 5.43616 19.8928 5.25475 19.7295C5.07681 19.5694 5 19.3761 5 19.2V4.8C5 4.62386 5.07682 4.43064 5.25475 4.2705C5.43616 4.10723 5.70277 4 6 4Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13 4V9H19'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M16 12H8'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M16 16H8'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

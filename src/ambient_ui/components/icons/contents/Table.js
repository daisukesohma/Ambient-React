import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Table({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <g clipPath='url(#clip0)'>
        <path
          d='M4 9L12 4.55556L20 9L12 13.4444L4 9Z'
          stroke={stroke || palette.text.primary}
          strokeWidth='2'
          strokeLinejoin='round'
        />
        <path
          d='M4 9V18'
          stroke={stroke || palette.text.primary}
          strokeWidth='2'
        />
        <path
          d='M20 9V18'
          stroke={stroke || palette.text.primary}
          strokeWidth='2'
        />
        <path
          d='M12 13V21'
          stroke={stroke || palette.text.primary}
          strokeWidth='2'
        />
      </g>
      <defs>
        <clipPath id='clip0'>
          <rect width='24' height='24' fill='white' />
        </clipPath>
      </defs>
    </SvgWrapper>
  )
}

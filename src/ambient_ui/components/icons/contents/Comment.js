import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Comment({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M18.992 5.7V5.70052L18.999 19.0431L15.8798 16.7894L15.6176 16.6H15.2941H5.6C5.32853 16.6 5 16.3407 5 15.9V5.7C5 5.25931 5.32853 5 5.6 5H18.4C18.6652 5 18.992 5.25259 18.992 5.7Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Knife({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M1.40797 16.4689L16.5059 1.49013C16.998 2.35008 17.0726 3.41795 16.7952 4.69119C16.4239 6.39588 15.4458 8.30174 14.2453 10.1296C13.0544 11.943 11.6915 13.61 10.6203 14.8286C10.1646 15.3471 9.76401 15.7818 9.45503 16.1093L6.18606 13.1449L5.47151 12.497L4.79822 13.1877L1.5039 16.5674L1.40797 16.4689Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Door({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M6 4V3C5.44772 3 5 3.44772 5 4H6ZM18 4H19C19 3.44772 18.5523 3 18 3V4ZM18 20V21C18.5523 21 19 20.5523 19 20H18ZM6 20H5C5 20.5523 5.44772 21 6 21V20ZM6 5H18V3H6V5ZM17 4V20H19V4H17ZM18 19H6V21H18V19ZM7 20V4H5V20H7Z'
        fill={stroke || palette.text.primary}
      />
      <rect
        x='14'
        y='11'
        width='2'
        height='2'
        fill={stroke || palette.text.primary}
      />
    </SvgWrapper>
  )
}

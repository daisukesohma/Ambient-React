import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Sofa({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M4 9.3913V8.3913C3.44772 8.3913 3 8.83902 3 9.3913H4ZM5.99643 9.3913V10.3913H6.99643V9.3913H5.99643ZM5 19V9.3913H3V19H5ZM4 10.3913H5.99643V8.3913H4V10.3913ZM6.99643 9.3913C6.99643 9.0686 7.17453 8.4205 7.58042 7.85451C7.9738 7.30597 8.45494 7 8.99108 7V5C7.59129 5 6.57511 5.82447 5.95515 6.68897C5.34769 7.53603 4.99643 8.58358 4.99643 9.3913H6.99643ZM8.99108 7H11.9857V5H8.99108V7Z'
        fill={stroke || palette.text.primary}
      />
      <path
        d='M20 9.3913V8.3913C20.5523 8.3913 21 8.83902 21 9.3913H20ZM18.005 9.3913V10.3913H17.005V9.3913H18.005ZM19 19V9.3913H21V19H19ZM20 10.3913H18.005V8.3913H20V10.3913ZM17.005 9.3913C17.005 9.0684 16.827 8.42021 16.4214 7.85423C16.0283 7.3056 15.5477 7 15.0126 7V5C16.412 5 17.4276 5.82483 18.0471 6.68925C18.6541 7.53631 19.005 8.58377 19.005 9.3913H17.005ZM15.0126 7H11.0083V5H15.0126V7Z'
        fill={stroke || palette.text.primary}
      />
      <path
        d='M4 15H20'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

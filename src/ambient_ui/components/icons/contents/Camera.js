import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Camera({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M20 17.4444C20 17.857 19.8468 18.2527 19.574 18.5444C19.3012 18.8361 18.9312 19 18.5455 19H5.45455C5.06878 19 4.69881 18.8361 4.42603 18.5444C4.15325 18.2527 4 17.857 4 17.4444V8.88889C4 8.47633 4.15325 8.08067 4.42603 7.78894C4.69881 7.49722 5.06878 7.33333 5.45455 7.33333H8.36364L9.81818 5H14.1818L15.6364 7.33333H18.5455C18.9312 7.33333 19.3012 7.49722 19.574 7.78894C19.8468 8.08067 20 8.47633 20 8.88889V17.4444Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M12.2219 16.1717C13.9848 16.1717 15.4139 14.7427 15.4139 12.9798C15.4139 11.217 13.9848 9.7879 12.2219 9.7879C10.4591 9.7879 9.03003 11.217 9.03003 12.9798C9.03003 14.7427 10.4591 16.1717 12.2219 16.1717Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

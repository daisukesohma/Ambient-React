import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Sites({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M18.2608 12.9937C17.0086 15.1264 15.3205 16.9248 13.9266 18.1995C13.2328 18.834 12.6197 19.3317 12.1822 19.6692C12.137 19.7041 12.0937 19.7373 12.0523 19.7687C12.0064 19.7349 11.958 19.6989 11.9073 19.6609C11.4572 19.3233 10.8272 18.8257 10.1167 18.1915C8.68852 16.9166 6.96997 15.1207 5.72113 12.9937C3.55847 9.31025 6.55966 4 12.0612 4C17.5298 4 20.4391 9.28366 18.2608 12.9937Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

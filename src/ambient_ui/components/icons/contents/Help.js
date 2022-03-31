import React from 'react'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

export default function Help({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 9.29624C10.1613 8.86404 10.4797 8.49961 10.8988 8.26747C11.3178 8.03533 11.8106 7.95047 12.2897 8.02793C12.7687 8.10538 13.2033 8.34015 13.5163 8.69065C13.8294 9.04114 14.0007 9.48331 14 9.94146C13.9956 12.7153 11 11.8829 11 11.8829'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinejoin='round'
      />
      <circle cx='12' cy='15' r='1' fill={stroke || palette.text.primary} />
    </SvgWrapper>
  )
}

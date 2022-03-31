import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Bell.defaultProps = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
  width: 24,
  height: 24,
}

Bell.propTypes = {
  stroke: PropTypes.string,
  strokeLinecap: PropTypes.string,
  strokeLinejoin: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Bell({
  width,
  height,
  stroke,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
}) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M16.6667 8.8C16.6667 7.52696 16.175 6.30606 15.2998 5.40589C14.4247 4.50571 13.2377 4 12 4C10.7623 4 9.57534 4.50571 8.70017 5.40589C7.825 6.30606 7.33333 7.52696 7.33333 8.8C7.33333 14.4 5 16 5 16H19C19 16 16.6667 14.4 16.6667 8.8Z'
        stroke={stroke || palette.text.primary}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
      <path
        d='M14 19C13.7968 19.3042 13.505 19.5566 13.154 19.7321C12.803 19.9076 12.4051 20 12 20C11.5949 20 11.197 19.9076 10.846 19.7321C10.495 19.5566 10.2032 19.3042 10 19'
        stroke={stroke || palette.text.primary}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
    </SvgWrapper>
  )
}

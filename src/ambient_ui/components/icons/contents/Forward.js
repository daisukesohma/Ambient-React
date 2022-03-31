import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Forward10.defaultProps = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
  width: 24,
  height: 24,
}

Forward10.propTypes = {
  stroke: PropTypes.string,
  strokeLinecap: PropTypes.string,
  strokeLinejoin: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Forward10({
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  width,
  height,
}) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M19.9243 6V10H15.9243'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap={strokeLinecap}
      />
      <path
        d='M4.92432 15C3.92432 13.5 3.62053 11 4.59243 8.73046C5.27032 7.14748 6.42184 5.83775 7.87348 4.99861C9.32512 4.15947 10.9982 3.83639 12.6408 4.07803C14.2833 4.31968 15.8062 5.11297 16.98 6.33837L19.9243 9.5'
        stroke={stroke || palette.text.primary}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
    </SvgWrapper>
  )
}

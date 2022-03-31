import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
// src
import SvgWrapper from './SvgWrapper'

Back.defaultProps = {
  height: 24,
  width: 24,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
}

Back.propTypes = {
  height: PropTypes.number,
  stroke: PropTypes.string,
  strokeLinecap: PropTypes.string,
  strokeLinejoin: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
}

export default function Back({
  height,
  width,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
}) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M4 6V10H8'
        stroke={stroke || palette.text.primary}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      />
      <path
        d='M19 15C20 13.5 20.3038 11 19.3319 8.73046C18.654 7.14748 17.5025 5.83775 16.0508 4.99861C14.5992 4.15947 12.9261 3.83639 11.2836 4.07803C9.64105 4.31968 8.11814 5.11297 6.94428 6.33837L4 9.5'
        stroke={stroke || palette.text.primary}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
      />
    </SvgWrapper>
  )
}

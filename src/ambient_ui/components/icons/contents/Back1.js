import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
// src
import SvgWrapper from './SvgWrapper'

Back1.defaultProps = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
  width: 24,
  height: 24,
}

Back1.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeLinecap: PropTypes.string,
  strokeLinejoin: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Back1({
  fill,
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
      <path
        d='M7.25131 12.6V21H5.13931V15.948H4.74331H3.31531V14.232H4.50331C4.71931 14.232 4.88331 14.144 4.99531 13.968C5.11531 13.792 5.17531 13.576 5.17531 13.32V12.6H7.25131ZM9.24225 16.608C9.24225 15.768 9.39425 15.04 9.69825'
        fill={fill || palette.text.primary}
        transform='translate(6)'
      />
    </SvgWrapper>
  )
}

import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
// src
import SvgWrapper from './SvgWrapper'

Back10.defaultProps = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
  width: 24,
  height: 24,
}

Back10.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeLinecap: PropTypes.string,
  strokeLinejoin: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Back10({
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
        d='M7.25131 12.6V21H5.13931V15.948H4.74331H3.31531V14.232H4.50331C4.71931 14.232 4.88331 14.144 4.99531 13.968C5.11531 13.792 5.17531 13.576 5.17531 13.32V12.6H7.25131ZM9.24225 16.608C9.24225 15.768 9.39425 15.04 9.69825 14.424C10.0023 13.808 10.4263 13.34 10.9703 13.02C11.5223 12.692 12.1503 12.528 12.8543 12.528C13.5583 12.528 14.1823 12.692 14.7263 13.02C15.2783 13.34 15.7063 13.808 16.0103 14.424C16.3143 15.04 16.4663 15.768 16.4663 16.608V16.992C16.4663 17.832 16.3143 18.56 16.0103 19.176C15.7063 19.792 15.2783 20.264 14.7263 20.592C14.1823 20.912 13.5583 21.072 12.8543 21.072C12.1503 21.072 11.5223 20.912 10.9703 20.592C10.4263 20.264 10.0023 19.792 9.69825 19.176C9.39425 18.56 9.24225 17.832 9.24225 16.992V16.608ZM14.3543 16.68C14.3543 15.912 14.2183 15.32 13.9463 14.904C13.6743 14.488 13.3103 14.28 12.8543 14.28C12.3983 14.28 12.0343 14.488 11.7623 14.904C11.4903 15.32 11.3543 15.912 11.3543 16.68V16.92C11.3543 17.696 11.4903 18.292 11.7623 18.708C12.0343 19.116 12.3983 19.32 12.8543 19.32C13.3103 19.32 13.6743 19.116 13.9463 18.708C14.2183 18.292 14.3543 17.696 14.3543 16.92V16.68Z'
        fill={fill || palette.text.primary}
      />
    </SvgWrapper>
  )
}

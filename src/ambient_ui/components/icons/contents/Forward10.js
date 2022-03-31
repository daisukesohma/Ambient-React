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
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeLinecap: PropTypes.string,
  strokeLinejoin: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Forward10({
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
      <path
        d='M11.2513 12.6V21H9.13931V15.948H8.74331H7.31531V14.232H8.50331C8.71931 14.232 8.88331 14.144 8.99531 13.968C9.11531 13.792 9.17531 13.576 9.17531 13.32V12.6H11.2513ZM13.2423 16.608C13.2423 15.768 13.3943 15.04 13.6982 14.424C14.0023 13.808 14.4263 13.34 14.9703 13.02C15.5223 12.692 16.1503 12.528 16.8543 12.528C17.5583 12.528 18.1823 12.692 18.7263 13.02C19.2783 13.34 19.7063 13.808 20.0103 14.424C20.3143 15.04 20.4663 15.768 20.4663 16.608V16.992C20.4663 17.832 20.3143 18.56 20.0103 19.176C19.7063 19.792 19.2783 20.264 18.7263 20.592C18.1823 20.912 17.5583 21.072 16.8543 21.072C16.1503 21.072 15.5223 20.912 14.9703 20.592C14.4263 20.264 14.0023 19.792 13.6982 19.176C13.3943 18.56 13.2423 17.832 13.2423 16.992V16.608ZM18.3543 16.68C18.3543 15.912 18.2183 15.32 17.9463 14.904C17.6743 14.488 17.3103 14.28 16.8543 14.28C16.3983 14.28 16.0343 14.488 15.7623 14.904C15.4903 15.32 15.3543 15.912 15.3543 16.68V16.92C15.3543 17.696 15.4903 18.292 15.7623 18.708C16.0343 19.116 16.3983 19.32 16.8543 19.32C17.3103 19.32 17.6743 19.116 17.9463 18.708C18.2183 18.292 18.3543 17.696 18.3543 16.92V16.68Z'
        fill={fill || palette.text.primary}
      />
    </SvgWrapper>
  )
}

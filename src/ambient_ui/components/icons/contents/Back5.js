import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
// src
import SvgWrapper from './SvgWrapper'

Back5.defaultProps = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
  width: 24,
  height: 24,
}

Back5.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeLinecap: PropTypes.string,
  strokeLinejoin: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Back5({
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
        d='M4.51863 3.228C5.04663 3.228 5.52663 3.352 5.95863 3.6C6.39863 3.84 6.74263 4.18 6.99063 4.62C7.24663 5.06 7.37463 5.564 7.37463 6.132C7.37463 6.764 7.22663 7.304 6.93063 7.752C6.64263 8.192 6.24663 8.524 5.74263 8.748C5.24663 8.964 4.68663 9.072 4.06263 9.072C3.41463 9.072 2.84263 8.948 2.34663 8.7C1.85863 8.452 1.47463 8.116 1.19463 7.692C0.922625 7.26 0.774625 6.78 0.750625 6.252H2.85063C2.89063 6.58 3.02263 6.852 3.24663 7.068C3.47863 7.284 3.75063 7.392 4.06263 7.392C4.38263 7.392 4.65863 7.284 4.89063 7.068C5.13063 6.844 5.25063 6.532 5.25063 6.132C5.25063 5.764 5.13863 5.46 4.91463 5.22C4.69863 4.972 4.41463 4.848 4.06263 4.848C3.82263 4.848 3.59063 4.908 3.36663 5.028C3.15063 5.148 2.99863 5.336 2.91063 5.592H0.858625L1.07463 0.599999H6.87063V2.34H3.00663L2.94663 3.768C3.37863 3.408 3.90263 3.228 4.51863 3.228Z'
        fill={fill || palette.text.primary}
        transform='translate(8,12)'
      />
    </SvgWrapper>
  )
}

import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Refresh.defaultProps = {
  width: 24,
  height: 24,
}

Refresh.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Refresh({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M20 18V14H16'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M20 14.4001L16.288 17.8892C15.4282 18.7497 14.3645 19.3783 13.1962 19.7164C12.0278 20.0544 10.7929 20.0909 9.60663 19.8224C8.42038 19.5539 7.32145 18.9892 6.41238 18.181C5.50331 17.3727 4.40573 15.1469 4 14'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4 10L7.712 6.26159C8.5718 5.33961 9.6355 4.66609 10.8038 4.30388C11.9722 3.94167 13.2071 3.90258 14.3934 4.19026C15.5796 4.47793 16.6786 5.083 17.5876 5.94899C18.4967 6.81498 19.5943 8.77112 20 10'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4 6L4 10L8 10'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

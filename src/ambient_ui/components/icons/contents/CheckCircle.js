import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

CheckCircle.defaultProps = {
  width: 24,
  height: 24,
}

CheckCircle.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function CheckCircle({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M20 11.2686V12.0046C19.999 13.7297 19.4404 15.4083 18.4075 16.79C17.3745 18.1718 15.9226 19.1826 14.2683 19.6717C12.6139 20.1608 10.8458 20.1021 9.22757 19.5042C7.60934 18.9064 6.22772 17.8015 5.28877 16.3542C4.34981 14.907 3.90383 13.195 4.01734 11.4736C4.13085 9.75223 4.79777 8.11364 5.91862 6.80224C7.03948 5.49083 8.55423 4.57688 10.2369 4.1967C11.9197 3.81651 13.6802 3.99045 15.256 4.69258'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinejoin='round'
      />
      <path
        d='M20 6L11.5385 14L9 11.6024'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

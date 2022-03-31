import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

ExternalLink.defaultProps = {
  width: 24,
  height: 24,
}

ExternalLink.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function ExternalLink({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M17 13.0667V18.2667C17 18.7264 16.8174 19.1673 16.4923 19.4923C16.1673 19.8174 15.7264 20 15.2667 20H5.73333C5.27362 20 4.83274 19.8174 4.50768 19.4923C4.18262 19.1673 4 18.7264 4 18.2667V8.73333C4 8.27362 4.18262 7.83274 4.50768 7.50768C4.83274 7.18262 5.27362 7 5.73333 7H10.9333'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M16 4H20V8'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11 13L20 4'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

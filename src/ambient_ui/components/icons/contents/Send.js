import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Send.defaultProps = {
  width: 24,
  height: 24,
}

Send.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Send({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <g
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path
          d='M22 2L11 13'
          stroke={stroke || palette.text.primary}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M22 2L15 22L11 13L2 9L22 2Z'
          stroke={stroke || palette.text.primary}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
    </SvgWrapper>
  )
}

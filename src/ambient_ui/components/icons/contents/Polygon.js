import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Polygon.defaultProps = {
  width: 18,
  height: 18,
}

Polygon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  stroke: PropTypes.string,
}

export default function Polygon({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height} viewBox='-4 0 24 18'>
      <path
        d='M15 12.913L8 16.8525L1 12.913L1 5.08701L8 1.14749L15 5.08701L15 12.913Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

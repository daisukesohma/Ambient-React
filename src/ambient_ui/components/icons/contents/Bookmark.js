import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Bookmark.propTypes = {
  fill: PropTypes.string,
  height: PropTypes.number,
  stroke: PropTypes.string,
  width: PropTypes.number,
}

Bookmark.defaultProps = {
  height: 24,
  width: 24,
}

export default function Bookmark({ fill, height, stroke, width }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M15 17L8 12.5556L1 17V2.77778C1 2.30628 1.21071 1.8541 1.58579 1.5207C1.96086 1.1873 2.46957 1 3 1H13C13.5304 1 14.0391 1.1873 14.4142 1.5207C14.7893 1.8541 15 2.30628 15 2.77778V17Z'
        stroke={stroke || palette.text.primary}
        fill={fill || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

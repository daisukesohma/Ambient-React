import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Close.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Close({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M17 7L7 17'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M7 7L17 17'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
    </SvgWrapper>
  )
}

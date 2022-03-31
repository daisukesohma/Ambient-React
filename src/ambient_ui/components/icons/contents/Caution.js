import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Caution.defaultProps = {
  width: 24,
  height: 24,
}

Caution.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Caution({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M10.6907 5.74455L4.20522 16.6799C4.07151 16.9138 4.00075 17.179 4.00001 17.449C3.99926 17.7191 4.06854 17.9847 4.20095 18.2193C4.33337 18.4539 4.52431 18.6495 4.75477 18.7864C4.98523 18.9234 5.24718 18.997 5.51456 19H18.4854C18.7528 18.997 19.0148 18.9234 19.2452 18.7864C19.4757 18.6495 19.6666 18.4539 19.799 18.2193C19.9315 17.9847 20.0007 17.7191 20 17.449C19.9992 17.179 19.9285 16.9138 19.7948 16.6799L13.3093 5.74455C13.1728 5.51726 12.9806 5.32935 12.7513 5.19893C12.522 5.06851 12.2632 5 12 5C11.7368 5 11.478 5.06851 11.2487 5.19893C11.0194 5.32935 10.8272 5.51726 10.6907 5.74455V5.74455Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 10V13'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 16H12.01'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

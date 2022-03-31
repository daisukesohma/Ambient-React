import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Box.defaultProps = {
  width: 24,
  height: 24,
}

Box.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default function Box({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M5.10712 7.99584C5.17649 7.8743 5.27517 7.77483 5.39212 7.7061L11.612 4.10673L11.612 4.10674L11.6159 4.10447C11.7335 4.0357 11.8659 4 12 4C12.1341 4 12.2665 4.0357 12.3841 4.10447L12.3841 4.10448L12.388 4.10673L18.6064 7.70521C18.6069 7.70551 18.6074 7.70582 18.6079 7.70612C18.7249 7.77486 18.8235 7.87432 18.8929 7.99584C18.9625 8.11779 18.9997 8.25707 19 8.3996C19 8.39983 19 8.40005 19 8.40027V15.5997C19 15.5999 19 15.6002 19 15.6004C18.9997 15.7429 18.9625 15.8822 18.8929 16.0042C18.8235 16.1257 18.7249 16.2251 18.6079 16.2939C18.6074 16.2942 18.6069 16.2945 18.6064 16.2948L12.388 19.8933L12.3841 19.8955C12.2665 19.9643 12.1341 20 12 20C11.8659 20 11.7335 19.9643 11.6159 19.8955L11.612 19.8933L5.39363 16.2948C5.39309 16.2945 5.39255 16.2942 5.39201 16.2938C5.27511 16.2251 5.17647 16.1257 5.10712 16.0042C5.03747 15.8821 5.00022 15.7428 5 15.6001V8.39985C5.00022 8.25723 5.03747 8.11786 5.10712 7.99584Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
      />
      <path
        d='M5 8L12 12L19 8'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 19V12'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

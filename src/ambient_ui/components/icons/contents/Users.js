import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import SvgWrapper from './SvgWrapper'

Users.propTypes = {
  stroke: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

Users.defaultProps = {
  width: 24,
  height: 24,
}

export default function Users({ width, height, stroke }) {
  const { palette } = useTheme()
  return (
    <SvgWrapper width={width} height={height}>
      <path
        d='M16 19V17.3333C16 16.4493 15.6839 15.6014 15.1213 14.9763C14.5587 14.3512 13.7956 14 13 14H7C6.20435 14 5.44129 14.3512 4.87868 14.9763C4.31607 15.6014 4 16.4493 4 17.3333V19'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 11C11.6569 11 13 9.65685 13 8C13 6.34315 11.6569 5 10 5C8.34315 5 7 6.34315 7 8C7 9.65685 8.34315 11 10 11Z'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M20 19V17.2964C19.9996 16.5415 19.8029 15.8082 19.4409 15.2115C19.0789 14.6149 18.5721 14.1887 18 14'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15 5C15.5721 5.17056 16.0792 5.55796 16.4413 6.10114C16.8034 6.64432 17 7.31238 17 8C17 8.68762 16.8034 9.35567 16.4413 9.89886C16.0792 10.442 15.5721 10.8294 15 11'
        stroke={stroke || palette.text.primary}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgWrapper>
  )
}

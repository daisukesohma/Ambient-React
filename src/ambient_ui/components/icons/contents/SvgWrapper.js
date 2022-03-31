import React from 'react'
import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'
import { useTheme } from '@material-ui/core/styles'

SvgWrapper.defaultProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  children: undefined,
}

SvgWrapper.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewBox: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.node,
    PropTypes.func,
  ]),
}

export default function SvgWrapper({
  width,
  height,
  viewBox,
  children,
  ...props
}) {
  const theme = useTheme()
  return (
    <svg viewBox={viewBox} width={width} height={height} fill='none' {...props}>
      {isFunction(children) ? children(theme) : children}
    </svg>
  )
}

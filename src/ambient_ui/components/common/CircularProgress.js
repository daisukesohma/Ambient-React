import React from 'react'
import PropTypes from 'prop-types'
import MuiCircularProgress from '@material-ui/core/CircularProgress'

const CircularProgress = ({ color, variant, size, ...props }) => {
  return (
    <MuiCircularProgress
      color={color}
      variant={variant}
      size={size}
      {...props}
    />
  )
}

CircularProgress.defaultProps = {
  color: 'primary',
  variant: 'indeterminate',
  size: 18,
}

CircularProgress.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.number,
}

export default CircularProgress

import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useStyles from './styles'

Divider.defaultProps = {
  color: 'linear-gradient(#FD235C, #4242FF, #1881FF)',
  variant: 'slanted',
  width: 2,
  opacity: 0.75,
  height: 28,
}

Divider.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.oneOf(['slanted', 'vertical']),
  width: PropTypes.number,
  opacity: PropTypes.number,
  height: PropTypes.number,
}

export default function Divider({ color, variant, width, opacity, height }) {
  const classes = useStyles({ color, width, opacity, height })
  return (
    <div
      className={clsx(classes.root, {
        [classes.slanted]: variant === 'slanted',
      })}
    />
  )
}

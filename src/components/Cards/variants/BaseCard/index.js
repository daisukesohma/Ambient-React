/*
 * author: rodaan@ambient.ai
 * The primary file of the ContainedButton
 */
import React from 'react'
import PropTypes from 'prop-types'

import useStyles from './styles'

function Card({
  children,
  darkMode,
  fullWidth,
  size,
  width,
  hoverColor,
  borderColor,
  inlineStyle,
}) {
  const classes = useStyles({
    darkMode,
    fullWidth,
    hoverColor,
    width,
    size,
    borderColor,
  })
  return (
    <div className={classes.root} style={inlineStyle}>
      {children}
    </div>
  )
}

Card.defaultProps = {
  children: null,
  darkMode: false,
  fullWidth: false,
  width: 304,
  height: 317,
  size: 'md',
  hoverColor: null,
  borderColor: 'transparent',
  inlineStyle: {},
}

Card.propTypes = {
  children: PropTypes.node,
  darkMode: PropTypes.bool,
  fullWidth: PropTypes.bool,
  hoverColor: PropTypes.oneOf(['blue', 'red']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  width: PropTypes.string,
  borderColor: PropTypes.string,
  inlineStyle: PropTypes.object,
}

export default Card

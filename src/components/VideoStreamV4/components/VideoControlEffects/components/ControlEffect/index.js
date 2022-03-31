import React from 'react'
import PropTypes from 'prop-types'

import useStyles from './styles'

const ControlEffect = ({ children }) => {
  const classes = useStyles()
  return (
    <div className={classes.ControlEffectWrapper}>
      <div className={classes.IconWrapper}>{children}</div>
    </div>
  )
}

ControlEffect.propTypes = {
  children: PropTypes.node,
}

export default ControlEffect

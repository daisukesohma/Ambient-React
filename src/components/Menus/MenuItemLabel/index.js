import React from 'react'
import PropTypes from 'prop-types'

import SimpleLabel from 'components/Label/SimpleLabel'

import useStyles from './styles'

export default function MenuItemLabel({ name, type }) {
  const classes = useStyles()
  return (
    <div className={classes.labelContainer}>
      <span>{name}</span>
      <SimpleLabel>{type}</SimpleLabel>
    </div>
  )
}

MenuItemLabel.defaultProps = {
  name: '',
  type: '',
}

MenuItemLabel.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
}

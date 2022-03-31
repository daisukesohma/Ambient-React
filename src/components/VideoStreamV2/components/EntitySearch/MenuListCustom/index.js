import React from 'react'
import PropTypes from 'prop-types'
import { components } from 'react-select'

import useStyles from './styles'

const propTypes = {
  children: PropTypes.node,
}

const MenuListCustom = props => {
  const classes = useStyles()
  return (
    <components.MenuList {...props}>
      <div className={classes.root} />
      {props.children}
    </components.MenuList>
  )
}

MenuListCustom.propTypes = propTypes

export default MenuListCustom

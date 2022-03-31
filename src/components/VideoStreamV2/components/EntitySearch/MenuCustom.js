import React from 'react'
import { components } from 'react-select'
import PropTypes from 'prop-types'

const MenuCustom = ({ ...props }) => {
  return (
    <components.Menu
      {...props}
      className={`custom-select-menu-block ${
        props.darkMode ? 'dark-mode' : ''
      }`}
    >
      {props.children}
    </components.Menu>
  )
}

MenuCustom.propTypes = {
  children: PropTypes.object,
  darkMode: PropTypes.bool,
}

export default MenuCustom

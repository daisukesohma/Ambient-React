/* eslint-disable import/no-cycle */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'

import EnhancedMenu from './index'
import useStyles from './styles'

const SubMenu = ({ darkMode, label, menuItems, selectedItem, onItemClick }) => {
  const classes = useStyles({ darkMode })

  const [menuOpen, setMenuOpen] = useState(false)
  const [anchorElement, setAnchorElement] = useState(null)

  const handleItemClick = event => {
    if (!anchorElement) {
      setAnchorElement(event.currentTarget)
    }
    setMenuOpen(!menuOpen)
  }

  const handleSubMenuClose = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <MenuItem
        onClick={handleItemClick}
        classes={{
          root: classes.menuItem,
          selected: classes.selected,
        }}
      >
        {label}
        <ArrowRightIcon />
      </MenuItem>
      <EnhancedMenu
        open={menuOpen}
        menuItems={menuItems}
        selectedItem={selectedItem}
        anchorElement={anchorElement}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleSubMenuClose}
        onItemClick={onItemClick}
      />
    </>
  )
}

SubMenu.propTypes = {
  classes: PropTypes.any,
  darkMode: PropTypes.bool,
  label: PropTypes.string.isRequired,
  menuItems: PropTypes.array.isRequired,
  onItemClick: PropTypes.func,
  selectedItem: PropTypes.any,
}

SubMenu.defaultProps = {
  classes: undefined,
  darkMode: false,
  label: 'default',
  menuItems: [{ value: 'default', label: 'default' }],
  onItemClick: () => {},
  selectedItem: '',
}

export default SubMenu

/* eslint-disable import/no-cycle */
import React, { Fragment } from 'react'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import MuiMenu from '@material-ui/core/Menu'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import SubMenu from './SubMenu'
import useStyles from './styles'

function EnhancedMenu({
  anchorElement,
  darkMode,
  menuItems,
  onClose,
  onItemClick,
  open,
  selectedItem,
  width,
  ...others
}) {
  const classes = useStyles({ darkMode, width })
  const renderMenuItems = menuItems.map((menuItem, index) => {
    // IF HAS DIVIDER
    if (get(menuItem, 'divider', false)) {
      const dark = get(menuItem, 'dark', true).toString()
      if (isEmpty(menuItem.text)) {
        return (
          <Divider
            dark={dark}
            key={`enhanced-menu-${menuItem.label}-${index}-divider`}
          />
        )
      }
      return (
        <Fragment
          key={`enhanced-menu-${menuItem.label}-${index}-divider-start`}
        >
          <Divider dark={dark} />
          <MenuItem className={classes.dividerText}>{menuItem.text}</MenuItem>
          <Divider dark={dark} />
        </Fragment>
      )
    }

    // IF HAS SUBMENU ITEMS
    if (get(menuItem, 'subMenuItems', false)) {
      return (
        <SubMenu
          key={`enhanced-menu-${menuItem.label}-${index}-divider-start`}
          darkMode={darkMode}
          label={menuItem.label}
          menuItems={menuItem.subMenuItems}
          selectedItem={selectedItem}
          onItemClick={onItemClick}
        />
      )
    }

    // DEFAULT MENU ITEM
    return (
      <MenuItem
        key={`enhanced-menu-${menuItem.label}-${index}-divider-start`}
        classes={{
          root: classes.menuItem,
          selected: classes.selected,
        }}
        onClick={() => onItemClick(menuItem)}
        selected={menuItem === selectedItem}
        {...get(menuItem, 'props', {})}
      >
        {menuItem.label}
      </MenuItem>
    )
  })

  return (
    <MuiMenu
      {...others}
      anchorEl={anchorElement}
      open={open}
      getContentAnchorEl={null}
      onClose={onClose}
      classes={{ paper: classes.dropdownStyle, list: classes.menuList }}
    >
      {renderMenuItems}
    </MuiMenu>
  )
}

EnhancedMenu.propTypes = {
  anchorElement: PropTypes.any,
  darkMode: PropTypes.bool,
  menuItems: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func,
  selectedItem: PropTypes.any,
}

EnhancedMenu.defaultProps = {
  anchorElement: null,
  darkMode: false,
  menuItems: [{ value: 'default', label: 'default' }],
  onClose: () => {},
  open: false,
}

export default EnhancedMenu

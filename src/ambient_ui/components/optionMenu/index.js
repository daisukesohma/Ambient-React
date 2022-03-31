import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'
import clsx from 'clsx'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import Divider from '@material-ui/core/Divider'

import { useStyles } from './styles'
import MenuItem from './components/menuItem'

const OptionMenu = ({
  customIconContainer,
  darkMode,
  icon,
  menuItems,
  noBackground,
  textClass, // overrides
  paperClass, // overrides
}) => {
  // setup
  const classes = useStyles({ customIconContainer, darkMode, noBackground })
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // click handlers
  const handleClick = event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = event => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <div id='actions-menu' className={classes.root}>
      <div
        className={clsx({
          [classes.iconContainerBackground]: !noBackground,
          [classes.iconContainer]: !customIconContainer,
        })}
        onClick={handleClick}
      >
        {icon}
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        elevation={0}
        classes={{
          paper: clsx(classes.paperRoot, paperClass),
        }}
      >
        <div id='actions-menu-container' className={classes.menuContainer}>
          {menuItems.map((item, i) => {
            if (get(item, 'divider', false)) {
              const dark = get(item, 'dark', true).toString()
              if (isEmpty(item.text)) {
                return (
                  <Divider
                    dark={dark}
                    key={`enhanced-menu-${item.label}-${i}-divider`}
                  />
                )
              }
              return (
                <>
                  <Divider
                    dark={dark}
                    key={`enhanced-menu-${item.label}-${i}-divider-start`}
                  />
                  <div className={clsx('am-caption', classes.dividerText)}>
                    {item.text}
                  </div>
                  <Divider
                    dark={dark}
                    key={`enhanced-menu-${item.label}-${i}-divider-end`}
                  />
                </>
              )
            }

            return (
              <MenuItem
                item={item}
                key={i}
                darkMode={darkMode}
                textClass={textClass}
                handleClose={handleClose}
              />
            )
          })}
        </div>
      </Popover>
    </div>
  )
}

OptionMenu.defaultProps = {
  customIconContainer: false,
  darkMode: false,
  icon: <div>ʕ•ᴥ•ʔ</div>,
  menuItems: [],
  noBackground: true,
  textClass: undefined,
  paperClass: undefined,
}

OptionMenu.propTypes = {
  customIconContainer: PropTypes.bool,
  darkMode: PropTypes.bool,
  icon: PropTypes.node,
  menuItems: PropTypes.array,
  noBackground: PropTypes.bool,
  textClass: PropTypes.string,
  paperClass: PropTypes.string,
}

export default OptionMenu

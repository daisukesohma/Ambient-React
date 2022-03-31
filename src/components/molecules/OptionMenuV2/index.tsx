import React from 'react'
import Popover from '@material-ui/core/Popover'
import clsx from 'clsx'
import { map } from 'lodash'
// src
import MenuItem, { ItemType, ClickType } from 'components/atoms/MenuItem'

import useStyles from './styles'

const ENTER_KEY_CODE = 13

function OptionMenuV2({
  darkMode = false,
  icon = <div>ʕ•ᴥ•ʔ</div>,
  menuItems = [],
  noBackground = true,
  textClass, // overrides
  paperClass, // overrides
  additionalStyles,
}: {
  darkMode?: boolean
  icon: Element | JSX.Element
  menuItems: ItemType[]
  noBackground?: boolean
  textClass?: string
  paperClass?: string
  additionalStyles?: string
}): JSX.Element {
  // setup
  const classes = useStyles({ darkMode, noBackground })
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
  const open = Boolean(anchorEl)

  // click handlers
  const handleClick = (event: ClickType) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event: ClickType) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <div>
      <div
        className={clsx(
          classes.iconContainer,
          {
            [classes.iconContainerBackground]: !noBackground,
          },
          additionalStyles,
        )}
        onClick={handleClick}
        role='button'
        tabIndex={0}
        aria-describedby='option-menu'
        onKeyDown={e => {
          if (e.keyCode === ENTER_KEY_CODE) {
            handleClick(e)
          }
        }}
      >
        {icon}
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{
          vertical: 0,
          horizontal: 120,
        }}
        elevation={0}
        classes={{
          paper: clsx(classes.paperRoot, paperClass),
        }}
      >
        <div id='actions-menu-container' className={classes.menuContainer}>
          {map(menuItems, (item, i) => {
            return (
              <MenuItem
                item={item}
                key={`menuItem-${i}`}
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

OptionMenuV2.defaultProps = {
  darkMode: false,
  noBackground: true,
  textClass: undefined,
  paperClass: undefined,
  additionalStyles: undefined,
}

export default OptionMenuV2

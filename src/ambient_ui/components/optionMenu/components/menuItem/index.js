import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import { useStyles } from './styles'

const MenuItem = ({ darkMode, handleClose, item, textClass }) => {
  const classes = useStyles({ darkMode, hoverColor: item.hoverColor })
  const handleClick = event => {
    if ('onClick' in item) item.onClick()
    handleClose(event)
  }

  // defaults text size to 'am-caption', but takes custom text size class name
  return (
    <div
      className={clsx(
        textClass || 'am-caption',
        classes.menuText,
        classes.menuItem,
      )}
      onClick={handleClick}
    >
      {item.label}
    </div>
  )
}

MenuItem.propTypes = {
  darkMode: PropTypes.bool,
  handleClose: PropTypes.func,
  item: PropTypes.object,
  textClass: PropTypes.string,
}
export default MenuItem

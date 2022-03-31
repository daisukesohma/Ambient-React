import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'

import useStyles from './styles'

const propTypes = {
  icon: PropTypes.func,
  badge: PropTypes.number,
  badgeBackground: PropTypes.string,
  children: PropTypes.object,
  isOpen: PropTypes.bool,
  setIsSiteSelectorOpen: PropTypes.func,
}

const defaultProps = {
  icon: () => {},
  badge: undefined,
  badgeBackground: '',
  children: undefined,
  setIsSiteSelectorOpen: () => {},
}

function Popup({
  icon,
  badge,
  badgeBackground,
  children,
  isOpen,
  setIsSiteSelectorOpen,
}) {
  const classes = useStyles({ badgeBackground })

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
    setIsSiteSelectorOpen(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setIsSiteSelectorOpen(false)
  }

  useEffect(() => {
    if (!isOpen) setAnchorEl(null)
  }, [isOpen])

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  return (
    <div>
      <div aria-describedby={id} className={classes.icon} onClick={handleClick}>
        {icon && icon()}
        {!!badge && <div className={classes.badge}>{badge}</div>}
      </div>
      {children && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          classes={{ root: classes.popover }}
        >
          {children}
        </Popover>
      )}
    </div>
  )
}

Popup.propTypes = propTypes
Popup.defaultProps = defaultProps

export default Popup

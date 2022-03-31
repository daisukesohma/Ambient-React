import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'

// src
import UserAvatar from 'components/UserAvatar'
import Tooltip from 'components/Tooltip'

import Menus from './Menus'
import useStyles from './styles'

function CurrentUser() {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)

  const img = useSelector(state => state.auth.profile.img)
  const firstName = useSelector(state => state.auth.user.firstName)
  const lastName = useSelector(state => state.auth.user.lastName)

  const name = `${firstName} ${lastName}`

  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  return (
    <div className={classes.avatarContainer}>
      <Tooltip
        content={
          <div className={classes.tooltipText}>
            <Typography className='am-subtitle1'>{name}</Typography>
          </div>
        }
        placement='bottom'
        theme='ambient-white'
        arrow
      >
        <div
          className={classes.iconContainer}
          onClick={handleClick}
          aria-describedby={id}
        >
          <UserAvatar name={name} img={img} isSelected />
        </div>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        classes={{ paper: classes.popover }}
      >
        <Menus />
      </Popover>
    </div>
  )
}

export default CurrentUser

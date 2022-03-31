import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'

import UserAvatar from '../../../../../components/UserAvatar'
import Tooltip from '../../../../../components/Tooltip'

import Menus from './Menus'
import useStyles from './styles'

function CurrentUser() {
  const { palette } = useTheme()
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)

  const img = useSelector(state => state.auth.profile.img)
  const firstName = useSelector(state => state.auth.user.firstName)
  const lastName = useSelector(state => state.auth.user.lastName)

  const name = `${firstName} ${lastName}`

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  return (
    <div className={classes.avatarContainer}>
      <Tooltip
        content={
          <div
            style={{
              padding: '2px 8px',
              border: `1px solid ${palette.grey[300]}`,
              borderRadius: 4,
            }}
          >
            <Typography className={'am-subtitle1'}>{name}</Typography>
          </div>
        }
        placement={'bottom'}
        theme={'ambient-white'}
        arrow={true}
      >
        <div
          style={{
            border: `2px solid ${palette.primary.main}`,
            borderRadius: 22,
            cursor: 'pointer',
          }}
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: classes.popover }}
      >
        <Menus />
      </Popover>
    </div>
  )
}

export default CurrentUser

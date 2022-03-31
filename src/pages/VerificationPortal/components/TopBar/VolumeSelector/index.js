import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import VolumeDownIcon from '@material-ui/icons/VolumeDown'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import Popover from '@material-ui/core/Popover'

// src
import Tooltip from 'components/Tooltip'

import Menus from './Menus'
import useStyles from './styles'
import { SOUND_LEVELS } from '../../../constants'

function VolumeSelector() {
  const classes = useStyles()
  const soundLevel = useSelector(state => state.verification.soundLevel)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const CurrentIcon = useMemo(() => {
    switch (soundLevel) {
      case SOUND_LEVELS.OFF:
        return VolumeOffIcon
      case SOUND_LEVELS.MEDIUM:
        return VolumeDownIcon
      case SOUND_LEVELS.HIGH:
        return VolumeUpIcon
      default:
        console.warn(`currentIcon method doesn't support ${soundLevel}`)
        return VolumeOffIcon
    }
  }, [soundLevel])

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  return (
    <div className={classes.avatarContainer}>
      <Tooltip
        content={
          <div className={classes.tooltipText}>
            <Typography className='am-subtitle1'>
              Notification Sounds
            </Typography>
          </div>
        }
        placement='bottom'
        theme='ambient-white'
        arrow
      >
        <div
          className={classes.volumeIconContainer}
          onClick={handleClick}
          aria-describedby={id}
        >
          <div className={classes.volumeIcon}>
            <CurrentIcon />
          </div>
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

export default VolumeSelector

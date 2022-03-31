import React from 'react'
import { useDispatch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import VolumeDownIcon from '@material-ui/icons/VolumeDown'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'

import useStyles from './styles'
import { SOUND_LEVELS } from '../../../../constants'
import { setSoundLevel } from '../../../../redux/verificationSlice'

function Menus() {
  const dispatch = useDispatch()
  const classes = useStyles()

  const handleSoundLevelChange = soundLevel => () => {
    dispatch(setSoundLevel({ soundLevel }))
  }

  return (
    <div className={classes.root}>
      <Grid
        className={classes.item}
        container
        onClick={handleSoundLevelChange(SOUND_LEVELS.OFF)}
        justify='flex-start'
        alignItems='center'
      >
        <VolumeOffIcon />{' '}
        <span className={classes.itemText}>Disable Notifications</span>
      </Grid>
      <Grid
        className={classes.item}
        container
        onClick={handleSoundLevelChange(SOUND_LEVELS.MEDIUM)}
        justify='flex-start'
        alignItems='center'
      >
        <VolumeDownIcon />{' '}
        <span className={classes.itemText}>Only Signal Sound</span>
      </Grid>
      <Grid
        className={classes.item}
        container
        onClick={handleSoundLevelChange(SOUND_LEVELS.HIGH)}
        justify='flex-start'
        alignItems='center'
      >
        <VolumeUpIcon />{' '}
        <span className={classes.itemText}>Signal with Speech</span>
      </Grid>
    </div>
  )
}

export default Menus

import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
// src
import SoundToggle from 'components/SoundToggle'

import useStyles from './styles'

const AlertSoundsSwitcher = () => {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const speechIsMuted = useSelector(state => state.settings.speechIsMuted)

  return (
    <div className={clsx(classes.container, classes.themeRoot)}>
      <div className={clsx('am-body1', classes.themeTitle)}>Alert Sounds</div>
      <div className={classes.themeContainer}>
        <div style={{ marginTop: 8 }}>
          <span>
            <SoundToggle size={24} />
            <span style={{ marginTop: 8 }}>
              <span className='am-caption' style={{ color: palette.grey[500] }}>
                {speechIsMuted ? 'Sound is Off' : 'Sound is on'}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default AlertSoundsSwitcher

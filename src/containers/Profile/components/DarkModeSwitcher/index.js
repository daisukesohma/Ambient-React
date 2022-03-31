import React from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
// src
import { LabelledSliderSwitch } from 'ambient_ui'
import { toggleDarkMode } from 'redux/slices/settings'

import useStyles from './styles'

const DarkModeSwitcher = () => {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx(classes.container, classes.themeRoot)}>
      <div className={clsx('am-body1', classes.themeTitle)}>Dark Mode</div>
      <div className={classes.themeContainer}>
        <div onClick={() => dispatch(toggleDarkMode())}>
          <LabelledSliderSwitch checked={darkMode} />
        </div>
      </div>
    </div>
  )
}

export default DarkModeSwitcher

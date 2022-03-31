import React from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
// src
import { toggleNewsFeedPosition } from 'redux/slices/settings'
import SimpleLabel from 'components/Label/SimpleLabel'
import { LabelledSliderSwitch } from 'ambient_ui'

import useStyles from './styles'

export default function NewsFeedPositionSwitcher() {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const newsFeedPositionLeft = useSelector(
    state => state.settings.newsFeedPositionLeft,
  )

  return (
    <div className={clsx(classes.container, classes.themeRoot)}>
      <div className={clsx('am-body1', classes.themeTitle)}>
        News Feed Position
        <SimpleLabel>Experimental</SimpleLabel>
      </div>
      <div className={classes.themeContainer}>
        <div onClick={() => dispatch(toggleNewsFeedPosition())}>
          <LabelledSliderSwitch
            checked={!newsFeedPositionLeft}
            lightIconContent='Left'
            darkIconContent='Right'
          />
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
// src
import SimpleLabel from 'components/Label/SimpleLabel'
import { LabelledSliderSwitch } from 'ambient_ui'
import {
  showSPEStreams as showSPEAction,
  showNormalStreams as showNormalAction,
} from 'redux/slices/settings'
import { StreamTypeEnum } from 'enums'
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const SPEModeSwitcher = () => {
  const dispatch = useDispatch()
  const flexClasses = useFlexStyles()
  const streamType = useSelector(state => state.settings.streamType)
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const isSPE = streamType === StreamTypeEnum.SPE
  const handleSPESwitchChange = e => {
    if (isSPE) {
      dispatch(showNormalAction())
    } else {
      dispatch(showSPEAction())
    }
  }

  return (
    <div className={clsx(classes.container, classes.themeRoot)} id='spe-switch'>
      <div className={clsx('am-body1', classes.themeTitle)}>
        SPE Mode
        <SimpleLabel>Staff Only</SimpleLabel>
      </div>
      <div className={classes.themeContainer}>
        <div className={clsx(flexClasses.row, flexClasses.centerEnd)}>
          <LabelledSliderSwitch
            checked={isSPE}
            onClick={handleSPESwitchChange}
            darkIconContent='SPE'
            lightIconContent='Normal'
          />
        </div>
      </div>
    </div>
  )
}

export default SPEModeSwitcher

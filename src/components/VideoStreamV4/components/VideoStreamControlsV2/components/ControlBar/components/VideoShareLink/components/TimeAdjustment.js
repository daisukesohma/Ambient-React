import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { format as formatTz } from 'date-fns-tz'
import clsx from 'clsx'
// src
import { setShareLink } from 'redux/slices/shareLink'
import { useFlexStyles } from 'common/styles/commonStyles'
import { CheckboxWithLabel } from 'ambient_ui'
import useStyles from './styles'

function TimeAdjustment() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const flexClasses = useFlexStyles()
  const [currentTimeEnabled, setCurrentTimeEnabled] = useState(false)
  const currentTimeDateObject = useSelector(
    state => state.videoStreamControls.modal.playTime,
  )
  const formattedDate = formatTz(
    currentTimeDateObject,
    'HH:mm:ss zzz (MMM dd yyyy)',
  )

  // update time
  useEffect(() => {
    if (currentTimeEnabled && currentTimeDateObject.getTime) {
      const ts = Math.round(currentTimeDateObject.getTime() / 1000)
      dispatch(
        setShareLink({
          type: 'video',
          params: {
            ts,
          },
        }),
      )
    } else {
      dispatch(
        setShareLink({
          type: 'video',
          params: {
            ts: null,
          },
        }),
      )
    }
  }, [currentTimeEnabled, currentTimeDateObject])

  const onChangeEnabled = enabled => {
    setCurrentTimeEnabled(!enabled)
  }

  return (
    <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
      <CheckboxWithLabel
        onChange={() => onChangeEnabled(currentTimeEnabled)}
        label={'Start at'}
        checked={currentTimeEnabled}
      />
      <span className={clsx('am-caption', classes.caption)}>
        {formattedDate}
      </span>
    </div>
  )
}

export default TimeAdjustment

/*
 * author: rodaan@ambient.ai
 * DispatchMenuComponent to allow users to create arbitrary AlertEvents when they want to
 */
import React, { useState, memo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import { Button } from 'ambient_ui'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import clsx from 'clsx'
import moment from 'moment'
// src
import { useInterval } from 'common/hooks'
import { setDispatchAlertCustomTimeMode } from 'redux/slices/videoStreamControls'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import useStyles from './styles'

const propTypes = {
  createDispatchRequest: PropTypes.func,
  creatingDispatchRequest: PropTypes.bool,
  onClose: PropTypes.func,
  videoStreamKey: PropTypes.string.isRequired,
}

const defaultProps = {
  createDispatchRequest: () => {},
  creatingDispatchRequest: false,
  onClose: () => {},
}

const is24hr = false
const timeFormat = is24hr ? 'HH:mm:ss' : 'hh:mm:ss a'

const DispatchMenu = ({
  createDispatchRequest,
  creatingDispatchRequest,
  onClose,
  videoStreamKey,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const [title, setTitle] = useState('')
  const dispatch = useDispatch()
  const handleValueChange = e => setTitle(e.target.value)
  const [now, setNow] = useState(moment().unix())

  useInterval(() => {
    setNow(moment().unix())
  }, [1000])

  const dispatchAlertManualTimeMode = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'dispatchAlertManualTimeMode',
    }),
  )

  const dispatchAlertTS = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'dispatchAlertTS',
      defaultValue: now,
    }),
  )

  const handleDispatchRequest = () => {
    const dispatchTimeMs = dispatchAlertManualTimeMode
      ? dispatchAlertTS * 1000
      : now * 1000
    createDispatchRequest(title, dispatchTimeMs, () => {
      setTitle('')
    })
    onClose()
  }

  return (
    <div className={classes.dispatchMenuComponent}>
      <div className='am-h6' style={{ marginBottom: 8 }}>
        Create Custom Alert
      </div>
      <div className={classes.dispatchMenuComponentRow}>
        <span className={clsx('am-overline', classes.time)}>
          Time:{' '}
          <span
            className={clsx({
              [classes.manualTime]: dispatchAlertManualTimeMode,
            })}
          >
            {dispatchAlertManualTimeMode
              ? moment.unix(dispatchAlertTS).format(`MM/DD/YYYY ${timeFormat}`)
              : moment.unix(now).format(`MM/DD/YYYY ${timeFormat}`)}
          </span>
        </span>
      </div>
      <div className={classes.dispatchMenuComponentRow}>
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={dispatchAlertManualTimeMode}
              onChange={() =>
                dispatch(setDispatchAlertCustomTimeMode({ videoStreamKey }))
              }
              name='checkedB'
              color='primary'
            />
          }
          classes={{ label: classes.customTimeLabel }}
          label={
            <div className='am-overline' style={{ color: palette.grey[500] }}>
              Custom Time
            </div>
          }
        />
      </div>
      <div>
        <div
          className='am-caption'
          style={{
            color: palette.common.greenNeon,
            opacity: dispatchAlertManualTimeMode ? 1 : 0,
          }}
        >
          Select time by clicking on timeline below.
        </div>
      </div>
      <div className={classes.dispatchMenuComponentRow}>
        <TextField
          id='helperAlertText'
          label='What should we alert on?'
          value={title}
          onChange={handleValueChange}
          classes={{ root: classes.textInputRoot }}
        />
      </div>
      <div className={classes.save}>
        <Button
          disabled={creatingDispatchRequest}
          onClick={handleDispatchRequest}
          variant='outlined'
        >
          {creatingDispatchRequest ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </div>
  )
}

DispatchMenu.propTypes = propTypes
DispatchMenu.defaultProps = defaultProps

export default memo(DispatchMenu)

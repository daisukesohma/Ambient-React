import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { IconButton, InputAdornment, Typography } from '@material-ui/core'
import { isMobile, isTablet } from 'react-device-detect'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import clsx from 'clsx'
// src
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import Icons from '../icons'
import useStyles from './styles'

const ERROR_MSG = 'Start date must be earlier than end date.'

const propTypes = {
  darkMode: PropTypes.bool,
  initialStart: PropTypes.instanceOf(Date),
  initialEnd: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
  inline: PropTypes.bool,
  onChange: PropTypes.func,
  minDate: PropTypes.instanceOf(Date),
  timezone: PropTypes.string,
}

const defaultProps = {
  darkMode: false,
  initialStart: new Date(),
  initialEnd: new Date(),
  disabled: false,
  inline: false,
  onChange: () => {},
  minDate: new Date('1900-01-01'),
  timezone: DEFAULT_TIMEZONE,
}

const CustomDateTimeRangePicker = ({
  disabled,
  darkMode,
  inline,
  onChange,
  initialStart,
  initialEnd,
  minDate,
}) => {
  const { palette } = useTheme()
  const mobile = isMobile && !isTablet
  const classes = useStyles({ darkMode, mobile })

  const [startValue, setStartValue] = useState(initialStart)
  const [endValue, setEndValue] = useState(initialEnd)
  const [error, setError] = useState(null)

  const isBigger = (start, end) => {
    return new Date(start) > new Date(end)
  }

  const handleStartChange = value => {
    const isError = endValue && isBigger(value, endValue)
    if (isError) {
      setError(ERROR_MSG)
    } else {
      setError(null)
    }
    setStartValue(value)
    if (endValue) {
      onChange([value, endValue])
    }
  }
  const handleEndChange = value => {
    const isError = startValue && isBigger(startValue, value)
    if (isError) {
      setError(ERROR_MSG)
    } else {
      setError(null)
    }
    setEndValue(value)
    if (startValue) {
      onChange([startValue, value])
    }
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        <div className={classes.am_container}>
          {mobile && <Typography className={classes.marker}>From</Typography>}
          <DateTimePicker
            format='MMM dd h:mma'
            variant={inline ? 'inline' : ''}
            value={startValue}
            className={classes.am_inputContainer}
            minDate={minDate}
            InputProps={{
              startAdornment: !mobile && (
                <InputAdornment position='start'>
                  <IconButton>
                    <Icons.Calendar size={14} stroke={palette.grey[700]} />
                  </IconButton>
                </InputAdornment>
              ),
              disableUnderline: true,
              className: classes.am_input,
            }}
            onChange={handleStartChange}
            disabled={disabled}
          />
          {startValue && (
            <>
              <div className={clsx('am-overline', classes.marker)}>To</div>
              <DateTimePicker
                format='MMM dd h:mma'
                variant={inline ? 'inline' : ''}
                value={endValue}
                className={classes.am_inputContainer}
                minDate={minDate}
                InputProps={{
                  disableUnderline: true,
                  className: classes.am_input,
                }}
                onChange={handleEndChange}
              />
            </>
          )}
        </div>
        {error && <div className={classes.error}>{error}</div>}
      </>
    </MuiPickersUtilsProvider>
  )
}

CustomDateTimeRangePicker.defaultProps = defaultProps
CustomDateTimeRangePicker.propTypes = propTypes

export default CustomDateTimeRangePicker

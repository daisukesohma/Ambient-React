import React from 'react'
import PropTypes from 'prop-types'
import { DateTimeRangePicker } from 'ambient_ui'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { msToUnix } from 'utils'

const propTypes = {
  range: PropTypes.array,
  darkMode: PropTypes.bool,
  handleChange: PropTypes.func,
  minDate: PropTypes.instanceOf(Date),
  timezone: PropTypes.string,
}

const defaultProps = {
  range: [],
  darkMode: false,
  handleChange: () => {},
  minDate: new Date('1900-01-01'),
  timezone: DEFAULT_TIMEZONE,
}

const DatePicker = ({ range, darkMode, handleChange, minDate, timezone }) => {
  const makeChange = e => {
    // convert local time -> server time
    // e.g: EST 2020-01-01 10 AM -> PST 2020-01-01 10 AM
    const startDate = zonedTimeToUtc(e[0], timezone)
    const endDate = zonedTimeToUtc(e[1], timezone)
    handleChange([msToUnix(startDate.getTime()), msToUnix(endDate.getTime())])
  }

  return (
    <DateTimeRangePicker
      darkMode={darkMode}
      inline
      // convert server time -> local time
      // e.g: PST 2020-01-01 10 AM -> EST 2020-01-01 10 AM
      initialStart={utcToZonedTime(new Date(range[0] * 1000), timezone)}
      initialEnd={utcToZonedTime(new Date(range[1] * 1000), timezone)}
      onChange={makeChange}
      minDate={minDate}
      timezone={timezone}
      id='dateTime-picker'
    />
  )
}

DatePicker.defaultProps = defaultProps
DatePicker.propTypes = propTypes

export default DatePicker

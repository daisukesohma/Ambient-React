import React from 'react'
import PropTypes from 'prop-types'
import { DateTimeRangePicker } from 'ambient_ui'
import moment from 'moment'

const defaultProps = {
  range: [],
  handleChange: () => {},
}

const propTypes = {
  range: PropTypes.array,
  handleChange: PropTypes.func,
}

const DatePicker = ({ range, handleChange }) => {
  return (
    <DateTimeRangePicker
      darkMode
      inline
      initialStart={moment.unix(range[0]).toDate()}
      initialEnd={moment.unix(range[1]).toDate()}
      onChange={handleChange}
      id='dateTime-picker'
    />
  )
}

DatePicker.defaultProps = defaultProps

DatePicker.propTypes = propTypes

export default DatePicker

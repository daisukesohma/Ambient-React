import React, { Component } from 'react'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import { DayPickerSingleDateController } from 'react-dates'

import { tsAtMidnight } from '../../utils'
import { SEC_IN_DAY } from '../../utils/constants'

import DayWithDot from './DayWithDot'
import InfoPanel from './InfoPanel'
import { isInclusivelyBeforeDay, isWithinDayBackList } from './utils'

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import './DatePicker_overrides.css' // override airbnb date picker styles

class DatePickerComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      focused: true,
      date: moment.unix(props.videoStreamTS),
    }
  }

  componentDidUpdate(prevProps) {
    const newDay = Math.floor(this.props.videoStreamTS / SEC_IN_DAY)
    const oldDay = Math.floor(prevProps.videoStreamTS / SEC_IN_DAY)
    if (newDay !== oldDay) {
      this.setState({
        date: moment.unix(this.props.videoStreamTS),
      })
    }
  }

  onDateChange = date => {
    const dateTS = date.unix()
    const todayTS = tsAtMidnight()
    const diffInTS = todayTS - dateTS
    let diffInDays = Math.floor(diffInTS / SEC_IN_DAY)
    const remainder = diffInTS % SEC_IN_DAY
    if (remainder > 0) {
      diffInDays += 1
    }

    if (diffInDays < 0) {
      diffInDays = 0
    }
    this.setState({
      date,
      selectedDateDiff: diffInDays,
      selectedDate: date.unix(),
    })
  }

  onFocusChange = () => {
    this.setState({ focused: true })
  }

  onConfirmChange = () => {
    this.props.toggleDatePicker(() => {
      this.props.handleDatePickerSelection(
        this.state.selectedDateDiff,
        this.state.selectedDate,
      )
    })
  }

  onCancel = () => {
    this.setState(
      {
        date: moment(),
        selectedDateDiff: 0,
      },
      () => {
        this.props.toggleDatePicker()
      },
    )
  }

  shouldRenderDayWithData = day => {
    return !this.isDayOutsideRange(day) && !this.isDayBlocked(day)
  }

  isDayOutsideRange = day => {
    return (
      !isInclusivelyBeforeDay(day, moment()) ||
      isInclusivelyBeforeDay(
        day,
        moment().subtract(this.props.daysBackAccessible, 'days'),
      )
    )
  }

  isDayBlocked = day => !isWithinDayBackList(day, this.props.daysWithData)

  render() {
    const { focused, date } = this.state
    const { isVisible } = this.props
    if (!isVisible) return null
    return (
      <div
        id='date-picker-container'
        style={{
          bottom: 0,
          left: 0,
          position: 'absolute',
          zIndex: 10,
        }}
      >
        <DayPickerSingleDateController
          focused={focused}
          date={date}
          maxDate={moment()}
          onDateChange={this.onDateChange}
          onFocusChange={this.onFocusChange}
          isOutsideRange={this.isDayOutsideRange}
          isDayBlocked={this.isDayBlocked}
          hideKeyboardShortcutsPanel
          renderDayContents={day =>
            this.shouldRenderDayWithData(day) ? (
              <DayWithDot day={day} />
            ) : (
              day.format('D')
            )
          }
          renderCalendarInfo={() => (
            <InfoPanel
              onCancel={this.onCancel}
              onConfirmChange={this.onConfirmChange}
            />
          )}
        />
      </div>
    )
  }
}

DatePickerComponent.defaultProps = {
  isVisible: false,
  toggleDatePicker: () => {},
  videoStreamTS: null,
  handleDatePickerSelection: () => {},
  daysBackAccessible: null,
  subtractDays: null,
  daysWithData: [],
}

DatePickerComponent.propTypes = {
  isVisible: PropTypes.bool,
  toggleDatePicker: PropTypes.func,
  videoStreamTS: PropTypes.number,
  handleDatePickerSelection: PropTypes.func,
  daysBackAccessible: PropTypes.number,
  subtractDays: PropTypes.number,
  daysWithData: PropTypes.array,
}

export default DatePickerComponent

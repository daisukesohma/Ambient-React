import React, { useEffect, useState, useRef } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Portal from '@material-ui/core/Portal'
import DatePicker from 'react-datepicker'
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'
import getUnixTime from 'date-fns/getUnixTime'
import moment from 'moment'
import { isMobileOnly } from 'react-device-detect'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
// src
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import { Button } from 'ambient_ui/components'
import ReadableTimeRangePicker from 'components/molecules/ReadableTimeRangePicker'
import data from 'components/molecules/ReadableTimeRangePicker/data'

import 'react-datepicker/dist/react-datepicker.css'
import { LightTheme, DarkTheme } from './datePickerCss'
import useStyles from './styles'

function injectCss(styles: string) {
  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.setAttribute('id', `dynamicstylesheet`)
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

interface PopoverProps {
  startValue: number
  endValue: number
  datesSet: {
    label: string
    getValue?: () => number
    separator?: boolean
  }[]
  label: string | null | JSX.Element
  handleSelection: (range: number[]) => void
  open: boolean
  darkMode: boolean
  handleClose: () => void
  minDate: Date
  timezone: string
}

export default function PopoverPicker({
  startValue = moment()
    .startOf('day')
    .unix(),
  endValue = moment().unix(),
  datesSet = data,
  label = null,
  handleSelection = () => {},
  open = false,
  darkMode = false,
  handleClose = () => {},
  minDate = new Date('1900-01-01T00:00:00Z'),
  timezone = DEFAULT_TIMEZONE,
}: PopoverProps): JSX.Element {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode, isMobileOnly })
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [startDate, setStartDate] = useState(startValue)
  const [endDate, setEndDate] = useState(endValue)
  const container = useRef(null)
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const disabled = startDate > endDate
  useEffect(() => {
    const stylesheet = document.getElementById('dynamicstylesheet')
    if (stylesheet && stylesheet.parentNode) {
      stylesheet.parentNode.removeChild(stylesheet)
    }
    if (darkMode) {
      injectCss(DarkTheme)
    } else {
      injectCss(LightTheme)
    }
  }, [darkMode])

  const handlingClose = () => {
    handleClose()
    setAnchorEl(null)
  }

  const handleClick = (event: any) => {
    if (open) {
      handlingClose()
    } else {
      setAnchorEl(event.currentTarget)
    }
  }

  const onApply = () => {
    if (!disabled) {
      handleSelection([startDate, endDate])
      handlingClose()
    }
  }

  const handleReadableSelection = (val: number[]) => {
    handleSelection(val)
  }

  const CalendarContainer = ({ children }: any) => {
    return <Portal container={container.current}>{children}</Portal>
  }

  const onStartTimeChange = (date: Date) => {
    if (date) {
      const startTimeDate = utcToZonedTime(date, userTimezone)
      const originalStartDate = utcToZonedTime(
        new Date(startDate * 1000),
        timezone,
      )
      originalStartDate.setHours(
        startTimeDate.getHours(),
        startTimeDate.getMinutes(),
      )
      setStartDate(getUnixTime(zonedTimeToUtc(originalStartDate, timezone)))
    }
  }

  const onEndTimeChange = (date: Date) => {
    if (date) {
      const endTimeDate = utcToZonedTime(date, userTimezone)
      const originalEndDate = utcToZonedTime(new Date(endDate * 1000), timezone)
      originalEndDate.setHours(endTimeDate.getHours(), endTimeDate.getMinutes())
      setEndDate(getUnixTime(zonedTimeToUtc(originalEndDate, timezone)))
    }
  }

  // const open = open // Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  // Legacy code if we wanted to disable people from clicking dates
  // const datesAreOnSameDay = (first: Date, second: Date) => {
  //   return (
  //     first.getFullYear() === second.getFullYear() &&
  //     first.getMonth() === second.getMonth() &&
  //     first.getDate() === second.getDate()
  //   )
  // }

  const maxValue =
    utcToZonedTime(new Date(endValue * 1000), timezone) >
    utcToZonedTime(new Date(), timezone)
      ? utcToZonedTime(new Date(endValue * 1000), timezone)
      : utcToZonedTime(new Date(), timezone)

  const maxDate = endOfDay(maxValue)

  // Legacy code if we wanted to disable people from clicking dates
  // const relMaxDate = datesAreOnSameDay(
  //   utcToZonedTime(new Date(endDate * 1000), timezone),
  //   utcToZonedTime(new Date(startDate * 1000), timezone),
  // )
  //   ? utcToZonedTime(new Date(endDate * 1000), timezone)
  //   : endOfDay(utcToZonedTime(new Date(endDate * 1000), timezone))
  // const relMinDate = datesAreOnSameDay(
  //   utcToZonedTime(new Date(endDate * 1000), timezone),
  //   utcToZonedTime(new Date(startDate * 1000), timezone),
  // )
  //   ? utcToZonedTime(new Date(startDate * 1000), timezone)
  //   : startOfDay(utcToZonedTime(new Date(startDate * 1000), timezone))

  const localMinDate = startOfDay(utcToZonedTime(new Date(minDate), timezone))

  return (
    <div>
      <div
        className={classes.label}
        role='button'
        tabIndex={0}
        aria-describedby={id}
        onClick={handleClick}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            handleClick(e)
          }
        }}
      >
        {label}
      </div>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        // onClose={handlingClose}
        className={classes.popper}
        modifiers={{
          offset: {
            enabled: true,
            offset: '0, 8',
          },
        }}
        // For Popover
        // anchorOrigin={{
        //   vertical: 'bottom',
        //   horizontal: 'center',
        // }}
        // transformOrigin={{
        //   vertical: -16,
        //   horizontal: 'center',
        // }}
      >
        <div className={classes.root} data-testid='popover'>
          <Grid container direction='column'>
            <ReadableTimeRangePicker
              datesSet={datesSet}
              onSelection={handleReadableSelection}
              darkMode={darkMode}
              timezone={timezone}
            />
            <Grid
              container
              direction='row'
              className={classes.timeSelect}
              justify='space-between'
            >
              <DatePicker
                selected={utcToZonedTime(new Date(startDate * 1000), timezone)}
                onChange={(date: Date) => {
                  if (date) {
                    setStartDate(getUnixTime(zonedTimeToUtc(date, timezone)))
                  }
                }}
                placeholderText='Select Start...'
                dateFormat='MMM d, yyyy'
                popperPlacement='top-start'
                className={classes.textField}
                maxDate={maxDate} // relMaxDate
                minDate={localMinDate}
                minTime={localMinDate}
                maxTime={maxDate} // relMaxDate
                popperContainer={CalendarContainer}
                popperProps={{
                  positionFixed: true, // use this to make the popper position: fixed
                }}
                shouldCloseOnSelect={false}
                showPopperArrow={false}
                showYearDropdown
              />
              <DatePicker
                selected={utcToZonedTime(new Date(startDate * 1000), timezone)}
                onChange={onStartTimeChange}
                placeholderText='Select Start Time...'
                showTimeSelect
                showTimeSelectOnly
                popperPlacement='top'
                timeIntervals={15}
                timeCaption='Time'
                dateFormat='h:mm aa'
                className={classes.timeField}
                maxDate={maxDate} // relMaxDate
                minDate={localMinDate}
                minTime={localMinDate}
                maxTime={maxDate} // relMaxDate
                popperContainer={CalendarContainer}
                popperProps={{
                  positionFixed: true, // use this to make the popper position: fixed
                }}
                shouldCloseOnSelect={false}
                showPopperArrow={false}
              />
              <div className={classes.separator}>to</div>
              <DatePicker
                selected={utcToZonedTime(new Date(endDate * 1000), timezone)}
                onChange={(date: Date) => {
                  if (date)
                    setEndDate(getUnixTime(zonedTimeToUtc(date, timezone)))
                }}
                placeholderText='Select End...'
                dateFormat='MMM d, yyyy'
                popperPlacement='top-end'
                className={classes.textField}
                maxDate={maxDate}
                minDate={localMinDate} // relMinDate
                minTime={localMinDate} // relMinDate
                maxTime={maxDate}
                popperContainer={CalendarContainer}
                popperProps={{
                  positionFixed: true, // use this to make the popper position: fixed
                }}
                shouldCloseOnSelect={false}
                showPopperArrow={false}
                showYearDropdown
              />
              <DatePicker
                selected={utcToZonedTime(new Date(endDate * 1000), timezone)}
                onChange={onEndTimeChange}
                placeholderText='Select End Time...'
                showTimeSelect
                showTimeSelectOnly
                popperPlacement='top'
                timeIntervals={15}
                timeCaption='Time'
                dateFormat='h:mm aa'
                className={classes.timeField}
                maxDate={maxDate}
                minDate={localMinDate} // relMinDate
                minTime={localMinDate} // relMinDate
                maxTime={maxDate}
                popperContainer={CalendarContainer}
                popperProps={{
                  positionFixed: true, // use this to make the popper position: fixed
                }}
                shouldCloseOnSelect={false}
                showPopperArrow={false}
              />
            </Grid>
            {disabled && (
              <Grid container justify='flex-start'>
                <Typography className={classes.error}>
                  The end date cannot be before the start date.
                </Typography>
              </Grid>
            )}
            <Grid container justify='space-between'>
              <Button
                color={darkMode ? palette.common.tertiary : 'primary'}
                onClick={handlingClose}
                className={classes.cancel}
                disabled={disabled}
              >
                Cancel
              </Button>

              <Button
                color={darkMode ? palette.common.tertiary : 'primary'}
                onClick={onApply}
                className={classes.apply}
                disabled={disabled}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </div>
        <div
          id='calendar-portal'
          ref={container}
          className={classes.calendarPortal}
        />
      </Popper>
    </div>
  )
}

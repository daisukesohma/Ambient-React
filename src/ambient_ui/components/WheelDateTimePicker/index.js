/*
 * author: aleks@ambient.ai
 * The primary file of the WheelDateTimePicker
 *
 * Example:
 *  <WheelDateTimePicker
 *    initialDate={moment().utc().toDate()}  // you can use Native Date objects
 *    onChange={(date) => {}}
 *    minDate={moment().subtract(5, 'days')} // you can use Native Date objects
 *    maxDate={moment().add(5, 'days')}      // you can use Native Date objects
 *    daysSpeed={10}      // speed of days wheel
 *    hoursSpeed={0.5}      // speed of hours wheel
 *    minutesSpeed={0.5}      // speed of minutes wheel min 0.1 , max 15
 *  />
 *
 */
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import times from 'lodash/times'
import round from 'lodash/round'
import map from 'lodash/map'
import some from 'lodash/some'
import isWithinRange from 'date-fns/isWithinInterval'
import { useDrag, useWheel } from 'react-use-gesture'
import { animated } from 'react-spring'
import { useDebouncedCallback } from 'use-debounce'
import clsx from 'clsx'

import useStyles from './styles'
import './styles.css'
import { msToUnix } from '../../../utils'

const propTypes = {
  initialDate: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  minDate: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  maxDate: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  onChange: PropTypes.func,
  daysSpeed: PropTypes.number,
  hoursSpeed: PropTypes.number,
  minutesSpeed: PropTypes.number,
  secondsInDayCell: PropTypes.number,
  secondsInHourCell: PropTypes.number,
  secondsInMinutesCell: PropTypes.number,
  highlightRanges: PropTypes.array,
}

const defaultProps = {
  initialDate: moment()
    .utc()
    .toDate(),
  minDate: moment()
    .subtract(5, 'days')
    .startOf('day'),
  maxDate: moment()
    .add(5, 'days')
    .endOf('day'),
  onChange: () => {},
  daysSpeed: 10,
  hoursSpeed: 0.5,
  minutesSpeed: 0.5,
  secondsInDayCell: 86400,
  secondsInHourCell: 3600,
  secondsInMinutesCell: 300,
  highlightRanges: [],
}

const is24hr = false
const hourFormat = is24hr ? 'HH' : 'h a'

const WheelDateTimePicker = ({
  initialDate,
  onChange,
  minDate,
  maxDate,
  daysSpeed,
  hoursSpeed,
  minutesSpeed,
  secondsInDayCell,
  secondsInHourCell,
  secondsInMinutesCell,
  highlightRanges,
}) => {
  const classes = useStyles()
  const [date, setDate] = useState(moment(initialDate))

  const daysContainer = useRef(null)
  const dayCell = useRef(null)

  const hoursContainer = useRef(null)
  const hourCell = useRef(null)

  const minutesContainer = useRef(null)
  const minuteCell = useRef(null)

  // emit date updates to onChange function
  useEffect(() => {
    onChange(date)
  }, [date, onChange])

  const minSpeed = 0.1
  const maxSpeed = 15

  const normalizeDeltaAcceleration = useCallback(propsSpeed => {
    let speed = propsSpeed
    if (speed > maxSpeed) {
      console.warn(
        `WheelDateTimePicker: MAX speed ${maxSpeed}. Provided: ${speed}`,
      )
      speed = maxSpeed
    }
    if (speed < minSpeed) {
      console.warn(
        `WheelDateTimePicker: MIN speed ${minSpeed}. Provided: ${speed}`,
      )
      speed = minSpeed
    }
    return speed
  }, [])

  // Set Days Center Position
  useEffect(() => {
    if (daysContainer.current) {
      const startOfDay = date.clone().startOf('day')
      const deltaSeconds = date.diff(startOfDay, 'seconds')
      const cellWidth = dayCell.current.offsetWidth
      const pixelsOffset = (cellWidth / secondsInDayCell) * deltaSeconds
      const scrollCenterPosition =
        (daysContainer.current.scrollWidth -
          daysContainer.current.offsetWidth) /
        2
      daysContainer.current.scrollLeft =
        scrollCenterPosition - cellWidth / 2 + pixelsOffset
    }
  }, [date, secondsInDayCell])

  // Set Hours Center Position
  useEffect(() => {
    if (hoursContainer.current) {
      const startOfHour = date.clone().startOf('hour')
      const deltaSeconds = date.diff(startOfHour, 'seconds')
      const cellWidth = hourCell.current.offsetWidth
      const pixelsOffset = (cellWidth / secondsInHourCell) * deltaSeconds
      const scrollCenterPosition =
        (hoursContainer.current.scrollWidth -
          hoursContainer.current.offsetWidth) /
        2
      hoursContainer.current.scrollLeft =
        scrollCenterPosition - cellWidth / 2 + pixelsOffset
    }
  }, [date, secondsInHourCell])

  // Set Minutes Center Position
  useEffect(() => {
    if (minutesContainer.current) {
      // NOTE: we use cells which contains 5 minutes
      const deltaSeconds = (date.minutes() % 5) * 60 + date.seconds()
      const cellWidth = minuteCell.current.offsetWidth
      const pixelsOffset = (cellWidth / secondsInMinutesCell) * deltaSeconds
      const scrollCenterPosition =
        (minutesContainer.current.scrollWidth -
          minutesContainer.current.offsetWidth) /
        2
      minutesContainer.current.scrollLeft =
        scrollCenterPosition - cellWidth / 2 + pixelsOffset
    }
  }, [date, secondsInMinutesCell])

  const determineNeededCells = useCallback(container => {
    if (!container.current) return 20
    return round(
      container.current.offsetWidth / container.current.children[0].offsetWidth,
    )
  }, [])

  const datesSet = useMemo(() => {
    const currentDate = date.clone().startOf('day')
    const dateCells = [currentDate]
    const negativeDirection = currentDate.clone()
    const positiveDirection = currentDate.clone()
    times(determineNeededCells(hoursContainer), () => {
      negativeDirection.subtract(1, 'day')
      positiveDirection.add(1, 'day')
      dateCells.unshift(negativeDirection.clone())
      dateCells.push(positiveDirection.clone())
    })
    return dateCells
  }, [date, determineNeededCells])

  const hoursSet = useMemo(() => {
    const currentHours = date.clone().startOf('hour')
    const hourCells = [currentHours]
    const negativeDirection = currentHours.clone()
    const positiveDirection = currentHours.clone()
    times(determineNeededCells(hoursContainer), () => {
      negativeDirection.subtract(1, 'hour')
      positiveDirection.add(1, 'hour')
      hourCells.unshift(negativeDirection.clone())
      hourCells.push(positiveDirection.clone())
    })
    return hourCells
  }, [date, determineNeededCells])

  const minutesSet = useMemo(() => {
    const minute = date.minutes() - (date.minutes() % 5)
    const currentMinutes = date
      .clone()
      .set({ minute, second: 0, millisecond: 0 })
    const minuteCells = [currentMinutes]
    const negativeDirection = currentMinutes.clone()
    const positiveDirection = currentMinutes.clone()
    times(determineNeededCells(hoursContainer), () => {
      negativeDirection.subtract(5, 'minutes')
      positiveDirection.add(5, 'minutes')
      minuteCells.unshift(negativeDirection.clone())
      minuteCells.push(positiveDirection.clone())
    })
    return minuteCells
  }, [date, determineNeededCells])

  const applySecondsDelta = useCallback(
    secondsDelta => {
      const newDate =
        secondsDelta < 0
          ? date.clone().add(-secondsDelta, 'seconds')
          : date.clone().subtract(secondsDelta, 'seconds')

      // set min value
      if (minDate.clone().startOf('day') > newDate.clone().startOf('day')) {
        setDate(
          moment(minDate)
            .clone()
            .startOf('day'),
        )
        return false
      }
      // set max value
      if (maxDate.clone().startOf('day') < newDate.clone().startOf('day')) {
        setDate(
          moment(maxDate)
            .clone()
            .endOf('day'),
        )
        return false
      }

      setDate(newDate)
      return true
    },
    [date, minDate, maxDate],
  )

  const moveDays = useCallback(
    ({ movement: [mx], cancel }) => {
      const updated = applySecondsDelta(
        mx *
          daysContainer.current.childElementCount *
          normalizeDeltaAcceleration(daysSpeed),
      )
      if (!updated) cancel()
    },
    [applySecondsDelta, normalizeDeltaAcceleration, daysSpeed],
  )

  const moveHours = useCallback(
    ({ movement: [mx], cancel }) => {
      const updated = applySecondsDelta(
        mx *
          hoursContainer.current.childElementCount *
          normalizeDeltaAcceleration(hoursSpeed),
      )
      if (!updated) cancel()
    },
    [applySecondsDelta, normalizeDeltaAcceleration, hoursSpeed],
  )

  const moveMinutes = useCallback(
    ({ movement: [mx], cancel }) => {
      const updated = applySecondsDelta(
        mx *
          minutesContainer.current.childElementCount *
          normalizeDeltaAcceleration(minutesSpeed),
      )
      if (!updated) cancel()
    },
    [applySecondsDelta, normalizeDeltaAcceleration, minutesSpeed],
  )

  const daysDrag = useDrag(moveDays, { axis: 'x' })
  const daysWheel = useWheel(moveDays, { axis: 'x' })

  const hoursDrag = useDrag(moveHours, { axis: 'x' })
  const hoursWheel = useWheel(moveHours, { axis: 'x' })

  const minutesDrag = useDrag(moveMinutes, { axis: 'x' })
  const minutesWheel = useWheel(moveMinutes, { axis: 'x' })

  const setRef = useCallback((set, index, cell, ref) => {
    // NOTE: Determine center index and set this cell as cell ref
    // eslint-disable-next-line
    if (index === set.length - 1 - (set.length - 1) / 2) cell.current = ref
  }, [])

  const normalizedDateRanges = useMemo(() => {
    return map(highlightRanges, range => ({
      start: moment.unix(msToUnix(range.startTs)).toDate(),
      end: moment.unix(msToUnix(range.endTs)).toDate(),
    }))
  }, [highlightRanges])

  const inCatalogue = useCallback(
    (relevantDate, step) => {
      const start = relevantDate.toDate()
      const end = relevantDate
        .clone()
        .add(step.amount, step.unit)
        .toDate()
      return some(
        normalizedDateRanges,
        range =>
          isWithinRange(range.start, { start, end }) ||
          isWithinRange(range.end, { start, end }),
      )
    },
    [normalizedDateRanges],
  )

  const setNewDate = useDebouncedCallback(value => {
    const newDate = moment(value)
    if (newDate.isValid()) setDate(newDate)
  }, 500)

  return (
    <div>
      <div className={clsx('am-overline', classes.displayDateContainer)}>
        <TextField
          type='datetime-local'
          inputProps={{ step: 1 }}
          defaultValue={date.format('YYYY-MM-DDTHH:mm:ss')}
          onChange={event => {
            setNewDate.callback(event.currentTarget.value)
          }}
          InputProps={{ className: classes.textField }}
        />
      </div>
      {/* Date Picker Part. Consistency is important */}
      <div className={classes.root}>
        <div className={classes.centerBar} />

        <animated.div
          {...daysDrag()}
          {...daysWheel()}
          ref={daysContainer}
          className={classes.container}
        >
          {datesSet.map((dateItem, index) => (
            <div
              key={index}
              ref={ref => setRef(datesSet, index, dayCell, ref)}
              className={clsx('am-overline', classes.dayCell, {
                [classes.disabledCell]:
                  minDate.clone().startOf('day') > dateItem ||
                  maxDate.clone().startOf('day') < dateItem,
              })}
              onDoubleClick={() => setDate(dateItem)}
            >
              <div className={classes.cellText}>
                <div style={{ fontSize: 12 }}>{dateItem.format('MMM DD')}</div>
                <div style={{ fontSize: 16 }}>{dateItem.format('ddd')}</div>
              </div>
            </div>
          ))}
        </animated.div>

        <animated.div
          {...hoursDrag()}
          {...hoursWheel()}
          ref={hoursContainer}
          className={classes.container}
        >
          {hoursSet.map((hour, index) => {
            return (
              <div
                key={index}
                ref={ref => setRef(hoursSet, index, hourCell, ref)}
                className={clsx('am-overline', classes.hourCell)}
                onDoubleClick={() => setDate(hour)}
              >
                <div className={classes.cellText}>
                  <div style={{ fontSize: 12 }}>
                    {moment(hour).format(hourFormat)}
                  </div>
                </div>
                {inCatalogue(hour, {
                  amount: 1,
                  unit: 'hour',
                }) && <div className={classes.motionBar} />}
              </div>
            )
          })}
        </animated.div>

        <animated.div
          {...minutesDrag()}
          {...minutesWheel()}
          ref={minutesContainer}
          className={classes.container}
        >
          {minutesSet.map((minute, index) => (
            <div
              key={index}
              ref={ref => setRef(minutesSet, index, minuteCell, ref)}
              className={clsx('am-overline', classes.minuteCell)}
              onDoubleClick={() => setDate(minute)}
            >
              <div className={classes.cellText}>
                <div style={{ fontSize: 12 }}>{minute.minutes()}</div>
              </div>
              {inCatalogue(minute, {
                amount: 5,
                unit: 'minutes',
              }) && <div className={classes.motionBarSmall} />}
            </div>
          ))}
        </animated.div>
      </div>
    </div>
  )
}

WheelDateTimePicker.propTypes = propTypes
WheelDateTimePicker.defaultProps = defaultProps

export default WheelDateTimePicker

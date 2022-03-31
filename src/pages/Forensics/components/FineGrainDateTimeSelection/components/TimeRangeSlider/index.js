import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector, batch } from 'react-redux'
import Slider from '@material-ui/core/Slider'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'

import useForensicData from '../../../../hooks/useForensicData'
import searchRangeSelector from 'selectors/forensics/searchRange'
import selectionRangeSelector from 'selectors/forensics/selectionRange'
import isSelectionFilteredSelector from 'selectors/forensics/isSelectionFiltered'
import {
  setSearchTsRange,
  setSelectionTsRange,
  setRangePresetIndex,
} from 'redux/forensics/actions'
import { useFlexStyles, useCursorStyles } from 'common/styles/commonStyles'
import { getCustomIndex } from '../ReadableTimeRangePicker/data'

import useStyles from './styles'

ValueLabelComponent.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  value: PropTypes.number,
}

function formatTime(v) {
  return moment.unix(v).format('MMM D h:mm A')
}

function ValueLabelComponent(props) {
  const { children, value } = props // {open}
  const isOpen = useSelector(isSelectionFilteredSelector)

  return (
    <Tooltip
      id='slider-component'
      enterTouchDelay={0}
      placement='top'
      title={formatTime(value)}
      open={isOpen}
    >
      {children}
    </Tooltip>
  )
}

TimeRangeSlider.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  onChangeCommitted: PropTypes.func,
  setSelectorType: PropTypes.func,
}

TimeRangeSlider.defaultProps = {
  start: 0,
  end: 0,
  onChangeCommitted: () => {},
  setSelectorType: () => {},
}

export default function TimeRangeSlider({ setSelectorType }) {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const dispatch = useDispatch()

  const selectionRange = useSelector(selectionRangeSelector)
  const searchRange = useSelector(searchRangeSelector)
  const isSelectionFiltered = useSelector(isSelectionFilteredSelector)
  const classes = useStyles({ isSelectionFiltered })
  const [value, setValue] = useState(searchRange)
  const [fetchRegionStats, fetchEntities] = useForensicData()

  const handleChange = (event, newValue) => {
    // these checks seem to prevent a lot of errors
    if (newValue && newValue[0] && newValue[1] && newValue[1] > newValue[0]) {
      const copy = newValue.slice()
      setValue(copy)
    }
  }

  // should i do this
  useEffect(() => {
    setValue(searchRange)
  }, [searchRange])

  const handleChangeCommitted = (event, newValue) => {
    handleSearchRange(newValue)
  }

  const handleSearchRange = range => {
    batch(() => {
      dispatch(setSearchTsRange(range))
      fetchRegionStats({ startTs: range[0], endTs: range[1] }) // pass in range so we can use batch
      fetchEntities({ startTs: range[0], endTs: range[1] })
      dispatch(setRangePresetIndex(getCustomIndex()))
    })
  }

  const handleSelectionRange = range => {
    batch(() => {
      dispatch(setSelectionTsRange(range))
      dispatch(setRangePresetIndex(getCustomIndex()))
    })
  }

  const handleReset = () => {
    handleSearchRange(selectionRange)
    setValue(selectionRange)
  }

  const getZoomOutRange = (range, percentChange = 0.1) => {
    const start = range[0]
    const end = range[1]
    const duration = end - start
    const zoomAmount = Math.floor(percentChange * duration)
    return [start - zoomAmount, end + zoomAmount]
    // FUTURE @Eric - shouldn't be able to set into future
  }

  const getZoomInRange = (range, percentChange = 0.1) => {
    const start = range[0]
    const end = range[1]
    const duration = end - start
    const zoomAmount = Math.floor(percentChange * duration)
    return [start + zoomAmount, end - zoomAmount]
    // FUTURE @Eric - shouldn't be able to set into future, shouldn't be able to new start > new end
  }

  // TODO: @rodaan may want to keep this for future
  // const getRangeDuration = range => {
  //   const duration = moment.duration(range[1] - range[0], 'seconds')
  //   const days = duration.days()
  //   const hours = duration.hours()
  //   const minutes = duration.minutes()
  //   const seconds = duration.seconds()

  //   if (days >= 1) {
  //     return `${days} days, ${hours} hours`
  //   }
  //   if (hours >= 1) {
  //     return `${hours} hours, ${minutes} minutes`
  //   }
  //   if (minutes >= 1) {
  //     return `${minutes} minutes, ${seconds} seconds`
  //   }
  //   return `${seconds} seconds`
  // }

  const getMarks = () => {
    const duration = moment.duration(
      selectionRange[1] - selectionRange[0],
      'seconds',
    )
    const days = duration.as('days')
    const hours = duration.as('hours')
    const minutes = duration.as('minutes')

    const secInHour = 60 * 60
    const secInDay = secInHour * 24

    if (days > 1) {
      const firstMark = moment
        .unix(selectionRange[0])
        .endOf('day')
        .unix()
      const dayMarks = [...Array(Math.floor(days)).keys()].map(dayIndex => ({
        value: firstMark + dayIndex * secInDay,
        label: '',
      }))

      return dayMarks
    }

    if (hours > 1) {
      const firstMark = moment
        .unix(selectionRange[0])
        .endOf('hour')
        .unix()
      const hourMarks = [...Array(Math.floor(hours)).keys()].map(hourIndex => ({
        value: firstMark + hourIndex * secInHour,
        label: '',
      }))

      return hourMarks
    }

    if (hours <= 1) {
      const firstMark = moment
        .unix(selectionRange[0])
        .endOf('minute')
        .unix()

      // /FUTURE @eric this logic adds in marks at the first minute after start and every 10 minutes
      // after that. If we want marks to be on the :10, :20, etc. minute marks of the hour,
      // we'll have to modify firstMark

      const minuteIncrement = 10
      const minuteMarks = [
        ...Array(Math.floor(minutes / minuteIncrement)).keys(),
      ].map(index => ({
        value: firstMark + index * minuteIncrement * 60,
        label: '',
      }))

      return minuteMarks
    }

    return []
  }

  return (
    <div className={classes.root} id='timeRangeSlider'>
      <div
        className={clsx(
          'am-overline',
          classes.topLabelContainer,
          flexClasses.column,
          flexClasses.centerAll,
        )}
      >
        <div style={{ marginBottom: 4 }}>
          <span>Selected Time Range</span>
        </div>
        <span>
          {`${formatTime(value[0])} - ${formatTime(value[1])}`}
        </span>
      </div>
      <div>
        <Slider
          min={selectionRange[0]}
          max={selectionRange[1]}
          value={value}
          marks={getMarks()}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
        />
        <div
          className={clsx(
            flexClasses.row,
            flexClasses.centerAll,
            'am-overline',
          )}
          style={{ marginTop: -8 }}
        >
          <span style={{ marginRight: 8 }}>
            Zoom
          </span>
          <Button
            color='default'
            variant='outlined'
            style={{ marginRight: 8 }}
            className={clsx(
              cursorClasses.pointer,
              cursorClasses.clickableText,
              classes.zoomButton,
            )}
            onClick={() => handleSelectionRange(getZoomInRange(selectionRange))}
          >
            In
          </Button>
          <Button
            color='default'
            variant='outlined'
            style={{ marginRight: 8 }}
            className={clsx(
              cursorClasses.pointer,
              cursorClasses.clickableText,
              classes.zoomButton,
            )}
            onClick={() =>
              handleSelectionRange(getZoomOutRange(selectionRange))
            }
          >
            Out
          </Button>
          <Button
            color='default'
            variant='outlined'
            className={clsx(
              cursorClasses.pointer,
              cursorClasses.clickableText,
              classes.zoomButton,
            )}
            onClick={() => handleSelectionRange(searchRange)}
          >
            To Selection
          </Button>
          <Button
            color='default'
            variant='outlined'
            className={clsx(
              cursorClasses.pointer,
              cursorClasses.clickableText,
              classes.zoomButton,
            )}
            onClick={handleReset}
          >
            Reset
          </Button>
          {/* <span */}
          {/*  className={clsx( */}
          {/*    cursorClasses.pointer, */}
          {/*    cursorClasses.clickableText, */}
          {/*    classes.zoomButton, */}
          {/*  )} */}
          {/*  onClick={() => handleSelectionRange(getZoomInRange(selectionRange))} */}
          {/* > */}
          {/*  In */}
          {/* </span> */}
          {/* <span */}
          {/*  className={clsx( */}
          {/*    cursorClasses.pointer, */}
          {/*    cursorClasses.clickableText, */}
          {/*    classes.zoomButton, */}
          {/*  )} */}
          {/*  onClick={() => */}
          {/*    handleSelectionRange(getZoomOutRange(selectionRange)) */}
          {/*  } */}
          {/* > */}
          {/*  Out */}
          {/* </span> */}
          {/* <span */}
          {/*  className={clsx( */}
          {/*    cursorClasses.pointer, */}
          {/*    cursorClasses.clickableText, */}
          {/*    classes.zoomButton, */}
          {/*  )} */}
          {/*  onClick={() => handleSelectionRange(searchRange)} */}
          {/* > */}
          {/*  To Selection */}
          {/* </span> */}
          {/* <span */}
          {/*  className={clsx( */}
          {/*    cursorClasses.pointer, */}
          {/*    cursorClasses.clickableText, */}
          {/*    classes.zoomButton, */}
          {/*  )} */}
          {/*  onClick={handleReset} */}
          {/* > */}
          {/*  Reset */}
          {/* </span> */}
        </div>
      </div>
    </div>
  )
}

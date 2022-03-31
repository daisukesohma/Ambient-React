import React, { useState, useMemo, useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { isMobile, isTablet } from 'react-device-detect'
import startOfDay from 'date-fns/startOfDay'
import getUnixTime from 'date-fns/getUnixTime'
import {
  DEFAULT_TIMEZONE,
  formatUnixTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'

import Icons from '../icons'

import PopoverPicker from './PopoverPicker'
import useStyles from './styles'
import data from './ReadableTimeRangePicker/data'

const { Clock, ArrowDown, ArrowUp } = Icons

const propTypes = {
  datesSet: PropTypes.array,
  darkMode: PropTypes.bool,
  startTs: PropTypes.number,
  endTs: PropTypes.number,
  isWheel: PropTypes.bool,
  onChange: PropTypes.func,
  minDate: PropTypes.instanceOf(Date),
  preSetsInLabels: PropTypes.bool,
  timezone: PropTypes.string,
  rootStyles: PropTypes.object,
}

const defaultProps = {
  datesSet: data,
  darkMode: false,
  startTs: getUnixTime(startOfDay(new Date())),
  endTs: getUnixTime(new Date()),
  isWheel: false,
  onChange: () => {},
  minDate: new Date('1900-01-01'),
  preSetsInLabels: false,
  timezone: DEFAULT_TIMEZONE,
  rootStyles: {},
}

const DateTimeRangePickerWithPopover = ({
  datesSet,
  darkMode,
  onChange,
  startTs,
  endTs,
  isWheel,
  minDate,
  preSetsInLabels,
  timezone,
  rootStyles,
}) => {
  const { palette } = useTheme()
  const mobile = isMobile && !isTablet
  const classes = useStyles({ darkMode, mobile })

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleSelection = useCallback(
    val => {
      onChange(val)
      setIsPopoverOpen(false)
    },
    [onChange],
  )

  const determinePresetLabel = useMemo(() => {
    const offset = endTs - startTs
    if (preSetsInLabels) {
      const pair = datesSet.find(set => set.getValue() === offset)
      if (pair) return pair.label
    }
    return `${formatUnixTimeWithTZ(
      startTs,
      'MMM dd h:mma zzz',
      timezone,
    )} ~ ${formatUnixTimeWithTZ(endTs, 'MMM dd h:mma zzz', timezone)}`
  }, [preSetsInLabels, startTs, endTs, datesSet, timezone])

  return (
    <div className={classes.rangePopoverRoot} style={rootStyles}>
      <PopoverPicker
        datesSet={datesSet}
        open={isPopoverOpen}
        label={
          <div
            className={classes.dateTimeLabel}
            onClick={() => {
              setIsPopoverOpen(!isPopoverOpen)
            }}
          >
            <Clock stroke={darkMode ? palette.grey[50] : palette.grey[800]} />
            <div className={classes.datetime}>{determinePresetLabel}</div>

            {isPopoverOpen ? (
              <ArrowUp
                stroke={darkMode ? palette.grey[50] : palette.grey[800]}
              />
            ) : (
              <ArrowDown
                stroke={darkMode ? palette.grey[50] : palette.grey[800]}
              />
            )}
          </div>
        }
        handleSelection={handleSelection}
        startValue={startTs}
        endValue={endTs}
        handleClose={() => setIsPopoverOpen(false)}
        isWheel={isWheel}
        darkMode={darkMode}
        minDate={minDate}
        timezone={timezone}
      />
    </div>
  )
}

DateTimeRangePickerWithPopover.defaultProps = defaultProps
DateTimeRangePickerWithPopover.propTypes = propTypes

export default DateTimeRangePickerWithPopover

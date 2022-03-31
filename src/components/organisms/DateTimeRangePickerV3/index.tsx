import React, { useState, useMemo, useCallback } from 'react'
import { isMobile, isTablet } from 'react-device-detect'
import { useTheme } from '@material-ui/core/styles'
import startOfDay from 'date-fns/startOfDay'
import getUnixTime from 'date-fns/getUnixTime'
// src
import {
  DEFAULT_TIMEZONE,
  formatUnixTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'
import Icons from 'ambient_ui/components/icons'
import PopoverPicker from 'components/molecules/PopoverPicker'
import data from 'components/molecules/ReadableTimeRangePicker/data'

import useStyles from './styles'

const { ArrowDown, ArrowUp } = Icons

interface Props {
  datesSet?: {
    label: string
    getValue?: () => number
    separator?: boolean
  }[]
  darkMode: boolean
  startTs: number
  endTs: number
  onChange: (value: any) => void
  minDate?: Date
  timezone?: string
  rootStyles?: { margin?: number }
  preSetsInLabels?: boolean
}

const defaultProps = {
  datesSet: data,
  minDate: new Date('1900-01-01T00:00:00Z'),
  timezone: DEFAULT_TIMEZONE,
  preSetsInLabels: false,
  rootStyles: {},
}

const DateTimeRangePickerV3 = ({
  datesSet = data,
  darkMode = false,
  onChange = () => {},
  startTs = getUnixTime(startOfDay(new Date())),
  endTs = getUnixTime(new Date()),
  minDate = new Date('1900-01-01T00:00:00Z'),
  timezone = DEFAULT_TIMEZONE,
  preSetsInLabels = false,
  rootStyles = {},
}: Props): JSX.Element => {
  const { palette } = useTheme()
  const mobile = isMobile && !isTablet
  const classes = useStyles({ darkMode, mobile })

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleSelection = useCallback(
    (val: any) => {
      onChange(val)
      setIsPopoverOpen(false)
    },
    [onChange],
  )

  const determinePresetLabel = useMemo(() => {
    const offset = endTs - startTs
    if (preSetsInLabels) {
      const pair = datesSet.find(set => {
        return !set.separator && set.getValue && set.getValue() === offset
      })
      if (pair) return pair.label
    }
    return `${formatUnixTimeWithTZ(
      startTs,
      'MMM dd, yyyy h:mma zzz',
      timezone,
    )} ~ ${formatUnixTimeWithTZ(endTs, 'MMM dd, yyyy h:mma zzz', timezone)}`
  }, [startTs, endTs, timezone, preSetsInLabels, datesSet])

  const popoverLabel = (
    <div
      className={classes.dateTimeLabel}
      data-testid='popoverClick'
      onClick={() => {
        setIsPopoverOpen(!isPopoverOpen)
      }}
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          setIsPopoverOpen(!isPopoverOpen)
        }
      }}
    >
      <div className={classes.datetime} data-testid='datePickerLabel'>
        {determinePresetLabel}
      </div>

      {isPopoverOpen ? (
        /* @ts-ignore */
        <ArrowUp stroke={darkMode ? palette.grey[50] : palette.grey[800]} />
      ) : (
        <ArrowDown stroke={darkMode ? palette.grey[50] : palette.grey[800]} />
      )}
    </div>
  )

  return (
    <div className={classes.rangePopoverRoot} style={rootStyles}>
      <PopoverPicker
        datesSet={datesSet}
        open={isPopoverOpen}
        label={popoverLabel}
        handleSelection={handleSelection}
        startValue={startTs}
        endValue={endTs}
        handleClose={() => setIsPopoverOpen(false)}
        darkMode={darkMode}
        minDate={minDate}
        timezone={timezone}
      />
    </div>
  )
}

DateTimeRangePickerV3.defaultProps = defaultProps

export default DateTimeRangePickerV3

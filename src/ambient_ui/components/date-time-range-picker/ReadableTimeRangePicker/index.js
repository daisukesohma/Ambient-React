import React from 'react'
import PropTypes from 'prop-types'
import { Wheel } from 'ambient_ui'
import debounce from 'lodash/debounce'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import tsAtMidnight from 'utils/dateTime/tsAtMidnight'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'

import data, { TODAY_SINCE_MIDNIGHT } from './data'
import { msToUnix } from '../../../../utils'

const defaultProps = {
  onSelection: () => {},
  isWheel: false,
  darkMode: false,
  datesSet: data,
  timezone: DEFAULT_TIMEZONE,
}

const propTypes = {
  isWheel: PropTypes.bool,
  onSelection: PropTypes.func,
  darkMode: PropTypes.bool,
  datesSet: PropTypes.array,
  timezone: PropTypes.string,
}

const useStyles = makeStyles(({ palette }) => ({
  optionsContainer: {
    padding: '0 8px',
  },
  option: ({ darkMode }) => ({
    padding: 4,
    color: darkMode ? palette.grey[50] : palette.grey[800],
    fontSize: 12,
    cursor: 'pointer',
    '&:hover': {
      color: palette.primary.main,
    },
  }),
}))

const ReadableTimeRangePicker = ({
  onSelection,
  isWheel,
  darkMode,
  datesSet,
  timezone,
}) => {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })

  const handleWheelSelection = s => {
    const index = s.details().relativeSlide
    const value = index >= 0 ? datesSet[index].getValue() : null // in case index is negative
    const now = msToUnix(Date.now())

    if (value) {
      // for null value of "custom"
      if (datesSet[index].label === TODAY_SINCE_MIDNIGHT) {
        // if today since midnight, calculate midnight time based on timezone
        onSelection([tsAtMidnight(0, timezone), now], index)
      } else {
        onSelection([now - value, now], index)
      }
    }
  }

  const handleOptionSelection = index => () => {
    const value = datesSet[index].getValue()
    const now = msToUnix(Date.now())

    if (value) {
      // for null value of "custom"
      if (datesSet[index].label === TODAY_SINCE_MIDNIGHT) {
        // if today since midnight, calculate midnight time based on timezone
        onSelection([tsAtMidnight(0, timezone), now], index)
      } else {
        onSelection([now - value, now], index)
      }
    }
  }

  return (
    <div
      style={{
        height: isWheel ? 150 : 'unset',
        display: 'flex',
        justifyContent: 'center',
        background: darkMode ? palette.grey[800] : palette.grey[50],
      }}
    >
      <div style={{ width: 160 }}>
        {isWheel ? (
          <Wheel
            initIdx={0}
            length={datesSet.length}
            width={160}
            setValue={(_, idx) => datesSet[idx].label}
            darkMode={darkMode}
            onChange={debounce(handleWheelSelection, 60)}
          />
        ) : (
          <div className={classes.optionsContainer}>
            {datesSet.map((option, index) => (
              <div
                key={index}
                className={classes.option}
                onClick={handleOptionSelection(index)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

ReadableTimeRangePicker.defaultProps = defaultProps
ReadableTimeRangePicker.propTypes = propTypes

export default ReadableTimeRangePicker

import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import map from 'lodash/map'
import tsAtMidnight from 'utils/dateTime/tsAtMidnight'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import DividerWithText from 'components/atoms/DividerWithText'
import { msToUnix } from 'utils'

import data, { TODAY_SINCE_MIDNIGHT } from './data'
import useStyles from './styles'

interface Props {
  onSelection: (range: number[], index: number) => void
  darkMode: boolean
  datesSet: {
    label: string
    getValue?: () => number
    separator?: boolean
  }[]
  timezone: string
}

export default function ReadableTimeRangePicker({
  onSelection = () => {},
  darkMode = false,
  datesSet = data,
  timezone = DEFAULT_TIMEZONE,
}: Props): JSX.Element {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })

  const handleOptionSelection = (index: number) => () => {
    const selected = datesSet[index]
    if (!selected.separator && selected.getValue) {
      const value = selected.getValue()
      const now = msToUnix(new Date().getTime())

      if (value) {
        // for null value of "custom"
        if (selected.label === TODAY_SINCE_MIDNIGHT) {
          // if today since midnight, calculate midnight time based on timezone
          onSelection([tsAtMidnight(0, timezone), now], index)
        } else {
          onSelection([now - value, now], index)
        }
      }
    }
  }

  return (
    <div
      style={{
        height: 'unset',
        justifyContent: 'center',
        background: darkMode ? palette.grey[800] : palette.grey[50],
        width: '100%',
      }}
    >
      <div style={{ width: '100%' }}>
        <div className={classes.optionsContainer}>
          {map(datesSet, (option, index) => {
            if (option.separator) {
              return (
                <DividerWithText
                  key={index}
                  text={option.label}
                  darkMode={darkMode}
                  fontSize={10}
                  borderSize={1}
                  contentWidth='40%'
                />
              )
            }
            return (
              <div
                key={index}
                className={classes.option}
                onClick={handleOptionSelection(index)}
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    handleOptionSelection(index)
                  }
                }}
              >
                {option.label}
              </div>
            )
          })}
          <DividerWithText
            text='Custom Time'
            darkMode={darkMode}
            borderSize={1}
            fontSize={10}
            contentWidth='40%'
          />
        </div>
      </div>
    </div>
  )
}

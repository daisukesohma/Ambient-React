import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icons } from 'ambient_ui'
import moment from 'moment'

const { Calendar } = Icons

function DateDisplay({ darkMode, datePickerSelectionTS, toggleDatePicker }) {
  const { palette } = useTheme()

  const styles = {
    buttonContainer: {
      alignItems: 'center',
      display: 'flex',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    },
    text: {
      color: palette.common.black,
      padding: 3,
      fontSize: 16,
      lineHeight: '24px',
      letterSpacing: '0.5px',
    },
  }

  return (
    <div style={styles.buttonContainer} onClick={toggleDatePicker}>
      <Calendar {...(darkMode && { stroke: palette.common.white })} />
      <div
        style={{
          ...styles.text,
          ...{ color: darkMode ? palette.common.white : palette.common.black },
        }}
      >
        {moment.unix(datePickerSelectionTS).format('MMM D, YYYY')}
      </div>
    </div>
  )
}

DateDisplay.defaultProps = {
  darkMode: false,
  datePickerSelectionTS: null,
  toggleDatePicker: () => {},
}

DateDisplay.propTypes = {
  darkMode: PropTypes.bool,
  datePickerSelectionTS: PropTypes.number,
  toggleDatePicker: PropTypes.func,
}

export default DateDisplay

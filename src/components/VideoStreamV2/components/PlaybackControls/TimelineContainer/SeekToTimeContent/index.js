import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import { Button } from 'ambient_ui'
import TimePicker from 'rc-time-picker'
import moment from 'moment'
import 'rc-time-picker/assets/index.css'
import './rc-time-picker-overrides.css' // overrides

const showSecond = true
const str = showSecond ? 'HH:mm:ss' : 'HH:mm'

const useStyles = makeStyles({
  card: {
    minWidth: 250,
  },
  cardContent: {
    textAlign: 'left',
  },
})

const SeekToTimeContent = ({
  onSeekToTimeChange,
  handleSeekSelection,
  toggleVisible,
}) => {
  const { palette } = useTheme()
  // FUTURE: @eric Slight enhancement desired where when you open component,
  // it initializes with current time. However, time doesn't change to current
  // time if you close and re-open. May have to destroy instance and re-initialize
  // I tested defaultValue and defaultOpenValue props to no avail.

  const classes = useStyles()

  // selected time
  const time = moment() // initialize with current time
  const [hour, setHour] = useState(time.format('H'))
  const [min, setMin] = useState(time.format('mm'))

  const styles = {
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: 150,
    },
    titleContainer: {
      marginBottom: 15,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: 0.15,
      color: palette.common.black,
    },
    actions: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
  }

  const _setTime = momentTime => {
    setHour(momentTime.format('H'))
    setMin(momentTime.format('mm'))
  }

  // Handles every time change within the TimePicker
  // This fires on hour, minute and second change
  //
  const onChange = val => {
    if (val) {
      _setTime(val)
      onSeekToTimeChange(val.format(str)) // format from moment() to string
    }
  }

  // disable hours after current time
  const generateDisabledHours = () => {
    const allHours = Array.from({ length: 24 }, (v, k) => k + 1)
    const currentHour = moment().format('H')
    return allHours.filter(h => h > currentHour)
  }

  // if hour is current, disable minutes after current time
  const generateDisabledMinutes = () => {
    const allMinutes = Array.from({ length: 60 }, (v, k) => k)
    const currentHour = moment().format('H')
    if (currentHour === hour) {
      return allMinutes.filter(m => m > moment().format('mm'))
    }
    return []
  }

  // if hour and minute are current, disable seconds after current time
  const generateDisabledSeconds = () => {
    const allSeconds = Array.from({ length: 60 }, (v, k) => k)
    const currentHour = moment().format('H')
    const currentMinute = moment().format('mm')
    if (currentHour === hour && currentMinute === min) {
      return allSeconds.filter(s => s > moment().format('ss'))
    }
    return []
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <div style={styles.titleContainer}>
            <div style={styles.title}>Seek to Time</div>
          </div>
          <div>
            <TimePicker
              focusOnOpen
              disabledHours={generateDisabledHours}
              disabledMinutes={generateDisabledMinutes}
              disabledSeconds={generateDisabledSeconds}
              hideDisabledOptions
              style={styles.container}
              showSecond={showSecond}
              defaultValue={moment()}
              className='seek-time'
              onChange={onChange}
              allowEmpty={false}
            />
          </div>
        </CardContent>
        <CardActions>
          <div style={styles.actions}>
            <Button variant='text' color='primary' onClick={toggleVisible}>
              Cancel
            </Button>
            <Button
              variant='text'
              color='primary'
              onClick={() => {
                toggleVisible()
                handleSeekSelection()
              }}
            >
              Go
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>
  )
}

SeekToTimeContent.defaultProps = {
  onSeekToTimeChange: () => {},
  handleSeekSelection: () => {},
  toggleVisible: () => {},
}
SeekToTimeContent.propTypes = {
  onSeekToTimeChange: PropTypes.func,
  handleSeekSelection: PropTypes.func,
  toggleVisible: PropTypes.func,
}

export default SeekToTimeContent

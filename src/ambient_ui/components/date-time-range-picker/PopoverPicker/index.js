import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import moment from 'moment'
import { useFlexStyles } from 'common/styles/commonStyles'
import { isMobileOnly } from 'react-device-detect'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'

import ReadableTimeRangePicker from '../ReadableTimeRangePicker'
import Button from '../../buttons/Button'
import data from '../ReadableTimeRangePicker/data'

import useStyles from './styles'
import DatePicker from './DatePicker'

const propTypes = {
  datesSet: PropTypes.array,
  label: PropTypes.node,
  handleSelection: PropTypes.func,
  startValue: PropTypes.number,
  endValue: PropTypes.number,
  open: PropTypes.bool,
  isWheel: PropTypes.bool,
  darkMode: PropTypes.bool,
  handleClose: PropTypes.func,
  minDate: PropTypes.instanceOf(Date),
  timezone: PropTypes.string,
}

const defaultProps = {
  datesSet: data,
  label: null,
  handleSelection: () => {},
  startValue: moment()
    .startOf('day')
    .unix(),
  endValue: moment().unix(),
  open: false,
  isWheel: false,
  darkMode: false,
  handleClose: () => {},
  minDate: new Date('1900-01-01'),
  timezone: DEFAULT_TIMEZONE,
}

const PopoverPicker = ({
  datesSet,
  label,
  handleSelection,
  startValue,
  endValue,
  open,
  isWheel,
  darkMode,
  handleClose,
  minDate,
  timezone,
}) => {
  const classes = useStyles({ darkMode, isMobileOnly })
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [investigationRange, setInvestigationRange] = React.useState([])

  useEffect(() => {
    setInvestigationRange([startValue, endValue])
  }, [startValue, endValue])

  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleAbsoluteRangeChange = range => setInvestigationRange(range)
  const handleButtonPress = () => handleSelection(investigationRange)

  const handlingClose = () => {
    handleClose()
    setAnchorEl(null)
  }

  const handleReadableSelection = val => {
    setInvestigationRange(val)
    if (!isWheel) {
      handleSelection(val)
    }
  }

  // const open = open // Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const flexClasses = useFlexStyles()
  return (
    <div>
      <div aria-describedby={id} onClick={handleClick}>
        {label}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlingClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={8}>
              <div
                className={clsx(
                  'am-overline',
                  flexClasses.row,
                  flexClasses.centerAll,
                  classes.title,
                )}
                style={{ width: '100%', marginBottom: 16 }}
              >
                Absolute Range
              </div>
              <DatePicker
                darkMode={darkMode}
                range={investigationRange}
                handleChange={handleAbsoluteRangeChange}
                minDate={minDate}
                timezone={timezone}
              />
              <Button onClick={handleButtonPress} className={classes.apply}>
                Apply
              </Button>
            </Grid>
            <Grid item xs={4} className={classes.relativeRange}>
              <div
                className={clsx(
                  'am-overline',
                  flexClasses.row,
                  flexClasses.centerAll,
                  classes.title,
                )}
                style={{ width: '100%', marginBottom: 16 }}
              >
                Relative Range
              </div>
              <ReadableTimeRangePicker
                datesSet={datesSet}
                onSelection={handleReadableSelection}
                isWheel={isWheel}
                darkMode={darkMode}
                timezone={timezone}
              />
            </Grid>
          </Grid>
        </div>
      </Popover>
    </div>
  )
}

PopoverPicker.defaultProps = defaultProps
PopoverPicker.propTypes = propTypes

export default PopoverPicker

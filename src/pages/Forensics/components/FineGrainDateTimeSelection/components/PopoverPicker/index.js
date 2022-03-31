import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector, batch } from 'react-redux'
import Popover from '@material-ui/core/Popover'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import moment from 'moment'
import {
  setSelectionTsRange,
  setSearchTsRange,
  setRangePresetIndex,
} from 'redux/forensics/actions'
import { useFlexStyles } from 'common/styles/commonStyles'

import useForensicData from '../../../../hooks/useForensicData'
import { getCustomIndex } from '../ReadableTimeRangePicker/data'
import ReadableTimeRangePicker from '../ReadableTimeRangePicker'

import DatePicker from './DatePicker'
import useStyles from './styles'

const defaultProps = {
  label: '',
}

const propTypes = {
  label: PropTypes.string,
}

function PopoverPicker({ label }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const investigationRange = useSelector(
    state => state.forensics.selectionTsRange,
  )
  const [fetchRegionStats, fetchEntities] = useForensicData()

  const handleDateChange = times => {
    const range = [moment(times[0]).unix(), moment(times[1]).unix()]
    batch(() => {
      dispatch(setSelectionTsRange(range))

      dispatch(setRangePresetIndex(getCustomIndex()))
      fetchRegionStats({ startTs: range[0], endTs: range[1] }) // pass in range so we can use batch
      fetchEntities({ startTs: range[0], endTs: range[1] })
    })
    dispatch(setSearchTsRange(range))
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
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
        onClose={handleClose}
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
                )}
                style={{ width: '100%', marginBottom: 16 }}
              >
                Absolute Range
              </div>
              <DatePicker
                range={investigationRange}
                handleChange={handleDateChange}
              />
            </Grid>
            <Grid item xs={4}>
              <div
                className={clsx(
                  'am-overline',
                  flexClasses.row,
                  flexClasses.centerAll,
                )}
                style={{ width: '100%', marginBottom: 16 }}
              >
                Relative Range
              </div>
              <ReadableTimeRangePicker />
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

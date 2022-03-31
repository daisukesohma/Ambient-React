import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import DriveEtaIcon from '@material-ui/icons/DriveEta'
import Popover from '@material-ui/core/Popover'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import StopIcon from '@material-ui/icons/Stop'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import map from 'lodash/map'
// src
import Tooltip from 'components/Tooltip'
import { setVehicleFilters } from 'redux/forensics/actions'
import useStyles from './styles'

const typeMap = ['Sedan', 'SUV', 'Van', 'Pickup Truck']

const colorMap = {
  red: 'red',
  blue: 'blue',
  yellow: 'yellow',
  green: 'green',
  black: 'black',
  white: 'white/silver/grey',
}

export default function VehicleFilter({ onChange }) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const type = useSelector(state => state.forensics.vehicleType)
  const color = useSelector(state => state.forensics.vehicleColor)

  const handleTypeChange = event => {
    dispatch(setVehicleFilters({ type: event.target.value, color }))
    onChange()
  }

  const handleColorChange = event => {
    dispatch(setVehicleFilters({ type, color: event.target.value }))
    onChange()
  }

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Tooltip
      content={
        <Typography className={'am-subtitle1'}>Vehicle Filters</Typography>
      }
      placement='bottom'
      theme='ambient-white'
      arrow
    >
      <div>
        <Button variant='contained' color='primary' onClick={handleOpen}>
          <DriveEtaIcon /> Vehicle
        </Button>
        <Popover
          open={!!anchorEl}
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
          <Paper>
            <Grid container direction='row' spacing={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id='vehicle-type-label'>Vehicle Type</InputLabel>
                <Select
                  labelId='vehicle-type-label'
                  id='vehicle-type'
                  value={type}
                  onChange={handleTypeChange}
                  classes={{ select: classes.menuItem }}
                >
                  <MenuItem value={null}>
                    <em>Any</em>
                  </MenuItem>
                  {map(typeMap, (value, index) => (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel id='vehicle-color-label'>Vehicle Color</InputLabel>
                <Select
                  labelId='vehicle-color-label'
                  id='vehicle-color'
                  value={color}
                  onChange={handleColorChange}
                  classes={{ select: classes.menuItem }}
                >
                  <MenuItem value={null}>
                    <em>Any</em>
                  </MenuItem>
                  {map(colorMap, (value, key) => (
                    <MenuItem key={key} value={key}>
                      <StopIcon style={{ color: key }} />
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Paper>
        </Popover>
      </div>
    </Tooltip>
  )
}

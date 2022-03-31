import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Grid, Avatar } from '@material-ui/core'
import { get } from 'lodash'
import clsx from 'clsx'
// src
import { setActiveZone } from 'features/StreamConfiguration/streamConfigurationSlice'
import { useCursorStyles } from 'common/styles/commonStyles'

import makeStyles from './styles'

const propTypes = {
  zone: PropTypes.object.isRequired,
}

function ZoneLayer({ zone }) {
  const dispatch = useDispatch()
  const activeZone = useSelector(state => state.streamConfiguration.activeZone)
  const isActiveZone = get(activeZone, 'id') === zone.id

  const classes = makeStyles({ zone, isActiveZone })
  const cursorClasses = useCursorStyles()
  const selectZone = () => {
    dispatch(setActiveZone({ zone }))
  }

  return (
    <Grid
      item
      container
      direction='row'
      justify='flex-start'
      alignItems='center'
      onClick={selectZone}
      className={clsx(cursorClasses.pointer, classes.box)}
    >
      <Box m={1}>
        <Avatar className={classes.zoneCircle}> </Avatar>
      </Box>
      <Box ml={1} className='am-subtitle1'>
        {zone.name}
      </Box>
    </Grid>
  )
}

ZoneLayer.propTypes = propTypes

export default ZoneLayer

import React from 'react'
import { useSelector } from 'react-redux'
import { Grid, Box } from '@material-ui/core'
import { map } from 'lodash'
// src
import PageTitle from 'components/Page/Title'

import ZoneItem from '../LayerSelector/components/ZoneItem'
import ZoneLayer from '../ZoneLayer'

function ZoneSelector() {
  const zones = useSelector(state => state.streamConfiguration.zones)

  return (
    <Grid container alignContent='center'>
      <Grid item xs={12}>
        <Box mt={1} mb={1} ml={1}>
          <PageTitle title='Zones' sizeClass='am-h5' />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box m={1}>
          <ZoneItem />
        </Box>
      </Grid>
      {map(zones, zone => (
        <ZoneLayer key={`zone-${zone.id}`} zone={zone} />
      ))}
    </Grid>
  )
}

export default ZoneSelector

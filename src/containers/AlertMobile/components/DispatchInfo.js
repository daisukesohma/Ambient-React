import React from 'react'
import PropTypes from 'prop-types'
import { Box, Grid } from '@material-ui/core'
// src
import ResponderList from 'components/AlertCommon/ResponderList'
import DispatchMap from 'components/AlertEvent/DispatchMap'

function DispatchInfo({ lat, lng, responders }) {
  return (
    <div>
      <DispatchMap lat={lat} lng={lng} />
      <Grid container>
        {responders && (
          <Box mt={2} width={1}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <ResponderList responders={responders} />
            </Grid>
          </Box>
        )}
      </Grid>
    </div>
  )
}

DispatchInfo.propTypes = {
  lat: PropTypes.string,
  lng: PropTypes.string,
  responders: PropTypes.array,
  timeline: PropTypes.array,
  respondersResponse: PropTypes.object,
}

export default DispatchInfo

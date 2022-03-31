// React
import React from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import MeetingRoomsConcept from './components/MeetingRoomsConcept'
import WorkstationsConcept from './components/WorkstationsConcept'
import BuildingsConcept from './components/BuildingsConcept'
import TertiarySpacesConcept from './components/TertiarySpacesConcept'

/*
 * Concept dashboard is used in demos where we want more flexibility with
 * the content and the presentation, such as using room names and showing
 * visual heatmaps. This was originally built for Adobe Sensor RFP
 */
export default function DashboardConcept() {
  return (
    <Grid container>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box mb={2}>
          <BuildingsConcept />
        </Box>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box mb={2}>
          <MeetingRoomsConcept />
        </Box>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box mb={2}>
          <WorkstationsConcept />
        </Box>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box mb={2}>
          <TertiarySpacesConcept />
        </Box>
      </Grid>
    </Grid>
  )
}

import React from 'react'
import { Grid } from '@material-ui/core'
import clsx from 'clsx'

import StreamSelectionPanel from './components/StreamSelectionPanel'
import StreamConfigurationToolbar from './components/StreamConfigurationToolbar'
import ViewStreamStage from './components/ViewStreamStage' // one stage for everything
import useStyles from './styles'

export default function StreamConfiguration() {
  const classes = useStyles()

  return (
    <Grid
      container
      className={classes.maximized}
      id='stream-configuration-main-container'
    >
      <Grid item xs={12}>
        <StreamSelectionPanel />
      </Grid>
      <Grid
        item
        lg={3}
        md={3}
        sm={3}
        xs={3}
        className={clsx(
          classes.maximized,
          classes.overflowY,
          classes.borderRight,
        )}
      >
        <StreamConfigurationToolbar />
      </Grid>
      <Grid item lg={7} md={7} sm={7} xs={7}>
        <ViewStreamStage />
      </Grid>
    </Grid>
  )
}

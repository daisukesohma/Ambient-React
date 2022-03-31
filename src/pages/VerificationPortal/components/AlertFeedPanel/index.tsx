import React from 'react'
import { Grid } from '@material-ui/core'

// src
import AlertFeedContainer from './AlertFeedContainer'
import useStyles from './styles'

function AlertFeedPanel(): JSX.Element {
  const classes = useStyles()

  return (
    <Grid container direction='column' className={classes.contentContainer}>
      <AlertFeedContainer />
    </Grid>
  )
}

export default AlertFeedPanel

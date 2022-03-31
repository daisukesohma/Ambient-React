import React from 'react'

import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'

import clsx from 'clsx'

// src
import ErrorContent from './ErrorContent'
import useStyles from './style'

export default function ErrorPage() {
  const classes = useStyles()

  return (
    <Container
      maxWidth
      disableGuttes
      className={clsx(classes.container, classes.wrapper)}
    >
      <Grid
        container
        justify='center'
        alignItems='center'
        classes={{ root: classes.wrapper }}
      >
        <Grid item display='flex'>
          <ErrorContent />
        </Grid>
      </Grid>
    </Container>
  )
}

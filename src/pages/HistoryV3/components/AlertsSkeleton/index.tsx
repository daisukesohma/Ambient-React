import React from 'react'
import { Grid } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { times } from 'lodash'

import useStyles from './styles'

export default function AlertsSkeleton(): JSX.Element {
  const classes = useStyles()
  return (
    <Grid container>
      <Grid container spacing={2}>
        {times(12, index => (
          <Grid item xl={3} lg={3} md={3} sm={12} xs={12} key={index}>
            <Skeleton variant='rect' width='100%' height={400} classes={{ root: classes.root }} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

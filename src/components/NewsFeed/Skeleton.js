import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

const useStyles = makeStyles(({ palette }) => ({
  newsFeedRoot: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    right: 0,
    bottom: 0,
    top: 60,
    width: 200,
    backgroundColor: palette.grey[200],
    padding: 5,
  },
  newsFeedEventContainer: {
    flex: 1,
    overflowY: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  event: {
    width: 200,
    height: 150,
    marginBottom: 10,
    backgroundColor: palette.grey[400],
  },
  filter: {
    width: 200,
    height: 50,
    marginBottom: 10,
    backgroundColor: palette.grey[400],
  },
  header: {
    width: 200,
    height: 70,
    marginBottom: 10,
    backgroundColor: palette.grey[400],
  },
}))

export default function NewsFeedSkeleton() {
  const classes = useStyles()

  return (
    <div className={classes.newsFeedRoot}>
      <Skeleton variant='rect' className={classes.header} />
      <Grid className={classes.newsFeedEventContainer}>
        <Skeleton variant='rect' className={classes.event} />
        <Skeleton variant='rect' className={classes.event} />
        <Skeleton variant='rect' className={classes.event} />
      </Grid>
      <Skeleton variant='rect' className={classes.filter} />
    </div>
  )
}

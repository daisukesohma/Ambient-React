import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  item: {
    width: '100%',
    height: 200,
    backgroundColor: theme.palette.grey[400],
  },
}))

const VideoWallSkeleton = () => {
  const classes = useStyles()

  const renderItems = () => {
    const items = []
    for (let i = 0; i < 12; i++) {
      items.push(
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={i}>
          <Skeleton className={classes.item} />
        </Grid>,
      )
    }
    return items
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {renderItems()}
      </Grid>
    </div>
  )
}

export default VideoWallSkeleton

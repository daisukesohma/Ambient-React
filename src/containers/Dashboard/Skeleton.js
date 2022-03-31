import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import VideoWallSkeleton from '../../components/VideoWall/Skeleton'
import NewsFeedSkeleton from '../../components/NewsFeed/Skeleton'

import SecurityProfileSelectorSkeleton from './SecurityProfileSelector/Skeleton'
import './style.css'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 'calc(100% - 200px)',
    paddingTop: 70,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginRight: 5,
  },
}))

const DashboardSkeleton = () => {
  const classes = useStyles()

  return (
    <Grid>
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <SecurityProfileSelectorSkeleton />
        </Grid>
        <VideoWallSkeleton />
      </Grid>
      <NewsFeedSkeleton />
    </Grid>
  )
}

export default DashboardSkeleton

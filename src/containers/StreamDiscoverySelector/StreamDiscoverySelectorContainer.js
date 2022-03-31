import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useSelector } from 'react-redux'

import PageTitle from '../../components/Page/Title'

import StreamDiscoverySelectorGrid from './components/StreamDiscoverySelectorGrid'
import StreamDiscoverySelectorToolbar from './components/StreamDiscoverySelectorToolbar'
import useStyles from './styles'

export default function StreamDiscoverySelectorContainer() {
  const classes = useStyles()
  const isLoading = useSelector(state => state.streamDiscovery.loading)

  return (
    <div>
      <div className={classes.title}>
        <PageTitle title='Stream Discovery' />
      </div>
      <div className={classes.toolbar}>
        <StreamDiscoverySelectorToolbar />
      </div>
      <div>
        {isLoading && <LinearProgress />}
        <StreamDiscoverySelectorGrid />
      </div>
    </div>
  )
}

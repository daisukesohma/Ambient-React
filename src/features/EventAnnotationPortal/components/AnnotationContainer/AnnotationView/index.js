import React from 'react'
import { CircularProgress } from 'ambient_ui'
import { useSelector } from 'react-redux'

import InfoView from './InfoView'
import VideoView from './VideoView'

import useStyles from './styles'

function AnnotationView() {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const getEventAnnotationLoading = useSelector(
    state => state.eventAnnotationPortal.getEventAnnotationLoading,
  )

  return (
    <div className={classes.root}>
      <VideoView />
      {getEventAnnotationLoading ? (
        <div className={classes.loadingContainer}>
          Loading ... <CircularProgress />
        </div>
      ) : (
        <InfoView />
      )}
    </div>
  )
}

export default AnnotationView

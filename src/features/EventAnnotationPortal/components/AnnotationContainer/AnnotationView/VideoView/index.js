import React from 'react'
import { useSelector } from 'react-redux'

import { getHost } from '../../../../../../utils'

import useStyles from './styles'

function VideoView() {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const isNormalView = useSelector(
    state => state.eventAnnotationPortal.isNormalView,
  )
  const videoComponentKey = useSelector(
    state => state.eventAnnotationPortal.videoComponentKey,
  )
  const currentVideoArchiveLink = useSelector(
    state => state.eventAnnotationPortal.currentVideoArchiveLink,
  )
  const currentVideoArchiveSPELink = useSelector(
    state => state.eventAnnotationPortal.currentVideoArchiveSPELink,
  )
  const speLink =
    currentVideoArchiveSPELink &&
    currentVideoArchiveSPELink.indexOf('http') === -1
      ? `${getHost()}${currentVideoArchiveSPELink}`
      : currentVideoArchiveSPELink

  return (
    <div style={{ flex: 1 }}>
      {isNormalView ? (
        <video
          key={videoComponentKey}
          className={classes.videoContainer}
          controls
          autoPlay
          loop
        >
          <source
            src={currentVideoArchiveLink}
            className={classes.mp4Source}
            type='video/mp4'
          />
        </video>
      ) : (
        <img src={speLink} className={classes.gifSource} alt='Evidence Clip' />
      )}
    </div>
  )
}

export default VideoView

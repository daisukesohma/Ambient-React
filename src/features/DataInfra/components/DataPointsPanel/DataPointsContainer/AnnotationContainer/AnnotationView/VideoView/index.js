import React from 'react'
import { useSelector } from 'react-redux'

import { getHost } from '../../../../../../../../utils'

import useStyles from './styles'

function VideoView() {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const isNormalView = useSelector(state => state.dataInfra.isNormalView)
  const videoComponentKey = useSelector(
    state => state.dataInfra.videoComponentKey,
  )
  const currentDataPoint = useSelector(
    state => state.dataInfra.currentDataPoint,
  )

  const { videoArchive } = currentDataPoint
  const speLink =
    currentDataPoint.speLink && currentDataPoint.speLink.indexOf('http') === -1
      ? `${getHost()}${currentDataPoint.speLink}`
      : currentDataPoint.speLink

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
            src={videoArchive.videoArchive.link}
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

/* eslint-disable */
import React from 'react'
import { useParams } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import VideoWallGridLayout from './components/VideoWallGridLayout'
import LoadingScreen from '../../containers/LoadingScreen'
/*
 * Wrapper Component That Handles API calls outside and acts as source of truth/cache from database
 */

const VideoWall = () => {
  const { account, site } = useParams()
  const videoWallOptions = [
    {
      value: null,
      label: 'All Streams',
    },
  ]

  if (!site) {
    return <LoadingScreen />
  }

  return (
    <div style={isMobile ? { height: '100%', position: 'relative' } : {}}>
      <VideoWallGridLayout
        accountSlug={account}
        siteSlug={site}
        handleLayoutChange={() => {}}
        editing={false}
        selectedVideoWallOption={videoWallOptions}
      />
    </div>
  )
}

export default VideoWall

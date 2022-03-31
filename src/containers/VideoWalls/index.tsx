import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const VideoWalls = lazy(() => import('./VideoWalls'))

export default function VideoWallsIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <VideoWalls />
    </Suspense>
  )
}

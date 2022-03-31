import React, { lazy, Suspense } from 'react'
// src
import { withLayout } from 'hoc'
import SidebarLayout from 'layouts/SidebarLayout'
import LoadingScreen from 'containers/LoadingScreen'

const Video = lazy(() => import('./components/video'))

function VideoIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Video />
    </Suspense>
  )
}

export default withLayout(SidebarLayout, {
  hasMobileVersion: false,
})(VideoIndex)

import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const StreamConfiguration = lazy(() => import('./StreamConfiguration'))

export default function StreamConfigurationIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <StreamConfiguration />
    </Suspense>
  )
}
